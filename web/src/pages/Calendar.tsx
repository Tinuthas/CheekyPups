import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import listWeek from '@fullcalendar/list'
import googleCalendarPlugin from '@fullcalendar/google-calendar';
import { Helmet } from 'react-helmet'
import { useEffect, useState } from 'react';
import ApiCalendar from "react-google-calendar-api";
import dayjs from 'dayjs';
import { getCalendarListEvents } from '../lib/calendar';

const CALENDAR_API_KEY = import.meta.env.VITE_CALENDAR_API_KEY
const CALENDAR_BOARDING = import.meta.env.VITE_CALENDAR_BOARDING
const CALENDAR_HOLIDAYS = import.meta.env.VITE_CALENDAR_HOLIDAYS
const CALENDAR_STAFF = import.meta.env.VITE_CALENDAR_STAFF
const CALENDAR_DAYCARE = import.meta.env.VITE_CALENDAR_DAYCARE


export default function Calendars() {

  function getHolidaysEvents(apiCalendar:any) {
    try{
      apiCalendar.listEvents({
        timeMin: dayjs().add(-6, 'month').toISOString(),
        timeMax: dayjs().add(24, 'month').toISOString()
      }, CALENDAR_HOLIDAYS).then(({ result }: any) => {
        try{
          console.log(result.items);
          var itemsResult = result.items
          var listEvent: { start: any; end: any; name: any; }[] = []
          itemsResult.forEach((event: any) => {
            listEvent.push({
              start: event.start.date,
              end: event.end.date,
              name: event.summary
            })
          });
            console.log('events')
            console.log(listEvent)
        }catch(errr) {

        }
    }).catch((err: any) => {
      console.log(err)
    })
    }catch(err) {
      console.log(err)
    }
  }

  function getStaffsEvents(apiCalendar:any) {
    try{
      apiCalendar.listEvents({
        timeMin: dayjs().add(-6, 'month').toISOString(),
        timeMax: dayjs().add(24, 'month').toISOString()
      }, CALENDAR_STAFF).then(({ result }: any) => {
        try{
          console.log(result.items);
          var itemsResult = result.items
          var listEvent: { start: any; end: any; name: any; }[] = []
          itemsResult.forEach((event: any) => {
            listEvent.push({
              start: event.start.date,
              end: event.end.date,
              name: event.summary
            })
          });
            console.log('events')
            console.log(listEvent)
        }catch(errr) {

        }
    })
    }catch(err) {
      console.log(err)
    }
  }

  return (
    <div className='w-full py-10 bg-blue px-1 md:px-10 lg:px-[100px]'>
      <Helmet>
        <title>Calendar</title>
      </Helmet>
      <div className='min-w-[550px] md:w-full h-full p-2 md:p-5 bg-white text-neutral-700 text-xs md:text-base font-bold md:rounded-3xl'>
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, listWeek, googleCalendarPlugin]}
          initialView="dayGridMonth"
          firstDay={1}
          editable={true}
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridYear,dayGridMonth,dayGridWeek,dayGridDay,listMonth'
          }}
          googleCalendarApiKey={CALENDAR_API_KEY}
          eventSources={[
            {
              googleCalendarId: CALENDAR_BOARDING,
              className: 'Boarding',
              color: '#0047AB'
            },
            {
              googleCalendarId: CALENDAR_HOLIDAYS,
              className: 'Holidays',
              color: '#f62c13'
            },
            {
              googleCalendarId: CALENDAR_STAFF,
              className: 'Staff',
              color: '#800080'
            },
            {
              googleCalendarId: CALENDAR_DAYCARE,
              className: 'Daycare',
              color: '#147917'
            }
          ]}
        />
      </div>
    </div>


  )
}

function err(reason: any): PromiseLike<never> {
  throw new Error('Function not implemented.');
}
