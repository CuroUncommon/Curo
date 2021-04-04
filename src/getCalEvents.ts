async function getEvents(calendarId: string) {
  const request = await gapi.client.calendar.events.list({
    calendarId: calendarId
  })
  return request.result.items
}

export {
  getEvents,
}