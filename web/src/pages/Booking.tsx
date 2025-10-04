import { toast } from "react-toastify"
import {ListField} from '../components/booking/ListField'
import { useState } from "react";

export function Booking(){
  var newDate = new Date()
  newDate.setHours(9, 30, 0)
  const [date, setDate] = useState(newDate)
  const [loading, setLoading] = useState(false)

  return (
    
    <div>
      <ListField 
        date={date} 
        setDate={setDate} 
        loading={loading} 
        setLoading={setLoading}
      />

    </div>
  
  )
}