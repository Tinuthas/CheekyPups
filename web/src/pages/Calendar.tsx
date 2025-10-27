import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid' // a plugin!
import timeGridPlugin from '@fullcalendar/timegrid'
import listWeek from '@fullcalendar/list'
import googleCalendarPlugin from '@fullcalendar/google-calendar';


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
          googleCalendarApiKey={'AIzaSyC4Q3pcEUxFtj_YxxIryszKkYsIkAL4zwk'}
          eventSources={[
            {
              googleCalendarId: 'cheekypups.com_tv1ilaq6sjck2hobrd16qnh818@group.calendar.google.com',
              className: 'Boarding',
              color: '#0047AB'
            },
            {
              googleCalendarId: 'en.irish#holiday@group.v.calendar.google.com',
              className: 'Holidays',
              color: '#f62c13'
            },
            {
              googleCalendarId: 'c_bc0e5d0d879ad231ae042ee2423bbff5fb6d61d6cfa3b87a17d241a816152a9b@group.calendar.google.com',
              className: 'Staff',
              color: '#800080'
            },
            {
              googleCalendarId: 'c_a50072a74ea10a24bbaebd7b996cc373b9e9fb934005bd05978a9f1313c6eef7@group.calendar.google.com',
              className: 'Daycare',
              color: '#147917'
            }
          ]}
        />
      </div>
    </div>
    
    
  )
}