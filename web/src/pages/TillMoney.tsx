import { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { api, getToken } from "../lib/axios"
import { Loading } from "../components/Loading";
import { ButtonGroupList } from "../components/ButtonGroupList"
import AddCircleIcon from '@mui/icons-material/AddCircle';
import { theme, iconStyle, iconSmallStyle } from "../lib/theme";
import dayjs from "dayjs";
import { FilterDatesRange } from "../components/FilterDatesRange";
import { CreateNewModal } from "../components/CreateNewModal";
import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import DataTableCustom from "../components/DataTableCustom";



const headersInfo = [
  {
    accessorKey: 'date',
    header: 'Date',
    size: 130,
  },
  {
    accessorKey: 'valueStarted',
    header: 'Started Value ',
    size: 80,
  },
  {
    accessorKey: 'value',
    header: 'Actual Value ',
    size: 80,
  },
  {
    accessorKey: 'valueCard',
    header: 'Card Value ',
    size: 80,
  },
  {
    accessorKey: 'valueOther',
    header: 'Rev/Other ',
    size: 80,
  },
  {
    accessorKey: 'type',
    header: 'Type ',
    size: 50,
  },
  {
    accessorKey: 'description',
    header: 'Description',
    size: 200,
  }
]


export function TillMoney() {

  const [loading, setLoading] = useState(false)
  const [searchButton, setSearchButton] = useState('W')
  const [endDate, setEndDate] = useState<Date>(dayjs().toDate());
  const [startDate, setStartDate] = useState<Date>(dayjs().subtract(1, 'month').toDate());
  const [openNewChangeModal, setNewChangeModal] = useState(false)
  const [newValue, setNewValue] = useState("")
  const [description, setDescription] = useState("")
  const [type, setType] = useState("")
  const [daycare, setDaycare] = useState([])
  const [grooming, setGrooming] = useState([])
  const [allInfo, setAllInfo] = useState([])

  useEffect(() => {
    getAllTillInfo()
  }, [searchButton, startDate, endDate])

  function addingNewChange() {
    var values = {
      newValue: newValue,
      description: description,
      type: type
    }
    try {
      setLoading(true)
      api.post('payment/till', values, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Added Till Changed`, { position: "top-center", autoClose: 1000, })
        setLoading(false)
        getAllTillInfo()
      }).catch((err: AxiosError) => {
        console.log(err)
        setLoading(false)
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }

  }


  function getAllTillInfo() {
    try {
      setLoading(true)
      api.get('payment/till', {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        var data = response.data
        var listData = JSON.parse(JSON.stringify(data));
        setDaycare(listData.daycare)
        setGrooming(listData.grooming)
        let listInfo = listData.all
        console.log(listData.all)
        listInfo.forEach((info: any) => {
          info.date = dayjs(info.date).format('DD/MM/YYYY HH:mm')
        });
        console.log(listData.all)
        setAllInfo(listInfo)
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
      })
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })

    }

  }

  const listDaycareItems = daycare.map((till: any) =>
    <div className="flex flex-row justify-around mt-2 text-center" key={till.id}>
      <p className="w-[120px] ">{dayjs(till.date).format('DD/MM/YYYY HH:mm')}</p>
      <p className="w-[100px] ">{`€ ${till.valueStarted}`}</p>
      <p className="w-[100px] ">{`€ ${till.value}`}</p>
      <p className="w-[90px] ">{`€ ${till.valueCard}`}</p>
      <p className="w-[90px] ">{`€ ${till.valueOther}`}</p>
    </div>
  )

  const listGroomingItems = grooming.map((till: any) =>
    <div className="flex flex-row justify-around mt-2 text-center" key={till.id}>
      <p className="w-[120px] ">{dayjs(till.date).format('DD/MM/YYYY HH:mm')}</p>
      <p className="w-[100px] ">{`€ ${till.valueStarted}`}</p>
      <p className="w-[100px] ">{`€ ${till.value}`}</p>
      <p className="w-[90px] ">{`€ ${till.valueCard}`}</p>
      <p className="w-[90px] ">{`€ ${till.valueOther}`}</p>
    </div>
  )



  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h3 className="font-medium text-3xl md:text-5xl text-pinkBackground font-borsok">Till Money</h3>
      {loading ? <div className="w-full flex justify-center"><Loading /> </div> :
        <>
          <div className="w-fit rounded-3xl m-1 bg-white ">

          </div>
          <div className=" w-full mt-4 lg:flex justify-around">
            <div className="text-neutral-600 mt-3 bg-white p-10 rounded-3xl lg:w-[530px]">
              <div className="flex flex-row justify-center">
                <h4 className="font-borsok text-2xl md:text-3xl m-1 mr-3">Daycare</h4>
                <div className="" onClick={() => {
                  setType('D')
                  setNewChangeModal(true)
                }}>
                  <AddCircleIcon sx={iconStyle} />
                </div>
              </div>
              <div>
                <div className="text-base">
                  <div className="flex flex-row justify-around text-center mt-2">
                    <h6 className="w-[120px] font-semibold">Date</h6>
                    <h6 className="w-[100px] font-semibold">Start</h6>
                    <h6 className="w-[100px] font-semibold">Actual</h6>
                    <h6 className="w-[90px] font-semibold">Card</h6>
                    <h6 className="w-[90px] font-semibold">Rev/Other</h6>
                  </div>
                  {listDaycareItems}
                </div>
              </div>
            </div>

            <div className="text-neutral-600 mt-3 bg-white p-10 rounded-3xl lg:w-[530px]">
              <div className="flex flex-row justify-center">
                <h4 className="font-borsok text-2xl md:text-3xl m-1 mr-3">Grooming</h4>
                <div className="" onClick={() => {
                  setType('G')
                  setNewChangeModal(true)
                }}>
                  <AddCircleIcon sx={iconStyle} />
                </div>
              </div>
              <div>
                <div className="text-base">
                  <div className="flex flex-row justify-around text-center mt-2">
                    <h6 className="w-[120px] font-semibold">Date</h6>
                    <h6 className="w-[100px] font-semibold">Start</h6>
                    <h6 className="w-[100px] font-semibold">Actual</h6>
                    <h6 className="w-[90px] font-semibold">Card</h6>
                    <h6 className="w-[90px] font-semibold">Rev/Other</h6>
                  </div>
                  {listGroomingItems}
                </div>
              </div>
            </div>


          </div>

          <div className="md:flex bg-white w-full mt-10 rounded">
            <DataTableCustom
              titleCreate="Add New Till Change"
              headers={headersInfo}
              data={allInfo}
              disableActions={true}
              title="Last Till Changes"
            />
          </div>
        </>

      }
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          {openNewChangeModal ?
            <CreateNewModal
              grid={true}
              open={openNewChangeModal}
              columns={[
                {
                  accessorKey: 'description',
                  label: 'Description',
                  name: 'Description',
                  type: "select",
                  required: true,
                  getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
                    resolve([{ label: "Adjustment", value: "Adjustment" }, { label: "Transfering Bank", value: "Transfering Bank" }, { label: "Removing Money", value: "Removing Money" }, { label: "Adding Money", value: "Adding Money" }, { label: "Other", value: "Other" }])
                  }),
                  setValue: (value) => {
                    setDescription(value.value)
                  },
                  gridXS: 12, gridMS: 12,
                },
                {
                  accessorKey: 'newValue',
                  label: 'New Cash Value',
                  name: '',
                  type: "number",
                  required: true,
                  value: newValue,
                  setValue: (value) => {
                    setNewValue(value)
                  },
                  gridXS: 12, gridMS: 12,
                },
              ]}
              onClose={() => {
                setDescription("")
                setNewValue("")
                setNewChangeModal(false)
              }}
              onSubmit={() => addingNewChange()}
              title="Add New Till Change"

            /> : null
          }
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  )
}