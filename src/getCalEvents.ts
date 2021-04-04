import { getGAPI } from './logic/gapi'

export async function getEvents(calendarId: string) {
  await getGAPI()
  const request = await gapi.client.calendar.events.list({
    calendarId,
  })
  return request.result.items
}
