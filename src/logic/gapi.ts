import dayjs, { Dayjs } from 'dayjs'
import { IEvent } from '~/types'

let loaded = false
// eslint-disable-next-line no-restricted-globals
let gapiPromise: Promise<typeof gapi> | undefined

/* eslint-disable no-restricted-globals */
export const getGAPI = async() => {
  if (loaded) return gapi
  if (gapiPromise) return gapiPromise
  gapiPromise = (async() => {
    await new Promise((resolve) => {
      gapi.load('client', resolve)
    })
    await gapi.client.init({
      apiKey: 'AIzaSyBnQXDP5hR8tbxyFKCP_cUnzN4wKGhFfI8',
      clientId: '869858699920-6pgeenk8pbg6lf0mn4kpjmqde87uoeae.apps.googleusercontent.com',
      scope: 'https://www.googleapis.com/auth/calendar',
    })
    await gapi.client.load('calendar', 'v3')
    loaded = true
    return gapi
  })()
  return gapiPromise
}
/* eslint-enable no-restricted-globals */

export const getEvents = async(calendarId: string, start: Dayjs, end: Dayjs) => {
  const startDateTime = start.toISOString()
  const endDateTime = end.toISOString()
  const request = await (await getGAPI()).client.calendar.events.list({
    calendarId,
    timeMin: startDateTime,
    timeMax: endDateTime,
    orderBy: 'startTime',
    singleEvents: true,
  })
  return request.result.items
}

export const getAllEvents = async(calendarId: string) => {
  console.log('Getting all events...')
  const request = await (await getGAPI()).client.calendar.events.list({
    calendarId,
    orderBy: 'startTime',
    singleEvents: true,
  })
  return request.result.items?.map<IEvent>(ev => ({
    summary: ev.summary || 'unknown summary',
    start: dayjs(ev.start?.dateTime),
    end: dayjs(ev.end?.dateTime),
    id: ev.id || 'unknown id',
  }))
}

export const getCalendars = async() => {
  console.log('getting calendars!')
  const request = await (await getGAPI()).client.calendar.calendarList.list()
  return request.result.items
}

export const addEvent = async(calendarId: string, title: string, start: Dayjs, end: Dayjs, batch?: gapi.client.Batch<any>) => {
  const startDateTime = start.toISOString()
  const endDateTime = end.toISOString()
  const req = (await getGAPI()).client.calendar.events.insert({
    calendarId,
    resource: {
      summary: title,
      start: {
        dateTime: startDateTime,
      },
      end: {
        dateTime: endDateTime,
      },
    },
  })
  if (batch)
    batch.add(req)

  else
    return req
}
