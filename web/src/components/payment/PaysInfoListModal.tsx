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
  const [loading, setLoading] = useState(false)
  const [extracts, setExtracts] = useState([])
  const [owner, setOwner] = useState<any>(null)
  const [bookings, setBookings] = useState([])
  const [totalPays, setTotalPays] = useState([])
  const [openPayingModal, setOpenPayingModal] = useState(false)
  const [openEditingModal, setOpenEditingModal] = useState(false)
  const [openDeletingModal, setOpenDeletingModal] = useState(false)
  const [openIndex, setOpenIndex] = useState(-1)
  const [openTotalPayingModal, setOpenTotalPayingModal] = useState(false)

  useEffect(() => {
    callInit()
  }, [])

  function callInit() {
    setLoading(true)

    const all = infoData.all != null ? infoData.all : true;
    const done = infoData.done != null ? infoData.done : true;
    console.log('owner id')
    console.log(infoData.ownerId)
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
      console.log('return call list extracts')
      var listResponde = JSON.parse(JSON.stringify(response.data))
      console.log(listResponde)
      setExtracts(listResponde.extracts)
      setOwner(listResponde.owner)
      setBookings(listResponde.bookings)
      setTotalPays(listResponde.totalPays)
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    })
  }


  function deleteDataRow(id: number) {
    setLoading(true)
    console.log('delete')
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
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    }).then(() => callInit());
    return promise
  }

  function updateDataRow(data: any) {
    setLoading(true)
    console.log('update payment')
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
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
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
          toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
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
              payInfo={{id: row.original.id, description: row.original.description, sales: row.original.value, paid: row.original.done, valuePaid: row.original.paidValue, type: row.original.type}}
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
      header: 'Date',
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
          {renderedCellValue != ""?
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
      size: 300,
      enableEditing: false,
    },

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
                <div className="w-full text-sm md:text-base text-neutral-700">
                  {owner != null ?
                    <div key='infoOwner' className="flex flex-col p-3 border-2 border-neutral-200 rounded-3xl">
                      <div className="flex flex-col mb-3 px-2">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-80 md:mt-1">
                            <span className="font-semibold mt-1 ">Owner: </span>
                            <span>{owner.name}</span>
                          </div>
                          <div className="md:ml-5 md:w-80 mt-1 ">
                            <span className="font-semibold">Second Owner: </span>
                            <span>{owner.secondOwner}</span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row mt-1 ">
                          <div className="md:w-80">
                            <span className="font-semibold">Phone: </span>
                            <span>{owner.phoneOne}</span>
                          </div>
                          <div className="md:ml-5 md:w-80 mt-1 ">
                            <span className="font-semibold">Second Phone: </span>
                            <span>{owner.phoneTwo != null && owner.phoneTwo != undefined ? owner.phoneTwo : ""}</span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row mt-1  ">
                          <div className="md:w-80">
                            <span className="font-semibold">Email: </span>
                            <span>{owner.emailAddress == null || owner.emailAddress == undefined ? "" : owner.emailAddress}</span>
                          </div>
                          <div className="md:ml-5 md:w-80 mt-1 ">
                            <span className="font-semibold">Address: </span>
                            <span>{owner.address != null && owner.address != undefined ? owner.address : ""}</span>
                          </div>
                        </div>
                        <div className="mt-1">
                          <span className="font-semibold">Notes: </span>
                          <span>{owner.notes != null && owner.notes != undefined ? owner.notes : ""}</span>
                        </div>
                      </div>
                      {owner.dogs.map((dog: any) => (
                        <>
                          <div className="flex flex-col p-2 mt-2 border-2 border-neutral-200 rounded-xl" key={dog.id}>
                            <div className="flex flex-col md:flex-row ">
                              <div className="md:w-60 md:mt-1">
                                <span className="font-semibold">Dog: </span>
                                <span>{dog.name}</span>
                              </div>
                              <div className="md:ml-5 md:w-60 mt-1">
                                <span className="font-semibold">Breed: </span>
                                <span>{dog.breed}</span>
                              </div>
                              <div className="md:ml-5 md:w-60 mt-1">
                                <span className="font-semibold">Birthday: </span>
                                <span>{dog.birthdayDate != null && dog.birthdayDate != ""? dayjs(dog.birthdayDate).format('DD/MM/YYYY'):""}</span>
                              </div>
                            </div>
                            <div className="flex flex-col md:flex-row mt-1">
                              <div className="md:w-60">
                                <span className="font-semibold">Nickname: </span>
                                <span>{dog.nickname != null && dog.nickname != undefined ? dog.nickname : ""}</span>
                              </div>
                              <div className="md:ml-5 md:w-60 mt-1 ">
                                <span className="font-semibold">Gender: </span>
                                <span>{dog.gender != null && dog.gender != undefined ? dog.gender : ""}</span>
                              </div>
                              <div className="md:ml-5 md:w-60 mt-1 ">
                                <span className="font-semibold">Colour: </span>
                                <span>{dog.colour != null && dog.colour != undefined ? dog.colour : ""}</span>
                              </div>
                            </div>
                          </div>
                        </>
                      ))}

                    </div>
                    : null}
                </div>
                {totalPays.length > 0 ?
                  <div className="px-5 mt-5">
                      <div className="flex flex-col">
                        <div className="w-full text-center text-xl">
                          <button className="bg-pinkBackground text-white p-1 px-5 font-semibold hover:bg-white hover:text-pinkBackground hover:border hover:border-pinkBackground" onClick={() => setOpenTotalPayingModal(true)}>
                            <span className="">Total Owned: </span>
                            <span className="">{'€ '}</span>
                            <span className="">{(totalPays[0] as {totalValue:string}).totalValue}</span>
                          </button>

                          {openTotalPayingModal ?
                              <PaymentAllModal
                                key={'PayingTotalOwnedAll'}
                                open={openTotalPayingModal}
                                onClose={() => setOpenTotalPayingModal(false)}
                                onSubmit={(values) => handlePayingAllRow(values)}
                                ownerDog={{ owner: owner.name, id: (totalPays[0] as {id:number}).id, sales: Number((totalPays[0] as {totalValue:string}).totalValue)}}
                              />
                          : null}
                        </div>
                      </div> 
                  </div>
                : null}
                <div className="md:flex bg-white w-full mt-6 rounded">
                  <DataTableCustom
                    headers={headersExtracts}
                    titleCreate=""
                    disableActions={true}
                    data={extracts}
                    setData={(data: any) => setExtracts(data)}
                    title={"Last Payments"}
                    deleteRow={id => deleteDataRow(id)}
                    updateRow={data => updateDataRow(data)} />
                </div>
                <div className="md:flex bg-white w-full mt-6 rounded">
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
