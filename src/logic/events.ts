import dayjs from 'dayjs'
import { addEvent } from './gapi'

const isDateInRange = (date: Date, start: Date, end: Date) => date > start && date < end

// eslint-disable-next-line no-restricted-globals
const isEventInTimeRange = (start: Date, end: Date, events: gapi.client.calendar.Event[]) => {
  for (const ev of events) {
    if (!ev.start?.dateTime || !ev.end?.dateTime) continue
    const eventStart = new Date(ev.start.dateTime)
    const eventEnd = new Date(ev.end.dateTime)
    if (
      isDateInRange(eventEnd, start, end) // event starts inside of the time range
      || isDateInRange(eventStart, start, end) // event ends in the time range
      || (eventStart < start && eventEnd > end) // (time range starts and ends inside event)
    )
      return true
  }
  return false
}

const addMinsToDate = (date: Date, mins: number) => {
  return new Date(date.getTime() + 1000 * 60 * mins)
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
  events: gapi.client.calendar.Event[],
  day: dayjs.Dayjs,
  name: string,
  minutesToSchedule: number,
  minBlockLength: number,
): Promise<number> => {
  let minutesScheduled = 0
  for (const [i, ev] of events.entries()) {
    const nextEventStartTime
      = i === events.length - 1
        ? day.endOf('day').toDate()
        : new Date(events[i + 1].start!.dateTime!)

    const endTime = new Date(ev.end!.dateTime!)
    if (
      isEventInTimeRange(
        endTime,
        addMinsToDate(endTime, minBlockLength), events)
    ) continue
    const minutesLeftToSchedule = minutesToSchedule - minutesScheduled
    const freeTime = (nextEventStartTime.getTime() - endTime.getTime()) / (60 * 1000)
    const scheduleTime = Math.max(Math.min(freeTime, minutesLeftToSchedule), minBlockLength)
    if (scheduleTime === 0) continue
    console.log('schedule time applyForDay', { scheduleTime, freeTime, minutesLeftToSchedule })
    await addEvent('primary', name, endTime, addMinsToDate(endTime, scheduleTime))

    minutesScheduled += scheduleTime
    if (minutesScheduled >= minutesToSchedule)
      break
  }
  return minutesScheduled
}

export const applyGoal = async(
  // eslint-disable-next-line no-restricted-globals
  events: gapi.client.calendar.Event[],
  name: string,
  timeForGoal: number, // minutes
  timePeriod: number, // days
  minBlockLength: number, // minutes
) => {
  let timePerDay = timeForGoal / timePeriod
  console.log(timePerDay)
  let minutesScheduled = 0
  for (let i = 0; i < timePeriod; i++) {
    const numDaysRemaining = timePeriod - i
    // const todaysEvents = events.slice(events.findIndex((v, i) => {
    //   const start = dayjs(v.start!.dateTime!)
    //   const shouldBe = dayjs().add(i, 'day')
    //   return start.diff(shouldBe) < 0
    // }))
    const todaysEvents = [...events].filter((ev) => {
      const shouldBe = dayjs().add(i, 'day')
      const start = shouldBe.startOf('day').toDate()
      const end = shouldBe.endOf('day').toDate()
      const eventStart = new Date(ev.start!.dateTime!)
      const eventEnd = new Date(ev.end!.dateTime!)
      if (
        isDateInRange(eventEnd, start, end) // event starts inside of the time range
        || isDateInRange(eventStart, start, end) // event ends in the time range
        || (eventStart < start && eventEnd > end) // (time range starts and ends inside event)
      )
        return true
      else
        return false
    })
    console.log(todaysEvents)
    minutesScheduled += await applyForDay(todaysEvents, dayjs().add(i, 'day'), name, timePerDay, minBlockLength)
    timePerDay = ((timeForGoal - minutesScheduled) / timePeriod)
  }
}
