import { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { api, getToken } from "../lib/axios"
import { Loading } from "../components/Loading";
import { ButtonGroupList } from "../components/ButtonGroupList"
import { theme, iconStyle, iconSmallStyle } from "../lib/theme";
import dayjs from "dayjs";
import { FilterDatesRange } from "../components/FilterDatesRange";


export function DaycareSummary() {

  const [info, setInfo] = useState([{}])
  const [loading, setLoading] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)
  const [searchButton, setSearchButton] = useState('W')
  const [endDate, setEndDate] = useState<Date>(dayjs().toDate());
  const [startDate, setStartDate] = useState<Date>(dayjs().subtract(1, 'month').toDate());
  const [selectDateType, setSelectDateType] = useState<string>('T')


  useEffect(() => {
    handleInfo(searchButton)
  }, [searchButton, startDate, endDate])

  function handleInfo(status: string) {
    setLoading(true)
    const all = status === 'A';
    const done = status === 'C';
    const startDateParsed = dayjs(startDate).toISOString()
    const endDateParsed = dayjs(endDate).toISOString()
    setLoading(false)
    /*api.get('payment', {
      params: {
        all,
        done,
        startDate: startDateParsed,
        endDate: endDateParsed
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      var listResponde = JSON.parse(JSON.stringify(response.data))
      console.log(listResponde)
      setPayments(listResponde)
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    })*/
  }

  function changeCalendarDates(data: any[]) {
    setStartDate(data[0])
    setEndDate(data[1])
    setSelectDateType(data[2])
    console.log('change calendar dates')
    console.log(data)
    const promise = new Promise((resolve, reject) => {
      handleInfo(searchButton)
      resolve("");
    });
    return promise
  }


  function selectOrders(value: any) {
    setSearchButton(value)
    handleInfo(value)
  }


  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h3 className="font-medium text-3xl md:text-5xl text-pinkBackground font-borsok">Daycare Summary</h3>
      {loading ? <div className="w-full flex justify-center"><Loading /> </div> :
        <>
          <div className="w-fit rounded-3xl m-1 bg-white ">
            <FilterDatesRange data={[startDate, endDate, selectDateType]} onSubmit={(d1, d2) => {
              setStartDate(d1)
              setEndDate(d2)
            }}/>
          </div>
          <div className="bg-white w-full mt-4 rounded-3xl">
            <div className="w-[1000px] h-[500px]">
            
            </div>
          </div>
        </>

      }
    </div>
  )
}