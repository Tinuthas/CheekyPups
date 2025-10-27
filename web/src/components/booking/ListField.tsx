import { ButtonLight } from "../ButtonLight";
import { ChooseDateButton } from "../ChooseDate";
import { Loading } from "../Loading";
import NextIcon from '@mui/icons-material/SkipNextRounded';
import PreviousIcon from '@mui/icons-material/SkipPreviousRounded';
import { ItemListField, ItemListFieldProps } from "./ItemListField";
import { ItemListColumnsField } from "./ItemListColumnsField";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { api, getToken } from "../../lib/axios";
import { CreateNewModal } from "../CreateNewModal";
import { useEffect, useState } from "react";
import dayjs from "dayjs";
import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../../lib/theme";
import { FilterDateBooking } from "./FilterDateBooking";
import { FillSpacesModal } from "./FillSpacesModal";
import { CreateNewCustomer } from "./CreateNewCustomer";
import { CreateExistedCustomer } from "./CreateExistedCustomer";
import { CreateNewOffering } from "./CreateNewOffering";

interface ListFieldProps {
  date: Date
  setDate: (value: Date) => void
  loading: boolean
  setLoading: (value: boolean) => void,
}


export function ListField({ date, setDate, loading, setLoading }: ListFieldProps) {

  const [createEventModalOpen, setCreateEventModalOpen] = useState(false);
  const [createBookModalOpen, setCreateBookModalOpen] = useState(false);
  const [createExistedModalOpen, setCreateExistedModalOpen] = useState(false);
  const [createOfferingModalOpen, setCreateOfferingModalOpen] = useState(false);
  const [fillSpacesModalOpen, setFillSpacesModalOpen] = useState(false);
  const [bookings, setBookings] = useState<any>([])
  const [calendar, setCalendar] = useState<any>([])
  const [emptyBooking, setEmptyBooking] = useState<any>([])
  const [loadingMenuItem, setLoadingMenuItem] = useState(-1);


  useEffect(() => {
    getBookingFromDate()
  }, [date])

  function getBookingFromDate() {
    setLoading(true)
    api.get('booking', {
      params: {
        date: date
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      var data = response.data
      var listData = JSON.parse(JSON.stringify(data));
      console.log(listData)
      setBookings(listData.bookings)
      console.log('calendar')
      console.log(listData.calendar)
      setCalendar(listData.calendar)
      var emptyBooking:Array<{}> = new Array()
      listData.bookings.forEach((time: any) => {
        if((time.status as string).includes('empty')){
          emptyBooking.push({value: time.id, label: dayjs(time.time).format('hh:mm A')})
        }
      });
      setEmptyBooking(emptyBooking)
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    })
  }

  function addEventClick() {
    setCreateEventModalOpen(true)
  }

  function addBookClick() {
    setCreateBookModalOpen(true)
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

  const listItem = bookings.map((booking: any) =>
    <ItemListField 
      key={String(booking.id)} 
      id={booking.id} 
      time={dayjs(booking.time).format('hh:mm A')} 
      status={booking.status} 
      ownerId={booking.status.includes('offered') ? Object(booking.offering)['ownerId']: (booking.dog == null ? null : booking.dog.Owner.id)}
      ownerName={booking.status.includes('offered') ? Object(booking.offering)['owner']: (booking.dog == null ? "" : booking.dog.Owner.name)} 
      phone={booking.status.includes('offered') ? Object(booking.offering)['phone'] : (booking.dog == null ? "" : booking.dog.Owner.phoneOne)} 
      dogId={booking.dog == null ? "" : booking.dog.id}
      dogName={booking.dog == null ? "" : booking.dog.name} 
      dogBread={booking.dog == null ? "" : booking.dog.breed} 
      notes={booking.status.includes('offered') ? Object(booking.offering)['notes']: (booking.notes == null ? null : booking.notes)}
      date={booking.time}
      loadingMenuItem={loadingMenuItem} 
      setLoadingMenuItem={(value) => setLoadingMenuItem(value)} 
      deleteRow={(id)=>handleDelete(id) } 
      listTimes={emptyBooking}
      createRowOffered={(values) => handleOfferedConfirmedCustomer(values)}
      finishRowBooking={(values) => handleFinishRowBooking(values)}
      editNotesBooking={(values) => handleEditNotesBooking(values)}
      cancelBookingRow={(id) => handleCancel(id)}
      />
  )

  const handleCreateNewBooking = (values: any) => {
    setLoading(true)
    date.setSeconds(0)
    date.setMilliseconds(0)
    var newValues = {
      date: date,
      status: "empty",
      owner: null,
      phone: null,
      dog: null,
      bread: null
    }
    api.post('booking', newValues, {
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      toast.success(`Time Created: ${values.time}`, { position: "top-center", autoClose: 1000, })
      setDate(date)
      getBookingFromDate()
      setLoading(false)
    }).catch((err: AxiosError) => {
      console.log(err)
      const data = err.response?.data as { message: string }
      toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      setLoading(false)
    })
  };

  function fillAllSpacesOfDay() {
    setLoading(true)
    api.post('booking/all', {date}, {
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      toast.success(`Times Created`, { position: "top-center", autoClose: 1000, })
      setDate(date)
      getBookingFromDate()
      setLoading(false)
    }).catch((err: AxiosError) => {
      console.log(err)
      const data = err.response?.data as { message: string }
      toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      setLoading(false)
    })
  }

  function handleDelete(id: number) {
    try {
      setLoading(true)
      api.delete('booking', {
        params: {
          id,
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Time deleted`, { position: "top-center", autoClose: 1000, })
        getBookingFromDate()
        setLoading(false)
      }).catch((err: AxiosError) => {
        console.log(err)
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      })
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }
  }

  function handleCancel(id: number) {
    try {
      setLoading(true)
      api.put('booking/cancel', {}, {
        params: {
          id,
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Appointment cancelled`, { position: "top-center", autoClose: 1000, })
        getBookingFromDate()
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      })
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }
  }

  function handleCreateNewDogAndCustomer(ownerDog:any) {
    try {
      setLoading(true)
      console.log('handleCreateNewDogAndCustomer')
      console.log(ownerDog)
      api.post('booking/newCustomer', ownerDog, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Appointment created`, { position: "top-center", autoClose: 1000, })
        getBookingFromDate()
        setLoading(false)
      }).catch((err: AxiosError) => {
        console.log(err)
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      })
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }
  }

  function handleCreateExistedDogAndCustomer(ownerDog: any) {
    try {
      setLoading(true)
      console.log('handleCreateExistedDogAndCustomer')
      console.log(ownerDog)
      api.post('booking/existedCustomer', ownerDog, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Appointment created`, { position: "top-center", autoClose: 1000, })
        getBookingFromDate()
        setLoading(false)
      }).catch((err: AxiosError) => {
        console.log(err)
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      })
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }
  }

  function handleCreateOfferedCustomer(offeredTime: any) {
    try {
      setLoading(true)
      console.log('handleCreateOfferedCustomer')
      console.log(offeredTime)
      api.post('booking/offering', offeredTime, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        console.log('response')
        console.log(response.data)
        toast.success(`Offered created`, { position: "top-center", autoClose: 1000, })
        getBookingFromDate()
        setLoading(false)
      }).catch((err: AxiosError) => {
        console.log(err)
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      })
     setLoading(false)
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }
  }

  function handleOfferedConfirmedCustomer(confirmedTime: any) {
    try {
      setLoading(true)
      console.log('handleOfferedConfirmedCustomer')
      console.log(confirmedTime)
      api.post('booking/confirmedOffer', confirmedTime, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        console.log('response')
        console.log(response.data)
        toast.success(`Booking created`, { position: "top-center", autoClose: 1000, })
        getBookingFromDate()
        setLoading(false)
      }).catch((err: AxiosError) => {
        console.log(err)
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      })
     setLoading(false)
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }
  }

  function handleFinishRowBooking(finishValues:any) {
    try{
      setLoading(true)
      api.post('booking/finish', finishValues, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        console.log('response')
        console.log(response.data)
        toast.success(`Booking finished`, { position: "top-center", autoClose: 1000, })
        getBookingFromDate()
        setLoading(false)
      }).catch((err: AxiosError) => {
        console.log(err)
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      })
     setLoading(false)
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }
  }
  
  function handleEditNotesBooking(values:any) {
    try{
      setLoading(true)
      api.post('booking/edit', values, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        console.log('response')
        console.log(response.data)
        toast.success(`Booking edit`, { position: "top-center", autoClose: 1000, })
        getBookingFromDate()
        setLoading(false)
      }).catch((err: AxiosError) => {
        console.log(err)
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      })
     setLoading(false)
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }
  }


  return (
    <div className="border-neutral-800 md:p-10 pt-4 h-full flex flex-col items-center">
      <div className="flex flex-col justify-center items-center">
        <h3 className="font-medium text-4xl md:text-5xl lg:text-6xl text-pinkBackground font-borsok md:mr-6 text-center mt-2 md:mt-0">{date.toLocaleString(undefined, { weekday: "long", day: "numeric", month: 'long', year: 'numeric' })}</h3>
        <FilterDateBooking date={date} setDate={setDate} calendar={calendar} loading={loading} setLoading={setLoading} onPreviousDate={onPreviousDate} onNextDate={onNextDate} addEventClick={addEventClick} addBookClick={addBookClick} addFillClick={() => setFillSpacesModalOpen(true)} addExistedClick={() => setCreateExistedModalOpen(true)} addOfferingClick={() => setCreateOfferingModalOpen(true)}/>
      </div>
      <div className="w-full md:px-4 my-4 flex justify-center">
        {loading ? <div className="w-full flex justify-center"><Loading /> </div> :
          <div className="min-h-[500px] w-fit bg-white border rounded p-4 overflow-auto">
            <ItemListColumnsField />
            {listItem}
          </div>
        }

      </div>
      <ThemeProvider theme={theme}>
        {createEventModalOpen ?
          <CreateNewModal
            key={"EventModalKey"}
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
            open={createEventModalOpen}
            onClose={() => setCreateEventModalOpen(false)}
            onSubmit={handleCreateNewBooking}
            title="Add New Time Space"
          /> : null
        }
        {
          fillSpacesModalOpen ?
            <FillSpacesModal
              key={"FillSpacesKey"}
              onClose={() => setFillSpacesModalOpen(false)}
              onSubmit={() => fillAllSpacesOfDay()}
              open={fillSpacesModalOpen}
            /> : null
        }
        {createBookModalOpen ?
           <CreateNewCustomer 
            key={"NewCustomerKey"}
            onClose={() => {
              getBookingFromDate()
              setCreateBookModalOpen(false)
            }} 
            onSubmit={(values) => handleCreateNewDogAndCustomer(values)} 
            open={createBookModalOpen} 
            listTimes={emptyBooking}/>: null
        }
        {createExistedModalOpen ?
           <CreateExistedCustomer 
            key={"ExistedCustomerKey"}
            onClose={() => {
              getBookingFromDate()
              setCreateExistedModalOpen(false)
            }} 
            onSubmit={(values) => handleCreateExistedDogAndCustomer(values)} 
            open={createExistedModalOpen} 
            listTimes={emptyBooking}/>: null
        }
        {createOfferingModalOpen ?
          <CreateNewOffering 
            key={"OfferingCustomerKey"}
            onClose={() => {
              getBookingFromDate()
              setCreateOfferingModalOpen(false)
            }} 
            onSubmit={(values) => handleCreateOfferedCustomer(values)} 
            open={createOfferingModalOpen} 
            listTimes={emptyBooking}
          />: null
        }
      </ThemeProvider>



    </div>
  )
}