import { BoxProps, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import DataTableCustom from "../DataTableCustom";
import { Loading } from "../../components/Loading";
import { api, getToken } from "../../lib/axios"
import { AxiosError } from "axios"
import { toast } from "react-toastify"
import { MRT_ColumnDef } from "material-react-table";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from "@mui/material";
import { PaymentAllModal } from "./PaymentAllModal";
import { theme, iconStyle, iconSmallStyle } from "../../lib/theme";
import PaidIcon from '@mui/icons-material/Paid';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { DeleteModal } from "../DeleteModal";
import { EditPayment } from "./EditPaymentModal";
import { EditNotes } from "../booking/EditNotesModal";
import { SummaryPayment } from "../SummaryPayment";
import { InfoOwnerDetails } from "./InfoOwnerDetails";
import { ButtonGroupList } from "../ButtonGroupList";


interface PaysInfoListModalProps {
  onClose: (e: Event | React.SyntheticEvent<Element, Event>) => void;
  open: boolean;
  infoData: { ownerId: number, dateStart?: any, dateEnd?: any, all?: any, done?: any },
}

export const PaysInfoListModal = ({
  open,
  onClose,
  infoData
}: PaysInfoListModalProps) => {

  const [dateStart, setDateStart] = useState(infoData.dateStart == null ? dayjs(new Date).subtract(6, 'month').toISOString() : infoData.dateStart)
  const [dateEnd, setDateEnd] = useState(infoData.dateEnd == null ? dayjs(new Date).add(1, 'month').toISOString() : infoData.dateEnd)
  const [selectDateType, setSelectDateType] = useState<string>('T')
  const [loading, setLoading] = useState(false)
  const [extracts, setExtracts] = useState([])
  const [owner, setOwner] = useState<any>(null)
  const [bookings, setBookings] = useState([])
  const [totalPays, setTotalPays] = useState(null)
  const [todayAttendance, setTodayAttendance] = useState(null)
  const [openPayingModal, setOpenPayingModal] = useState(false)
  const [openEditingModal, setOpenEditingModal] = useState(false)
  const [openEditingBookModal, setOpenEditingBookModal] = useState(false)
  const [openDeletingModal, setOpenDeletingModal] = useState(false)
  const [openIndex, setOpenIndex] = useState(-1)
  const [openTotalPayingModal, setOpenTotalPayingModal] = useState(false)
  const [searchButton, setSearchButton] = useState('G')


  useEffect(() => {
    callInit()
  }, [])

  function callInit() {
    setLoading(true)

    const all = infoData.all != null ? infoData.all : true;
    const done = infoData.done != null ? infoData.done : true;
    api.get('payment/extracts', {
      params: {
        id: infoData.ownerId,
        all: all,
        done: done,
        startDate: dateStart,
        endDate: dateEnd
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      var listResponde = JSON.parse(JSON.stringify(response.data))
      console.log(listResponde)
      setExtracts(listResponde.extracts)
      setOwner(listResponde.owner)
      setBookings(listResponde.bookings)
      setTotalPays(listResponde.totalPays)
      setTodayAttendance(listResponde.todayAttendance)
      if(listResponde.owner != null && listResponde.owner.type != null && listResponde.owner.type == 'D') {
        setSearchButton('P')
      }
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    })
  }

  function changeCalendarDates(data: any[]) {
    setDateStart(data[0])
    setDateEnd(data[1])
    setSelectDateType(data[2])
    const promise = new Promise((resolve, reject) => {
      callInit()
      resolve("");
    });
    return promise
  }

  function selectOrders(value: any) {
    setSearchButton(value)
  }

  function deleteDataRow(id: number) {
    setLoading(true)
    const promise = new Promise((resolve, reject) => {
      api.delete('payment', {
        params: {
          id,
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Deleted payment: ${response.data?.id}`, { position: "top-center", autoClose: 1000, })
        resolve(`Deleted payment: ${response.data?.id}`);
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as { message: string }
        toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`${data.message || err.response?.data || err.message}`);
      })
    }).then(() => callInit());
    return promise
  }

  function updateDataRow(data: any) {
    setLoading(true)
    const promise = new Promise((resolve, reject) => {
      api.put('payment', data, {
        params: {
          id: (data as any).id
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Updated payment: ${response.data?.id}`, { position: "top-center", autoClose: 1000, })
        resolve(`Updated payment: ${response.data?.id}`);
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as { message: string }
        toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`${data.message || err.response?.data || err.message}`);
      })
    }).then(() => callInit())
    return promise
  }

  function updateBookingDataRow(data: any) {
    setLoading(true)
    const promise = new Promise((resolve, reject) => {
      api.put('booking/edit/notes', data, {
        params: {
          id: (data as any).id
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Updated booking: ${response.data?.id}`, { position: "top-center", autoClose: 1000, })
        resolve(`Updated bookingbooking: ${response.data?.id}`);
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as { message: string }
        toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`${data.message || err.response?.data || err.message}`);
      })
    }).then(() => callInit())
    return promise
  }

  function handlePayingAllRow(values: any) {
    try {
      setLoading(true)
      const promise = new Promise((resolve, reject) => {
        api.post('payment/owner', values, {
          headers: {
            Authorization: getToken()
          }
        }).then(response => {
          toast.success(`Payments done`, { position: "top-center", autoClose: 1000, })
          callInit()
          resolve(`Payment Done`);
          setLoading(false)
        }).catch((err: AxiosError) => {
          const data = err.response?.data as { message: string }
          toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
          setLoading(false)
        })
      })
      return promise

    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }

  }

  const headersExtracts: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      size: 130,
      enableEditing: false,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <span>
            {renderedCellValue != null && renderedCellValue != undefined ?
              dayjs(String(renderedCellValue)).format('DD/MM/YYYY HH:mm')
              : ""}
          </span>
        </>
      )
    },
    {
      accessorKey: 'dogName',
      header: 'Dog Name',
      size: 125,
      enableEditing: false,
    },
    {
      accessorKey: 'value',
      header: 'Sales',
      size: 90,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <span className="font-semibold">{'€ '}</span>
          <span className="text-green-600 font-semibold">{renderedCellValue}</span>
        </>
      )
    },
    {
      accessorKey: 'paidValue',
      header: 'Paid',
      size: 90,
      Cell: ({ renderedCellValue, row }) => (
        (renderedCellValue == null) ? null :
          <>
            <span className="font-semibold">{'€ '}</span>
            <span className="text-green-600 font-semibold">{renderedCellValue}</span>
          </>
      )
    },

    {
      accessorKey: 'totalValue',
      header: 'Owed',
      size: 90,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <span className="font-semibold">{'€ '}</span>
          {Number(renderedCellValue) > 0 ?
            <span className="text-red-600 font-semibold">{renderedCellValue}</span>
            :
            <span className="text-green-600 font-semibold">{renderedCellValue}</span>
          }
        </>
      )
    },
    {
      accessorKey: 'done',
      header: '✓',
      size: 60,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <span className="text-neutral-600 font-bold">{renderedCellValue ? 'X' : ''}</span>
        </>
      )
    },
    {
      accessorKey: 'description',
      header: 'Description',
      size: 250,
    },
    {
      accessorKey: 'type',
      header: 'Type',
      size: 85,
    },
    {
      accessorKey: 'actionCol',
      header: 'Actions',
      size: 110,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <div className="flex flex-row justify-between">
            {row.original.done ? null :
              <div className="w-full cursor-pointer" onClick={() => {
                setOpenPayingModal(true)
                setOpenIndex(row.original.id)
              }}>
                <PaidIcon sx={iconSmallStyle} />
              </div>
            }


            <div className="w-full cursor-pointer" onClick={() => {
              setOpenEditingModal(true)
              setOpenIndex(row.original.id)
            }}>
              <EditIcon sx={iconSmallStyle} />
            </div>

            {row.original.done ? null :
              <div className="w-full cursor-pointer" onClick={() => {
                setOpenDeletingModal(true)
                setOpenIndex(row.original.id)
              }}>
                <DeleteIcon sx={iconSmallStyle} />
              </div>
            }

          </div>

          {row.original.id == openIndex && openPayingModal ?
            <PaymentAllModal
              open={openPayingModal}
              onClose={() => setOpenPayingModal(false)}
              onSubmit={(values) => handlePayingAllRow(values)}
              ownerDog={{ owner: owner.name, id: owner.id, sales: row.original.value }}
            //name={row.original.name}
            />
            : null}

          {row.original.id == openIndex && openEditingModal ?
            <EditPayment
              open={openEditingModal}
              onClose={() => setOpenEditingModal(false)}
              onSubmit={(values) => updateDataRow(values)}
              payInfo={{ id: row.original.id, description: row.original.description, sales: row.original.value, paid: row.original.done, valuePaid: row.original.paidValue, type: row.original.type }}
            //name={row.original.name}
            />
            : null}

          {row.original.id == openIndex && openDeletingModal ?
            <DeleteModal
              open={openDeletingModal}
              onClose={() => setOpenDeletingModal(false)}
              onSubmit={() => deleteDataRow(row.original.id)}
            //name={row.original.name}
            />
            : null}
        </>
      )
    }
  ]

  const headersBookings: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Appointments',
      size: 130,
      enableEditing: false,
    },
    {
      accessorKey: 'dogName',
      header: 'Dog Name',
      size: 200,
      enableEditing: false,
    },
    {
      accessorKey: 'status',
      header: 'Status',
      size: 130,
      enableEditing: false,
      Cell: ({ renderedCellValue, row }) => (
        <>
          {String(renderedCellValue).includes('offered') ?
            <span className="text-yellow-400 font-semibold">{String(renderedCellValue).toUpperCase()}</span>
            : String(renderedCellValue).includes('confirmed') ?
              <span className="text-green-600 font-semibold">{String(renderedCellValue).toUpperCase()}</span>
              : String(renderedCellValue).includes('cancelled') ?
                <span className="text-red-600 font-semibold">{String(renderedCellValue).toUpperCase()}</span>
                : String(renderedCellValue).includes('done') ?
                  <span className="text-[#0047AB] font-semibold">{String(renderedCellValue).toUpperCase()}</span>
                  : <span className="font-semibold">{String(renderedCellValue).toUpperCase()}</span>
          }

        </>
      )
    },
    {
      accessorKey: 'sales',
      header: 'Sales',
      size: 90,
      Cell: ({ renderedCellValue, row }) => (
        <>
          {renderedCellValue != "" ?
            <>
              <span className="font-semibold">{'€ '}</span>
              <span className="text-green-600 font-semibold">{renderedCellValue}</span>
            </>
            : null}
        </>
      )
    },
    {
      accessorKey: 'notes',
      header: 'Notes',
      size: 250,
      enableEditing: false,
    },
    {
      accessorKey: 'dateUpdated',
      header: 'Last Updated',
      size: 130,
      enableEditing: false,
    },
    {
      accessorKey: 'actionCol',
      header: 'Actions',
      size: 80,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <div className="flex flex-row justify-between">
            <div className="w-full cursor-pointer" onClick={() => {
              setOpenEditingBookModal(true)
              setOpenIndex(row.original.id)
            }}>
              <EditIcon sx={iconSmallStyle} />
            </div>
          </div>

          {row.original.id == openIndex && openEditingBookModal ?
            <EditNotes
              open={openEditingBookModal}
              onClose={() => setOpenEditingBookModal(false)}
              onSubmit={(values) => updateBookingDataRow(values)}
              ownerDog={{ id: row.original.id, notes: row.original.notes, job: 'FG' }}
            //name={row.original.name}
            />
            : null}
        </>
      )
    }

  ]

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          open={open}
          onClose={onClose}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                margin: "auto",
                maxWidth: "1200px",  // Set your width here
              },
            },
          }}>
          <DialogTitle id="responsive-dialog-title">
            {`INFO: Owner & Dogs`}
          </DialogTitle>
          <DialogContent>
            {loading ? <div className="w-full flex justify-center"><Loading /> </div> :
              <>
                <div key='InfoList' className="w-full text-sm md:text-base text-neutral-700">
                  {owner != null ?
                    //<InfoOwnerDetails owner={owner} />
                    <div id="OwnerInfo" className="group transition-all transition-discrete delay-100 duration-300 ease-in-out hover:-translate-y-1">
                      <div>
                        <div id="ownerName" className="flex justify-center">
                          <span></span>
                          <span className="font-medium text-xl">{owner != null ? `${owner.name} - ${owner.phoneOne}` : null}</span>
                        </div>
                        {owner != null && owner.dogs != null ?
                          <>
                            {owner.dogs.map((dog: any) => (
                              <div className="flex justify-center">
                                <span></span>
                                <span className="font-medium text-md">{dog.name} - {dog.breed}</span>
                              </div>
                            ))}
                          </>
                          : null}
                      </div>
                      <div className="group-hover:transition-all group-hover:delay-100 ease-in invisible group-hover:visible h-0 group-hover:h-full">
                        <InfoOwnerDetails owner={owner} />
                      </div>
                    </div>
                    : null}
                </div>
                {totalPays != null ?
                  <div className="xl:px-20">
                    <SummaryPayment info={totalPays} />
                  </div>
                  : null}
                {totalPays != null ?
                  <div className="px-5 mt-5">
                    <div className="flex flex-col">
                      <div className="w-full text-center text-xl">
                        <button className="bg-pinkBackground text-white p-1 px-5 font-semibold hover:bg-white hover:text-pinkBackground hover:border hover:border-pinkBackground" onClick={() => setOpenTotalPayingModal(true)}>
                          <span className="">Total: </span>
                          <span className="">{'€ '}</span>
                          <span className="">{(totalPays as any).total}</span>
                        </button>
                        {todayAttendance != null && todayAttendance != undefined ?
                          <button className="bg-white text-pinkBackground ml-3 p-1 px-5 font-semibold hover:bg-white hover:text-pinkBackground hover:border hover:border-pinkBackground">
                            <span>Hrs: </span>
                            <span>{todayAttendance}</span>
                          </button>
                          : null}

                        {openTotalPayingModal ?
                          <PaymentAllModal
                            key={'PayingTotalOwnedAll'}
                            open={openTotalPayingModal}
                            onClose={() => setOpenTotalPayingModal(false)}
                            onSubmit={(values) => handlePayingAllRow(values)}
                            ownerDog={{ owner: owner.name, id: (totalPays[0] as { id: number }).id, sales: Number((totalPays[0] as { totalValue: string }).totalValue) }}
                          />
                          : null}
                      </div>
                    </div>
                  </div>
                  : null}

                {owner != null ?
                  <>
                    <div className="mt-6 flex w-full justify-center rounded m-1 bg-white">
                      <ButtonGroupList listButtons={[{ key: "P", name: "Payments" }, { key: "G", name: "Grooming" }, { key: "D", name: "Daycare" }]} selectButton={(value) => selectOrders(value)} selectedButton={searchButton} />
                    </div>
                    {searchButton == 'P' ?
                      <div id="Payments">
                        <h4 className="font-medium text-xl text-center font-borsok text-pinkBackground p-2">Payments</h4>
                        <div className="md:flex bg-white w-full mt-3 rounded">
                          <DataTableCustom
                            headers={headersExtracts}
                            titleCreate=""
                            disableActions={true}
                            data={extracts}
                            setData={(data: any) => setExtracts(data)}
                            title={"Last Payments"}
                            deleteRow={id => deleteDataRow(id)}
                            searchCalendar={(data) => changeCalendarDates(data)}
                            calendarData={[dateStart, dateEnd, selectDateType]}
                            updateRow={data => updateDataRow(data)} />
                        </div>
                      </div>
                      : searchButton == 'G' ?
                        <div id="Grooming">
                          <h4 className="font-medium text-xl text-center font-borsok text-pinkBackground p-2">Grooming</h4>
                          <div className="md:flex bg-white w-full mt-3 rounded">
                            <DataTableCustom
                              headers={headersBookings}
                              titleCreate=""
                              disableActions={true}
                              data={bookings}
                              setData={(data: any) => setBookings(data)}
                              title={"Booking Appointments"}
                              deleteRow={id => deleteDataRow(id)}
                              updateRow={data => updateDataRow(data)} />
                          </div>
                        </div>
                        : searchButton == 'D' ?
                          <div id="Daycare">
                            <h4 className="font-medium text-xl text-center font-borsok text-pinkBackground p-2">Daycare</h4>
                          </div>
                          : null}

                  </>
                  : null}
              </>
            }
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={onClose}>
              Back
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

function handlePayments(arg0: string) {
  throw new Error("Function not implemented.");
}
