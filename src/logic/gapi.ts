let loaded = false
let gapiPromise: Promise<void> | undefined

export const getGAPI = async() => {
  if (loaded) return
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
  })()
  return gapiPromise
}

export async function getEvents(calendarId: string) {
  const request = await gapi.client.calendar.events.list({
    calendarId: calendarId
  })
  return request.result.items
}