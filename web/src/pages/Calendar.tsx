import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import listWeek from '@fullcalendar/list'
import googleCalendarPlugin from '@fullcalendar/google-calendar';

const CALENDAR_API_KEY = import.meta.env.VITE_CALENDAR_API_KEY
const CALENDAR_BOARDING = import.meta.env.VITE_CALENDAR_BOARDING
const CALENDAR_HOLIDAYS = import.meta.env.VITE_CALENDAR_HOLIDAYS
const CALENDAR_STAFF = import.meta.env.VITE_CALENDAR_STAFF
const CALENDAR_DAYCARE = import.meta.env.VITE_CALENDAR_DAYCARE


export default function Calendar() {
  return (
    <div className='w-full py-10 bg-blue px-1 md:px-10 lg:px-[100px]'>
      <div className='min-w-[550px] md:w-full h-full p-2 md:p-5 bg-white text-neutral-700 text-xs md:text-base font-bold md:rounded-3xl'>
        <FullCalendar
          plugins={[ dayGridPlugin, timeGridPlugin, listWeek, googleCalendarPlugin ]}
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