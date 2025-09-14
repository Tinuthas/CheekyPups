import { ButtonLight } from "../ButtonLight";
import { ChooseDateButton } from "../ChooseDate";
import { Loading } from "../Loading";
import NextIcon from '@mui/icons-material/SkipNextRounded';
import PreviousIcon from '@mui/icons-material/SkipPreviousRounded';
import { ItemListField, ItemListFieldProps } from "./ItemListField";
import { ItemListColumnsField } from "./ItemListColumnsField";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import {api, getToken} from "../../lib/axios";
import { CreateNewModal } from "../CreateNewModal";
import { useState } from "react";
import dayjs from "dayjs";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../lib/theme";
import { FilterDateBooking } from "./FilterDateBooking";

interface ListFieldProps {
  date: Date
  setDate: (value:Date) => void
  loading: boolean
  setLoading: (value:boolean) => void,
  listBooking: Array<ItemListFieldProps>,
}


export function ListField ({date, setDate, loading, setLoading, listBooking}: ListFieldProps){

  const [createModalOpen, setCreateModalOpen] = useState(false);
  
  

  function addEventClick() {
    setCreateModalOpen(true)
  }

  function setTimeValueField(value: any) {
    console.log(value)
  }

  function onNextDate() {
    var newDate = new Date(date)
    newDate.setDate(date.getDate() + 1)
    setDate(newDate)
  }

  function onPreviousDate() {
    var newDate = new Date(date)
    newDate.setDate(date.getDate() - 1)
    setDate(newDate)
  }

  const listItem = listBooking.map(booking => 
    <ItemListField key={String(booking.id)} id={booking.id} time={booking.time} ownerName={booking.ownerName} phone={booking.phone} dogName={booking.dogName} dogBread={booking.dogBread}/> 
  )

  const handleCreateNewBooking = (values: any) => {
      setLoading(true)
      console.log(values)
      var newValues = {
        time: values.time,
        owner: null,
        phone: null,
        dog: null,
        bread: null
      }
      console.log(newValues)
      api.post('booking', newValues, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Time Created: ${values.time}`, { position: "top-center", autoClose: 1000, })
        setDate(values.date)
      }).catch((err: AxiosError) => {
        console.log(err)
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
        setLoading(false)
      })
    };



  return (
    <div className="border-neutral-800 md:p-10 pt-4 h-full flex flex-col items-center">
      <div className="flex flex-col justify-center items-center">
        <h3 className="font-medium text-4xl text-white font-borsok md:mr-6 text-center mt-2 md:mt-0">{date.toLocaleString(undefined,{weekday: "long", day: "numeric",month:'long', year:'numeric'})}</h3>
        <FilterDateBooking date={date} setDate={setDate} loading={loading} setLoading={setLoading} onPreviousDate={onPreviousDate} onNextDate={onNextDate} addEventClick={addEventClick}/>
      </div>
      <div className="w-full md:px-4 my-4">
        { loading ? <div className="w-full flex justify-center"><Loading /> </div> :
          <div className="h-[600px] bg-white border rounded p-4 overflow-auto">
            <ItemListColumnsField />
            {listItem}
          </div>
        }
        
      </div>
      <ThemeProvider theme={theme}>
        {createModalOpen ? 
          <CreateNewModal
            columns={[
            {
              accessorKey: 'date',
              label: 'Date',
              name: '',
              type: "date",
              value: date,
              setValue: (value) => setDate(value),
            },
            {
              accessorKey: 'time',
              label: 'Time',
              name: '',
              type: "time",
              value: date,
              setValue: (value) => setDate(value),
            }]}
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewBooking}
            />: null
        }
      </ThemeProvider>
      


    </div>
  )
}