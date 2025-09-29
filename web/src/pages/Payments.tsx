import { AxiosError } from "axios"
import { MRT_ColumnDef } from "material-react-table"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import DataTableCustom from "../components/DataTableCustom"
import { DialogListModal } from "../components/DialogListModal"
import { api, getToken } from "../lib/axios"
import { Loading } from "../components/Loading";
import { ButtonGroupList } from "../components/ButtonGroupList"
import dayjs from "dayjs"

const selectPromise = (inputValue: string) => new Promise<any[]>((resolve, reject) => {
  console.log('call select list')
  api.get('owners/select', { params: { name: inputValue }, headers: { Authorization: getToken() } }).then(response => {
    var data = response.data
    var listData: any[] = []
    data.forEach((element: any) => {
      listData.push({ value: element.id, label: element.name })
    });
    resolve(listData)
  }).catch((err: AxiosError) => {
    const data = err.response?.data as { message: string }
    toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
    throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
  })
})



export function Payments() {

  const [payments, setPayments] = useState([{}])
  const [extracts, setExtracts] = useState([{}])
  const [openIndex, setOpenIndex] = useState(-1)
  const [openListModal, setOpenListModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)
  const [searchButton, setSearchButton] = useState('O')
  const [endDate, setEndDate] = useState<Date>(dayjs().toDate());
  const [startDate, setStartDate] = useState<Date>(dayjs().subtract(1, 'month').toDate());
  const [selectDateType, setSelectDateType] = useState<string>('M')
  

  useEffect(() => {
    handlePayments(searchButton)
  }, [searchButton, startDate, endDate, selectDateType])

  function handlePayments(status: string) {
    setLoading(true)
    const all = status === 'A';
    const done = status === 'C';
    const startDateParsed = dayjs(startDate).toISOString()
    const endDateParsed = dayjs(endDate).toISOString()
    console.log('parsed')
    console.log(startDateParsed)
    console.log(endDateParsed)
    api.get('payment', {
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
    })
  }

  function updateDataRow(data: any) {
    setLoading(true)
    const cloneData = JSON.parse(JSON.stringify(data))
    delete cloneData.id;
    delete cloneData.date;
    console.log('update payment')
    const promise = new Promise((resolve, reject) => {
      api.put('payment', cloneData, {
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
    })
    return promise
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
    });
    return promise
  }

  function createNewRow(data: any) {
    setLoading(true)
    var newData = { owner_id: Number(data['owner']), value: Number(data.value), description: data.description };
    console.log('craeted')
    const promise = new Promise((resolve, reject) => {
      api.post('payment', newData, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Created payment: ${response.data?.id}`, { position: "top-center", autoClose: 1000, })
        setLoading(false)
        handlePayments(searchButton)
        resolve(`Created payment: ${response.data?.id}`);
      }).catch((err: AxiosError) => {
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
  }

  function changeCalendarDates(data: any[]) {
    setStartDate(data[0])
    setEndDate(data[1])
    setSelectDateType(data[2])
    console.log('change calendar dates')
    console.log(data)
    const promise = new Promise((resolve, reject) => {
        handlePayments(searchButton)
        resolve("");
    });
    return promise
  }

  const headersExtracts: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      size: 130,
      enableEditing: false,
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
        (renderedCellValue == null) ? null :
          <>
            <span className="font-semibold">{'€ '}</span>
            <span className="text-green-600 font-semibold">{renderedCellValue}</span>
          </>
      )
    },

    {
      accessorKey: 'totalValue',
      header: 'Owned',
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
    {
      accessorKey: 'done',
      header: 'Done',
      size: 100,
       Cell: ({ renderedCellValue, row }) => (
        <>
          <span className="text-neutral-600 font-bold">{renderedCellValue ? 'X' : ''}</span>
        </>
      )
    },
    {
      accessorKey: 'description',
      header: 'Description',
      size: 300,
    }
  ]

  function callListExtracts(id: number) {
    setLoadingModal(true)
    const all = searchButton === 'A';
    const done = searchButton === 'C';
    const startDateParsed = dayjs(startDate).toISOString()
    const endDateParsed = dayjs(endDate).toISOString()
    api.get('payment/extracts', {
      params: {
          id,
          all,
          done,
          startDate: startDateParsed,
          endDate: endDateParsed
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      console.log('return call list extracts')
      var listResponde = JSON.parse(JSON.stringify(response.data))
      var listExtract = []
      console.log(listResponde)
      setExtracts(listResponde)
      setLoadingModal(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoadingModal(false)
    })
  }

  const headers: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 180,
    },
    {
      accessorKey: 'dogsName',
      header: 'Dogs',
      size: 180,
    },
    {
      accessorKey: 'extracts',
      header: 'Items',
      size: 100,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <div className="w-full cursor-pointer" onClick={() => {
            setOpenListModal(true)
            setOpenIndex(row.original.id)
          }}>
            <span className="font-semibold">{renderedCellValue}</span>
          </div>
          {row.original.id == openIndex && openListModal ?
            <DialogListModal
              open={openListModal}
              onClose={() => setOpenListModal(false)}
              onSubmit={() => console.log('submit')}
              name={row.original.name}
              callInit={() => callListExtracts(row.original.id)}
              data={extracts}
              setData={setExtracts}
              headers={headersExtracts}
              loading={loadingModal}
              deleteRow={(id) => deleteDataRow(id)}
              updateRow={(data) => updateDataRow(data)}
              infoData={{ owner: row.original.name, dogs: row.original.dogsName }}
            />
            : null}
        </>
      )
    },
    {
      accessorKey: 'value',
      header: 'Sales',
      size: 100,
      Cell: ({ renderedCellValue, row }) => (
        <div className="w-full cursor-pointer" onClick={() => {
          setOpenListModal(true)
          setOpenIndex(row.original.id)
        }}>
          <span className="font-semibold">{'€ '}</span>
          <span className="text-green-600 font-semibold">{renderedCellValue}</span>
        </div>
      )
    },
    {
      accessorKey: 'paidValue',
      header: 'Paid',
      size: 100,
      Cell: ({ renderedCellValue, row }) => (
        <div className="w-full cursor-pointer" onClick={() => {
          setOpenListModal(true)
          setOpenIndex(row.original.id)
        }}>
          {(renderedCellValue == null) ? null :
            <>
              <span className="font-semibold">{'€ '}</span>
              <span className="text-green-600 font-semibold">{renderedCellValue}</span>
            </>
          }
        </div>
      )
    },
    {
      accessorKey: 'totalValue',
      header: 'Owned',
      size: 100,
      Cell: ({ renderedCellValue, row }) => (
        <div className="w-full cursor-pointer" onClick={() => {
          setOpenListModal(true)
          setOpenIndex(row.original.id)
        }}>
          <span className="font-semibold">{'€ '}</span>
          {Number(renderedCellValue) > 0 ?
            <span className="text-red-600 font-semibold">{renderedCellValue}</span>
            :
            <span className="text-green-600 font-semibold">{renderedCellValue}</span>
          }
        </div>
      )
    },
  ]

  const columnHeadersPayment = [
    {
      accessorKey: 'owner',
      label: 'Owner',
      name: 'Choose owner',
      type: "select",
      required: true,
      getDataSelect: selectPromise
    },
    {
      accessorKey: 'value',
      label: 'Value',
      name: 'Ex: 12.5',
      type: "number",
      required: true,
    },
    {
      accessorKey: 'description',
      label: 'Description',
      name: 'Ex: Gromming ...',
      type: "text",
    },
  ]

  

  function selectOrders(value: any) {
    setSearchButton(value)
    handlePayments(value)
  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h3 className="font-medium text-3xl md:text-4xl text-white font-borsok">Payments/Orders</h3>
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
              title="Payments"
              createData={columnHeadersPayment}
              createRow={(data) => createNewRow(data)}
              searchCalendar={(data) => changeCalendarDates(data)}
              calendarData={[startDate, endDate, selectDateType]}
            />
          </div>
        </>

      }
    </div>
  )
}