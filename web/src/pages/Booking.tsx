import { toast } from "react-toastify"
import {ListField} from '../components/booking/ListField'
import { useState } from "react";

export function Booking(){
  var newDate = new Date()
  newDate.setHours(9, 30, 0)
  const [date, setDate] = useState(newDate)
  const [loading, setLoading] = useState(false)


  const listBooking = [
    {
      id: 1,
      time: "9:30AM",
      ownerName: "Declan",
      phone: "083 333 5546",
      dogName: "Einstein",
      dogBread: "Collie X"
    },
    {
      id: 2,
      time: "11AM"
    },
    {
      id: 3,
      time: "11AM"
    },
    {
      id: 4,
      time: "12:30PM"
    },
    {
      id: 5,
      time: "12:30PM"
    }
  ]

  return (

    
    <div>
      <ListField 
        date={date} 
        setDate={setDate} 
        loading={loading} 
        setLoading={setLoading}
        listBooking={listBooking}
      />

    </div>
  
  )
}