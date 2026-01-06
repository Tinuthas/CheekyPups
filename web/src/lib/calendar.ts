import dayjs from 'dayjs';
import axios from "axios";

const CALENDAR_API_KEY = import.meta.env.VITE_CALENDAR_API_KEY
const CALENDAR_BOARDING = import.meta.env.VITE_CALENDAR_BOARDING
const CALENDAR_HOLIDAYS = import.meta.env.VITE_CALENDAR_HOLIDAYS
const CALENDAR_STAFF = import.meta.env.VITE_CALENDAR_STAFF
const CALENDAR_DAYCARE = import.meta.env.VITE_CALENDAR_DAYCARE

const calendar = axios.create({
  baseURL: 'https://www.googleapis.com/calendar/v3/calendars/',
})

export async function getCalendarListEvents() {
  try {
    var holidays = await getHolidays()
    var staffDays = await getStaffDays()
    return {holidays, staffDays}
  } catch (err) {
    console.log(err)
  }

}

async function getHolidays() {
  return await calendar.get(`${CALENDAR_HOLIDAYS.replace('#', '%23').replace('@', '%40')}/events?key=${CALENDAR_API_KEY}`).then(result => {
    var data = JSON.parse(JSON.stringify(result.data));
    var holidays: any[] = []
    data.items.forEach((element: any) => {
      holidays.push({
        name: element.summary,
        start: element.start.date,
        end: element.end.date
      })
    });
    return holidays
  }).catch(err => {
    console.log(err)
    return null
  })
}

async function getStaffDays(){
  return await calendar.get(`${CALENDAR_STAFF.replace('#', '%23').replace('@', '%40')}/events?key=${CALENDAR_API_KEY}`).then(result => {
    var data = JSON.parse(JSON.stringify(result.data));
    var staff: any[] = []
    data.items.forEach((element: any) => {
      staff.push({
        name: element.summary,
        start: element.start.date,
        end: element.end.date
      })
    });
    return staff
  }).catch(err => {
    console.log(err)
    return null
  })
}
