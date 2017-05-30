const apiKey = process.env.REACT_APP_GOOGLE_PUBLIC_API_KEY
const calendarId = window.encodeURIComponent(process.env.REACT_APP_SHOWS_CALENDAR_ID)
const calendarUrl = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}`

const dateRegex = /^(\d{4})-(\d{2})-(\d{2})[T ](\d{2}):(\d{2}):(\d{2})\.?(\d{3})?(?:(?:([+-]\d{2}):?(\d{2}))|Z)?$/

const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sept',
  'Oct',
  'Nov',
  'Dec'
]

function parseISODate (d) {
  var m = dateRegex.exec(d)
  // milliseconds are optional.
  if (m[7] === undefined) {
    m[7] = 0
  }

  // if timezone is undefined, it must be Z or nothing (otherwise the group would have captured).
  if (m[8] === undefined && m[9] === undefined) {
    // Use UTC.
    m[8] = 0
    m[9] = 0
  }

  var year = +m[1]
  var month = +m[2]
  var day = +m[3]
  var hour = +m[4]
  var minute = +m[5]
  var second = +m[6]
  var msec = +m[7]
  var tzHour = +m[8]
  var tzMin = +m[9]
  var tzOffset = tzHour * 60 + tzMin

  // return new Date(year, month - 1, day, hour, minute - tzOffset, second, msec)
  return new Date(year, month - 1, day, hour, minute - tzOffset, second, msec)
}

const getLocation = show => {
  const location = show.location.split(',')
  const stateAndZip = location[location.length - 2]
  const state = stateAndZip.replace(/\d/g, '').trim()
  const city = location[location.length - 3].trim()
  return [city, state].join(', ')
}

const getEventDate = show => {
  const date = parseISODate(show.start.dateTime)
  const month = months[date.getMonth()]
  const day = date.getDate()
  const year = date.getFullYear()
  return month + ' ' + day + ' ' + year
}

const formatShow = show => {
  const venue = show.summary
  const date = getEventDate(show)
  const location = getLocation(show)
  const linkUrl = show.description
  return {
    location,
    venue,
    date,
    link: linkUrl
  }
}

const getShows = () =>
  window.fetch(calendarUrl)
    .then(response => response.json())
    .then(json => json.items.map(formatShow))
    .catch(error => {
      throw error
    })

export default getShows
