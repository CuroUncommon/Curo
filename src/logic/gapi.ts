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

export const getEvents = async(calendarId: string, start: Date, end: Date) => {
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

export const addEvent = async(calendarId: string, title: string, start: Date, end: Date) => {
  const startDateTime = start.toISOString()
  const endDateTime = end.toISOString()
  return (await getGAPI()).client.calendar.events.insert({
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
}
