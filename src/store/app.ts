import { Dayjs } from 'dayjs'
import { isClient } from '@vueuse/core'
import { Store } from './store'
import { IEvent } from '~/types'

const localStorageSetItem = (key: string, value: string) => {
  if (isClient)
    localStorage.setItem(key, value)
}

const localStorageGetItem = (key: string) => {
  if (isClient)
    return localStorage.getItem(key)
}

export interface IGoal {
  totalTime: number // minutes
  minBlockTime: number // minutes
  timePeriod: number // minutes
  dayStart: Dayjs
  events: IEvent[] // event IDs
}
interface IAppState {
  // list of user's calendars
  // eslint-disable-next-line no-restricted-globals
  calendars?: gapi.client.calendar.CalendarListEntry[]
  // goals written to this calendar
  // eslint-disable-next-line no-restricted-globals
  goalCalendar?: gapi.client.calendar.CalendarListEntry
  // calendar appointments are read from
  // eslint-disable-next-line no-restricted-globals
  readCalendar?: gapi.client.calendar.CalendarListEntry
  // eslint-disable-next-line no-restricted-globals
  goalEvents?: IEvent[]
  // eslint-disable-next-line no-restricted-globals
  userEvents?: gapi.client.calendar.Event[]
  // TODO: index by something else or just keep it as a list
  goals: {
    [key: string]: IGoal
  }
}

class AppStore extends Store<IAppState> {
  // eslint-disable-next-line no-restricted-globals
  setCalendars(calendars?: gapi.client.calendar.CalendarListEntry[]) {
    this.state.calendars = calendars
  }

  // eslint-disable-next-line no-restricted-globals
  setGoalCalendar(cal?: gapi.client.calendar.CalendarListEntry) {
    localStorageSetItem('goalCal', JSON.stringify(cal))
    this.state.goalCalendar = cal
  }

  // eslint-disable-next-line no-restricted-globals
  setReadCalendar(cal?: gapi.client.calendar.CalendarListEntry) {
    localStorageSetItem('readCal', JSON.stringify(cal))
    this.state.readCalendar = cal
  }

  setGoalEvents(ev?: IEvent[]) {
    this.state.goalEvents = ev
  }

  setUserEvents(ev?: gapi.client.calendar.Event[]) {
    this.state.userEvents = ev
  }

  setGoals(goals: { [key: string]: IGoal }) {
    localStorageSetItem('goals', JSON.stringify(goals))
    this.state.goals = goals
  }

  getGoals() {
    return this.state.goals
  }

  getUserCal() {
    return this.state.readCalendar
  }

  getGoalCal() {
    return this.state.goalCalendar
  }

  getCalendars() {
    return this.state.calendars
  }

  getGoalEvents() {
    return this.state.goalEvents
  }

  getUserEvents() {
    return this.state.userEvents
  }
}

const goalCal = localStorageGetItem('goalCal') || undefined
const readCal = localStorageGetItem('readCal') || undefined
const goals = localStorageGetItem('goals') || undefined

export const appStore = new AppStore({
  calendars: [],
  goalCalendar: goalCal ? JSON.parse(goalCal) : undefined,
  readCalendar: readCal ? JSON.parse(readCal) : undefined,
  goals: goals ? JSON.parse(goals) : {},
})

if (isClient)
// @ts-ignore
  window.appStore = appStore
