import { AxiosError } from "axios"
import { MRT_ColumnDef } from "material-react-table"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import DataTableCustom from "../components/DataTableCustom"
import { api, getToken } from "../lib/axios"
import { Loading } from "../components/Loading";
import { ButtonGroupList } from "../components/ButtonGroupList"
import dayjs from "dayjs"
import PaidIcon from '@mui/icons-material/Paid';
import { theme, iconStyle, iconSmallStyle } from "../lib/theme";
import { PaymentAllModal } from "../components/payment/PaymentAllModal"
import { PaysInfoListModal } from "../components/payment/PaysInfoListModal"
import {Helmet} from "react-helmet";
import InfoItemButton from "../components/attendance/InfoItemButton"

const selectPromise = (inputValue: string) => new Promise<any[]>((resolve, reject) => {
  api.get('owners/select', { params: { name: inputValue }, headers: { Authorization: getToken() } }).then(response => {
    var data = response.data
    var listData: any[] = []
    data.forEach((element: any) => {
      listData.push({ value: element.id, label: `${element.name} - ${element.phoneOne}` })
    });
    resolve(listData)
  }).catch((err: AxiosError) => {
    const data = err.response?.data as { message: string }
    toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
    throw new Error(`${data.message || err.response?.data || err.message}`);
  })
})



export function PreviousPay() {

  const [payments, setPayments] = useState([{}])
  const [loading, setLoading] = useState(false)
  const [searchButton, setSearchButton] = useState('C')
  const [skip, setskip] = useState(0)


  useEffect(() => {
    handlePayments(searchButton, skip)
  }, [searchButton, skip])

  function handlePayments(status: string, skip:number) {
    setLoading(true)
    const all = status === 'A';
    const done = status === 'C';
    api.get('payment/previous', {
      params: {
        all,
        done,
        skip
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      var listResponde = JSON.parse(JSON.stringify(response.data))
      setPayments(listResponde)
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    })
  }

  const headers: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Time',
      size: 150,
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
      accessorKey: 'extracts',
      header: 'Total',
      size: 70,
    },
    {
      accessorKey: 'dogsName',
      header: 'Dogs',
      size: 180,Cell: ({ renderedCellValue, row }) => (
        <>
          <InfoItemButton children={<span className="font-base">{renderedCellValue}</span>} id={Number(row.original.id)} onClose={() => {}}/>
        </>
      )
    },
    {
      accessorKey: 'name',
      header: 'Owner/Name',
      size: 180,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <span className="font-base">{renderedCellValue}</span>
        </>
      )
    },
    
    /*{
      accessorKey: 'extracts',
      header: 'Items',
      size: 100,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <div className="w-full cursor-pointer" onClick={() => {
            setOpenListModal(true)
            setOpenIndex(row.original.id)
          }}>
            <span className="font-semibold">Test {row.original.extracts}</span>
          </div>
          {row.original.id == openIndex && openListModal ?
            <PaysInfoListModal
              open={openListModal}
              onClose={() => {
                setOpenListModal(false)
                handlePayments(searchButton)
              }}
              infoData={{ownerId:row.original.id, dateStart: startDate.toISOString(), dateEnd: endDate.toISOString(), all: searchButton === 'A', done: searchButton === 'C'}}
            />
            : null}
        </>
      )
    },*/
    {
      accessorKey: 'type',
      header: 'Local',
      size: 60,
      Cell: ({ renderedCellValue, row }) => (
        <>
          {String(row.original.type).trim().includes('D') ?
            <h5 className="bg-green-500 text-white text-xs font-semibold rounded-3xl py-1 px-2 w-fit">DC</h5> :
            <h5 className="bg-orange-500 text-white text-xs font-semibold rounded-3xl py-1 px-2 w-fit">G</h5> 
          }
        </>
      )
    },
    {
      accessorKey: 'value',
      header: 'Sales',
      size: 100,
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
      size: 100,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <span className="font-semibold">{'€ '}</span>
          <span className="text-green-600 font-semibold">{renderedCellValue}</span>
        </>
      )
    },
    
    {
      accessorKey: 'totalValue',
      header: 'Owed',
      size: 100,
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
  ]


  function selectOrders(value: any) {
    setSearchButton(value)
    handlePayments(value, skip)
  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <Helmet>
        <title>Last Payments</title>
      </Helmet>
      <h3 className="font-medium text-3xl md:text-5xl text-pinkBackground font-borsok">Last Payments</h3>
      {loading ? <div className="w-full flex justify-center"><Loading /> </div> :
        <>
          <div className="md:flex w-fit rounded m-1 bg-white">
            <ButtonGroupList listButtons={[{ key: "O", name: "Opened" }, { key: "C", name: "Closed" }, { key: "A", name: "All" }]} selectButton={(value) => selectOrders(value)} selectedButton={searchButton} />
          </div>
          <div className="md:flex bg-white w-full mt-4 rounded">
            <DataTableCustom
              headers={headers}
              data={payments}
              setData={(data) => setPayments(data)}
              title="Last Payments"
    
              hideColumns={searchButton != 'O' ? {action: false} : null}
              //searchCalendar={(data) => changeCalendarDates(data)}
              //calendarData={[startDate, endDate, selectDateType]}
              disableActions={true}
              pageSize={50}
              titleCreate="Add New Payment"
            />
          </div>
        </>

      }
    </div>
  )
}