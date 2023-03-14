import { AxiosError } from "axios"
import { MRT_ColumnDef } from "material-react-table"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import DataTableCustom from "../components/DataTableCustom"
import { DialogListModal } from "../components/DialogListModal"
import { api, getToken } from "../lib/axios"



export function Payments(){

  const [payments, setPayments] = useState([{}])
  const [extracts, setExtracts] = useState([{}])
  const [openIndex, setOpenIndex] = useState(-1)
  const [openListModal, setOpenListModal] = useState(false)

  const headersExtracts:MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 150,
    }
  ]

  const headers:MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 150,
    },
    {
      accessorKey: 'extracts',
      header: 'Count',
      size: 80,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <div className="w-full cursor-pointer" onClick={() => {
            setOpenListModal(true)
            setOpenIndex(row.original.id)
          }}>
            <span>{renderedCellValue}</span>
          </div>
          {row.original.id == openIndex && openListModal ? 
            <DialogListModal 
              open={openListModal}
              onClose={() => setOpenListModal(false)}
              onSubmit={() => console.log('submit')}
              name={row.original.name}
              callInit={() => console.log('cal init')}
              data={extracts}
              setData={setExtracts}
              headers={headersExtracts}
            />
          : null
          }
        </>
       
      )
    },
    {
      accessorKey: 'total',
      header: 'Total Valor',
      size: 80,
      Cell: ({ renderedCellValue, row }) => (
        <>
          { row.original.total > 0 || row.original.total < 0 ?
            <span className="text-red-600 font-medium">{renderedCellValue}</span>
          :
            <span className="text-green-600 font-medium">{renderedCellValue}</span>
          }
        </>
      )
    },
  ]

  useEffect(() => {
    api.get('payment', {
      headers: {
        Authorization: getToken()
      }
    }).then(response =>{
      console.log(response.data)
      var data = response.data
      var listData = JSON.parse(JSON.stringify(data));
      setPayments(listData)
    }).catch((err: AxiosError) => {
      console.log(err)
      console.log(err.response?.data)
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      return 
    })
  }, [])

  function updateDataRow(data: object) {
    console.log(data)
    api.put('owners', data, {
      params: {
        id: (data as any).id
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      toast.success(`Updated: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
    }).catch((err: AxiosError) => {
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      return 
    })
  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h1 className="font-medium text-3xl md:text-4xl text-white">Payments</h1>
      
      <div className="md:flex bg-white w-full mt-4 rounded">
        <DataTableCustom headers={headers} data={payments} setData={(data) => setPayments(data)} title="Payments" />
      </div>
    </div>
  )
}