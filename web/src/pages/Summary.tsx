import { AxiosError } from "axios"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import { api, getToken } from "../lib/axios"
import { Loading } from "../components/Loading";
import { ButtonGroupList } from "../components/ButtonGroupList"
import { theme, iconStyle, iconSmallStyle } from "../lib/theme";
import dayjs from "dayjs";
import { FilterDatesRange } from "../components/FilterDatesRange";


export function Summary() {

  const [info, setInfo] = useState([{}])
  const [infoCashDaycare, setInfoCashDaycare] = useState(null)
  const [infoCardDaycare, setInfoCardDaycare] = useState(null)
  const [infoRevDaycare, setInfoRevDaycare] = useState(null)
  const [infoCashGrooming, setInfoCashGrooming] = useState(null)
  const [infoCardGrooming, setInfoCardGrooming] = useState(null)
  const [infoRevGrooming, setInfoRevGrooming] = useState(null)
  const [infoCashOthers, setInfoCashOthers] = useState(null)
  const [infoCardOthers, setInfoCardOthers] = useState(null)
  const [infoRevOthers, setInfoRevOthers] = useState(null)
  const [infoCashAll, setInfoCashAll] = useState(null)
  const [infoCardAll, setInfoCardAll] = useState(null)
  const [infoRevAll, setInfoRevAll] = useState(null)
  const [loading, setLoading] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)
  const [endDate, setEndDate] = useState<Date>(dayjs().endOf('month').toDate());
  const [startDate, setStartDate] = useState<Date>(dayjs().startOf('month').toDate());


  useEffect(() => {
    handleInfo(startDate, endDate)
  }, [startDate, endDate])

  function setAllInfoNull() {
    setInfoCashDaycare(null)
    setInfoCardDaycare(null)
    setInfoRevDaycare(null)
    setInfoCardGrooming(null)
    setInfoRevGrooming(null)
    setInfoCashGrooming(null)
    setInfoCardOthers(null)
    setInfoRevOthers(null)
    setInfoCashOthers(null)
    setInfoCardAll(null)
    setInfoRevAll(null)
    setInfoCashAll(null)
  }

  function handleInfo(date1: any, date2: any) {
    setLoading(true)
    try {


      const startDateParsed = dayjs(date1).toISOString()
      const endDateParsed = dayjs(date2).toISOString()
      setLoading(false)
      api.get('attendance/summary', {
        params: {
          dateStart: startDateParsed,
          dateEnd: endDateParsed
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        var listResponde = JSON.parse(JSON.stringify(response.data))

        setAllInfoNull()
        listResponde.daycare.forEach((element: any) => {
          if (element.type != null) {
            if (element.type.includes('CASH')) {
              setInfoCashDaycare(element)
            } else if (element.type.includes('CARD')) {
              setInfoCardDaycare(element)
            } else if (element.type.includes('REV')) {
              setInfoRevDaycare(element)
            }
          }
        });
        listResponde.grooming.forEach((element: any) => {
          if (element.type != null) {
            if (element.type.includes('CASH')) {
              setInfoCashGrooming(element)
            } else if (element.type.includes('CARD')) {
              setInfoCardGrooming(element)
            } else if (element.type.includes('REV')) {
              setInfoRevGrooming(element)
            }
          }
        });
        listResponde.others.forEach((element: any) => {
          if (element.type != null) {
            if (element.type.includes('CASH')) {
              setInfoCashOthers(element)
            } else if (element.type.includes('CARD')) {
              setInfoCardOthers(element)
            } else if (element.type.includes('REV')) {
              setInfoRevOthers(element)
            }
          }

        });
        listResponde.all.forEach((element: any) => {
          if (element.type != null) {
            if (element.type.includes('CASH')) {
              setInfoCashAll(element)
            } else if (element.type.includes('CARD')) {
              setInfoCardAll(element)
            } else if (element.type.includes('REV')) {
              setInfoRevAll(element)
            }
          }
        });
        setInfo(listResponde)
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as { message: string }
        toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
      })

    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    }
  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h3 className="font-medium text-3xl md:text-5xl text-pinkBackground font-borsok">Summary</h3>
      {loading ? <div className="w-full flex justify-center"><Loading /> </div> :
        <>
          <div className="w-fit rounded-3xl m-1 bg-white ">
            <FilterDatesRange data={[startDate, endDate, 'M']} onSubmit={(d1, d2) => {
              setStartDate(d1)
              setEndDate(d2)
              handleInfo(d1, d2)
            }} />
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-white mt-4 p-4 rounded-3xl text-neutral-600 text-center text-base ">
              <h4 className="text-neutral-600 text-2xl font-borsok p-2">Daycare</h4>
              <div className="w-full md:w-[500px]">
                <div className="grid grid-cols-5 font-bold">
                  <h6 className=""></h6>
                  <h6 className="">Cash</h6>
                  <h6 className="">Card</h6>
                  <h6 className="">Revolut</h6>
                  <h6 className="">Total</h6>
                </div>

              </div>
              <div className="w-full md:w-[500px]">
                <div className="grid grid-cols-5 mt-2">
                  <span className=" font-bold ">Sales</span>
                  <span className="">{infoCashDaycare != null ? `€ ${(infoCashDaycare as any)['_sum'].value}` : ""} </span>
                  <span className="">{infoCardDaycare != null ? `€ ${(infoCardDaycare as any)['_sum'].value}` : ""}</span>
                  <span className="">{infoRevDaycare != null ? `€ ${(infoRevDaycare as any)['_sum'].value}` : ""}</span>
                  <span className="">{`€ ${((infoCashDaycare != null ? Number((infoCashDaycare as any)['_sum'].value) : 0) + (infoCardDaycare != null ? Number((infoCardDaycare as any)['_sum'].value) : 0) + (infoRevDaycare != null ? Number((infoRevDaycare as any)['_sum'].value) : 0))}`}</span>
                </div>
                <div className="grid grid-cols-5 mt-2 mb-5">
                  <span className=" font-bold">Dogs</span>
                  <span className="">{infoCashDaycare != null ? `${(infoCashDaycare as any)['_count'].attendanceId}` : ""} </span>
                  <span className="">{infoCardDaycare != null ? `${(infoCardDaycare as any)['_count'].attendanceId}` : ""}</span>
                  <span className="">{infoRevDaycare != null ? `${(infoRevDaycare as any)['_count'].attendanceId}` : ""}</span>
                  <span className="">{`${((infoCashDaycare != null ? Number((infoCashDaycare as any)['_count'].attendanceId) : 0) + (infoCardDaycare != null ? Number((infoCardDaycare as any)['_count'].attendanceId) : 0) + (infoRevDaycare != null ? Number((infoRevDaycare as any)['_count'].attendanceId) : 0))}`}</span>
                </div>
              </div>
            </div>

            <div className="bg-white mt-4 p-4 rounded-3xl text-neutral-600 text-center text-base md:ml-4">
              <h4 className="text-neutral-600 text-2xl font-borsok p-2">Grooming</h4>
              <div className="w-full md:w-[500px]">
                <div className="grid grid-cols-5 font-bold">
                  <h6 className=""></h6>
                  <h6 className="">Cash</h6>
                  <h6 className="">Card</h6>
                  <h6 className="">Revolut</h6>
                  <h6 className="">Total</h6>
                </div>

              </div>
              <div className="w-full md:w-[500px]">
                <div className="grid grid-cols-5 mt-2">
                  <span className=" font-bold ">Sales</span>
                  <span className="">{infoCashGrooming != null ? `€ ${(infoCashGrooming as any)['_sum'].value}` : ""} </span>
                  <span className="">{infoCardGrooming != null ? `€ ${(infoCardGrooming as any)['_sum'].value}` : ""}</span>
                  <span className="">{infoRevGrooming != null ? `€ ${(infoRevGrooming as any)['_sum'].value}` : ""}</span>
                  <span className="">{`€ ${((infoCashGrooming != null ? Number((infoCashGrooming as any)['_sum'].value) : 0) + (infoCardGrooming != null ? Number((infoCardGrooming as any)['_sum'].value) : 0) + (infoRevGrooming != null ? Number((infoRevGrooming as any)['_sum'].value) : 0))}`}</span>
                </div>
                <div className="grid grid-cols-5 mt-2 mb-5">
                  <span className=" font-bold">Dogs</span>
                  <span className="">{infoCashGrooming != null ? `${(infoCashGrooming as any)['_count'].bookingId}` : ""} </span>
                  <span className="">{infoCardGrooming != null ? `${(infoCardGrooming as any)['_count'].bookingId}` : ""}</span>
                  <span className="">{infoRevGrooming != null ? `${(infoRevGrooming as any)['_count'].bookingId}` : ""}</span>
                  <span className="">{`${((infoCashGrooming != null ? Number((infoCashGrooming as any)['_count'].bookingId) : 0) + (infoCardGrooming != null ? Number((infoCardGrooming as any)['_count'].bookingId) : 0) + (infoRevGrooming != null ? Number((infoRevGrooming as any)['_count'].bookingId) : 0))}`}</span>
                </div>
              </div>

            </div>
          </div>
          <div className="flex flex-col md:flex-row">
            <div className="bg-white mt-4 p-4 rounded-3xl text-neutral-600 text-center text-base">
              <h4 className="text-neutral-600 text-2xl font-borsok p-2">Others</h4>
              <div className="w-full md:w-[500px]">
                <div className="grid grid-cols-5 font-bold">
                  <h6 className=""></h6>
                  <h6 className="">Cash</h6>
                  <h6 className="">Card</h6>
                  <h6 className="">Revolut</h6>
                  <h6 className="">Total</h6>
                </div>

              </div>
              <div className="w-full md:w-[500px]">
                <div className="grid grid-cols-5 mt-2">
                  <span className=" font-bold ">Sales</span>
                  <span className="">{infoCashOthers != null ? `€ ${(infoCashOthers as any)['_sum'].value}` : ""} </span>
                  <span className="">{infoCardOthers != null ? `€ ${(infoCardOthers as any)['_sum'].value}` : ""}</span>
                  <span className="">{infoRevOthers != null ? `€ ${(infoRevOthers as any)['_sum'].value}` : ""}</span>
                  <span className="">{`€ ${((infoCashOthers != null ? Number((infoCashOthers as any)['_sum'].value) : 0) + (infoCardOthers != null ? Number((infoCardOthers as any)['_sum'].value) : 0) + (infoRevOthers != null ? Number((infoRevOthers as any)['_sum'].value) : 0))}`}</span>
                </div>
                <div className="grid grid-cols-5 mt-2 mb-5">
                  <span className=" font-bold">Items</span>
                  <span className="">{infoCashOthers != null ? `${(infoCashOthers as any)['_count'].id}` : ""} </span>
                  <span className="">{infoCardOthers != null ? `${(infoCardOthers as any)['_count'].id}` : ""}</span>
                  <span className="">{infoRevOthers != null ? `${(infoRevOthers as any)['_count'].id}` : ""}</span>
                  <span className="">{`${((infoCashOthers != null ? Number((infoCashOthers as any)['_count'].id) : 0) + (infoCardOthers != null ? Number((infoCardOthers as any)['_count'].id) : 0) + (infoRevOthers != null ? Number((infoRevOthers as any)['_count'].id) : 0))}`}</span>
                </div>
              </div>
            </div>

            <div className="bg-white mt-4 p-4 rounded-3xl text-neutral-600 text-center text-base md:ml-4">
              <h4 className="text-neutral-600 text-2xl font-borsok p-2">Total</h4>
              <div className="w-full md:w-[500px]">
                <div className="grid grid-cols-5 font-bold">
                  <h6 className=""></h6>
                  <h6 className="">Cash</h6>
                  <h6 className="">Card</h6>
                  <h6 className="">Revolut</h6>
                  <h6 className="">Total</h6>
                </div>

              </div>
              <div className="w-full md:w-[500px]">
                <div className="grid grid-cols-5 mt-2">
                  <span className=" font-bold ">Sales</span>
                  <span className="">{infoCashAll != null ? `€ ${(infoCashAll as any)['_sum'].value}` : ""} </span>
                  <span className="">{infoCardAll != null ? `€ ${(infoCardAll as any)['_sum'].value}` : ""}</span>
                  <span className="">{infoRevAll != null ? `€ ${(infoRevAll as any)['_sum'].value}` : ""}</span>
                  <span className="">{`€ ${((infoCashAll != null ? Number((infoCashAll as any)['_sum'].value) : 0) + (infoCardAll != null ? Number((infoCardAll as any)['_sum'].value) : 0) + (infoRevAll != null ? Number((infoRevAll as any)['_sum'].value) : 0))}`}</span>
                </div>
                <div className="grid grid-cols-5 mt-2 mb-5">
                  <span className=" font-bold">Items</span>
                  <span className="">{infoCashAll != null ? `${(infoCashAll as any)['_count'].id}` : ""} </span>
                  <span className="">{infoCardAll != null ? `${(infoCardAll as any)['_count'].id}` : ""}</span>
                  <span className="">{infoRevAll != null ? `${(infoRevAll as any)['_count'].id}` : ""}</span>
                  <span className="">{`${((infoCashAll != null ? Number((infoCashAll as any)['_count'].id) : 0) + (infoCardAll != null ? Number((infoCardAll as any)['_count'].id) : 0) + (infoRevAll != null ? Number((infoRevAll as any)['_count'].id) : 0))}`}</span>
                </div>
              </div>

            </div>
          </div>

        </>

      }
    </div>
  )
}