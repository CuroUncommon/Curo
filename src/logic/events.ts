import dayjs, { Dayjs } from 'dayjs'
import { computed, watch, onMounted } from 'vue'
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter'
import { addEvent, getAllEvents, getGAPI } from './gapi'
import { appStore, IGoal } from '~/store/app'
import { IEvent } from '~/types'
dayjs.extend(isSameOrAfter)

const isDateInRange = (date: Dayjs, start: Dayjs, end: Dayjs) => date.isAfter(start) && date.isBefore(end)

// eslint-disable-next-line no-restricted-globals
const isEventInTimeRange = (start: Dayjs, end: Dayjs, events: IEvent[]) => {
  for (const ev of events) {
    if (
      isDateInRange(end, ev.start, ev.end) // event starts inside of the time range
      || (ev.start.isSameOrAfter(start) && ev.start.isBefore(end)) // event ends in the time range
      || (ev.start.isBefore(start) && ev.end.isAfter(end)) // (time range starts and ends inside event)
      || (ev.start.isSame(start) && ev.end.isSame(end))
    ) {
      // console.log('event in time range: ev start: ', ev.start, ' ev end: ', ev.end, ' start: ', start, ' end: ', end)
      return true
    }
  }
  // console.log('NOT IN TIME RANGE', 'start: ', start, ' end: ', end)
  return false
}

/**
 * Assumptions
 * - The events are within a single day
 * - The events are sorted by start time
 * - The events all have start and end *times*
 */
// cursed.
export const applyForDay = async(
  // eslint-disable-next-line no-restricted-globals
  calendarID: string,
  events: IEvent[],
  day: dayjs.Dayjs,
  name: string,
  minutesToSchedule: number,
  minBlockLength: number,
  batch: gapi.client.Batch<any>,
): Promise<number> => {
  let minutesScheduled = 0
  for (const [i, ev] of events.entries()) {
    const nextEventStartTime
      = i === events.length - 1
        ? day.endOf('day')
        : events[i + 1].start

    if (
      isEventInTimeRange(
        ev.end,
        ev.end.add(minBlockLength, 'minute'), events)
    ) continue

    const freeTime = nextEventStartTime.diff(ev.end, 'minute') / (60 * 1000)
    const remainingMinutesToSchdule = minutesToSchedule - minutesScheduled

    const scheduleTime = Math.min(Math.max(minBlockLength, freeTime), remainingMinutesToSchdule)
    if (scheduleTime === 0) continue
    await addEvent(calendarID, name, ev.end, ev.end.add(scheduleTime, 'minute'), batch)

    minutesScheduled += scheduleTime
    if (minutesScheduled >= minutesToSchedule)
      break
  }

  return minutesScheduled
}

export const applyGoalToBatch = async(
  calendarID: string,
  // eslint-disable-next-line no-restricted-globals
  events: IEvent[],
  name: string,
  dayStart: dayjs.Dayjs,
  timeForGoal: number, // minutes
  timePeriod: number, // days
  minBlockLength: number, // minutes
  batch: gapi.client.Batch<any>,
) => {
  const timePerDay = timeForGoal / timePeriod
  console.log('events', events)
  let timeForGoalRemaining = timeForGoal
  for (let i = 0; i < timePeriod; i++) {
    const todaysEvents = [...events].filter((ev) => {
      const shouldBe = dayjs().add(i, 'day')
      const start = shouldBe.startOf('day')
      const end = shouldBe.endOf('day')
      const eventStart = ev.start
      const eventEnd = ev.end
      if (
        isDateInRange(eventEnd, start, end) // event starts inside of the time range
        || isDateInRange(eventStart, start, end) // event ends in the time range
        || (eventStart < start && eventEnd > end) // (time range starts and ends inside event)
      )
        return true
      else
        return false
    })
    const minutesToSchedule = Math.min(Math.max(minBlockLength, timePerDay), timeForGoalRemaining)
    console.log('ith day: ', i)
    console.log('todays events', todaysEvents)
    timeForGoalRemaining -= await applyForDay(calendarID, todaysEvents, dayStart.add(i, 'day'), name, minutesToSchedule, minBlockLength, batch)
  }
}

export const applyGoal = async(
  calendarID: string,
  // eslint-disable-next-line no-restricted-globals
  events: IEvent[],
  name: string,
  dayStart: dayjs.Dayjs,
  timeForGoal: number, // minutes
  timePeriod: number, // days
  minBlockLength: number, // minutes
) => {
  const batch = (await getGAPI()).client.newBatch()
  await applyGoalToBatch(calendarID, events, name, dayStart, timeForGoal, timePeriod, minBlockLength, batch)
  console.log('batch', batch)
  const res = await batch
  console.log('res', res)
  const goals = appStore.getGoals()
  const goal: IGoal = {
    totalTime: timeForGoal, // minutes
    minBlockTime: minBlockLength, // minutes
    dayStart,
    events: [], // events list
    timePeriod,
  }

  for (const addedEv of Object.values(res.result)) {
    const calendarEvent = addedEv.result as gapi.client.calendar.Event
    goal.events.push({
      id: calendarEvent.id || 'unknown id',
      summary: calendarEvent.summary || 'unknown summary',
      start: dayjs(calendarEvent.start?.dateTime),
      end: dayjs(calendarEvent.end?.dateTime),
    })
  }

  goals[name] = goal
  appStore.setGoals(goals)
}

export const useMappedEvents = () => {
  const cal = computed(() => appStore.getGoalCal())
  const events = computed(() => appStore.getGoalEvents())
  watch(cal, async() => {
    if (!cal.value?.id || !!events.value) return
    appStore.setGoalEvents(await getAllEvents(cal.value.id))
  })

  onMounted(async() => {
    if (!cal.value?.id || !!events.value) return
    appStore.setGoalEvents(await getAllEvents(cal.value.id))
  })

  return computed(() => {
    if (!events.value) return
    return events.value.reduce<{
      [day: number]: IEvent[]
    }>((obj, ev) => {
      const date = ev.start.date()
      if (!obj[date]) obj[date] = []
      obj[date].push(ev)
      return obj
    }, {})
  })
}

export const deleteAllEventsByID = async(calendar: string, ids: string[], batch?: gapi.client.Batch<any>) => {
  const b = batch ?? (await getGAPI()).client.newBatch()
  ids.forEach(id => b.add(gapi.client.calendar.events.delete({
    calendarId: calendar,
    eventId: id,
  })))
  return await b
}

export const updateGoals = async() => {
  const gapi = await getGAPI()
  const batch = gapi.client.newBatch()

  // destroy it all
  const goals = appStore.getGoals()
  const goalCal = appStore.getGoalCal()
  const events = appStore.getUserEvents()
  if (!goalCal?.id || !goals || !events) return
  const allGoalIDs = Object.values(goals).flatMap(g => g.events.map(ev => ev.id))
  deleteAllEventsByID(goalCal?.id, allGoalIDs)
  // add it back in using algo
  for (const [name, goal] of Object.entries(goals)) {
    applyGoalToBatch(
      goalCal.id,
      events.map(ev => ({
        summary: ev.summary || 'unknown summary',
        start: dayjs(ev.start?.dateTime),
        end: dayjs(ev.end?.dateTime),
        id: ev.id || 'unkown id',
      })),
      name, goal.dayStart, goal.totalTime, goal.timePeriod, goal.minBlockTime, batch,
    )
  }
  return await batch
}
