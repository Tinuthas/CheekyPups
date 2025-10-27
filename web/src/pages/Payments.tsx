import { AxiosError } from "axios"
import { MRT_ColumnDef } from "material-react-table"
import { useEffect, useState } from "react"
import { toast } from "react-toastify"
import DataTableCustom from "../components/DataTableCustom"
import { DialogListModal } from "../components/payment/PaymentsListModal"
import { api, getToken } from "../lib/axios"
import { Loading } from "../components/Loading";
import { ButtonGroupList } from "../components/ButtonGroupList"
import dayjs from "dayjs"
import PaidIcon from '@mui/icons-material/Paid';
import { theme, iconStyle, iconSmallStyle } from "../lib/theme";
import { PaymentAllModal } from "../components/payment/PaymentAllModal"
import { PaysInfoListModal } from "../components/payment/PaysInfoListModal"

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



export function Payments() {

  const [payments, setPayments] = useState([{}])
  const [extracts, setExtracts] = useState([{}])
  const [ownerExtract, setOwnerExtract] = useState<any>({})
  const [openIndex, setOpenIndex] = useState(-1)
  const [openListModal, setOpenListModal] = useState(false)
  const [openPayingModal, setOpenPayingModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingModal, setLoadingModal] = useState(false)
  const [searchButton, setSearchButton] = useState('O')
  const [endDate, setEndDate] = useState<Date>(dayjs().toDate());
  const [startDate, setStartDate] = useState<Date>(dayjs().subtract(1, 'month').toDate());
  const [selectDateType, setSelectDateType] = useState<string>('T')

  const [salesField, setSalesField] = useState("")
  const [paidField, setPaidField] = useState(false)
  const [newCustomerField, setNewCustomerField] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [valuePaidField, setValuePaidField] = useState("")


  useEffect(() => {
    handlePayments(searchButton)
  }, [searchButton, startDate, endDate, selectDateType])

  function handlePayments(status: string) {
    setLoading(true)
    const all = status === 'A';
    const done = status === 'C';
    const startDateParsed = dayjs(startDate).toISOString()
    const endDateParsed = dayjs(endDate).toISOString()
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
      setPayments(listResponde)
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    })
  }

  function createNewRow(data: any) {
    setLoading(true)
    var newData = { owner_id: Number(data['owner']), value: Number(data.value), description: data.description, paidValue: Number(data.paidValue), typePaid: data.typePaid, paid: data.paid, newCustomer: data.newCustomer, customerName: data.customerName, customerPhone: data.customerPhone};
    const promise = new Promise((resolve, reject) => {
      api.post('payment', newData, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Created payment: ${response.data?.Owner.name} Number: ${response.data?.id}`, { position: "top-center", autoClose: 1000, })
        handlePayments(searchButton)
        resolve(`Created payment: ${response.data?.id}`);
      }).catch((err: AxiosError) => {
        const data = err.response?.data as { message: string }
        toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        handlePayments(searchButton)
        throw new Error(`${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
  }

  function changeCalendarDates(data: any[]) {
    setStartDate(data[0])
    setEndDate(data[1])
    setSelectDateType(data[2])
    const promise = new Promise((resolve, reject) => {
      handlePayments(searchButton)
      resolve("");
    });
    return promise
  }


  const headers: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 180,
      Cell: ({ renderedCellValue, row }) => (
      <>
        <div className="w-full cursor-pointer" onClick={() => {
          setOpenListModal(true)
          setOpenIndex(row.original.id)
        }}>
          <span className="font-base">{renderedCellValue}</span>
        </div>
        </>
      )
    },
    {
      accessorKey: 'dogsName',
      header: 'Dogs',
      size: 180,Cell: ({ renderedCellValue, row }) => (
      <>
        <div className="w-full cursor-pointer" onClick={() => {
          setOpenListModal(true)
          setOpenIndex(row.original.id)
        }}>
          <span className="font-base">{renderedCellValue}</span>
        </div>
        </>
      )
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
      header: 'Owed',
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
    {
      accessorKey: 'action',
      header: 'Pay',
      size: 75,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <div className="w-full cursor-pointer" onClick={() => {
            setOpenPayingModal(true)
            setOpenIndex(row.original.id)
          }}>
            <PaidIcon sx={iconSmallStyle} />
          </div>
          {row.original.id == openIndex && openPayingModal ?
            <PaymentAllModal
              open={openPayingModal}
              onClose={() => setOpenPayingModal(false)}
              onSubmit={(values) => handlePayingAllRow(values)}
              ownerDog={{ owner: row.original.name, id: row.original.id, sales: row.original.totalValue }}
            //name={row.original.name}
            />
            : null}
        </>
      )
    }
  ]

  const columnHeadersPayment = [
    {
      accessorKey: 'owner',
      label: 'Owner',
      name: 'Choose owner',
      type: "select",
      required: newCustomerField ? false : true,
      getDataSelect: selectPromise,
      gridXS: 12, gridMS: 6,
    },
    {
      accessorKey: 'value',
      label: 'Sales',
      name: '',
      type: "number",
      value: salesField,
      setValue: (value:any) =>  {
        setSalesField(value)
        setValuePaidField(value)
      },
      required: true,
      gridXS: 12, gridMS: 6,
    },{
      accessorKey: 'newCustomer',
      label: 'New Customer',
      name: 'New Customer',
      type: "checkbox",
      value: newCustomerField,
      setValue: (value:any) => setNewCustomerField(value),
      gridXS: 12, gridMS: newCustomerField ? 4 : 12,
      marginGridTop: newCustomerField ? '16px' : '0px'
    },
    {
      accessorKey: 'customerName',
      label: 'Customer Name',
      name: '',
      type: "text",
      noShow: !newCustomerField,
      required: true,
      gridXS: 12, gridMS: 4,
    },
    {
      accessorKey: 'customerPhone',
      label: 'Phone',
      name: '',
      type: "text",
      noShow: !newCustomerField,
      required: true,
      gridXS: 12, gridMS: 4
    },
    {
      accessorKey: 'paid',
      label: 'Paid',
      name: 'Paid',
      type: "checkbox",
      value: paidField,
      setValue: (value:any) => setPaidField(value),
      gridXS: 12, gridMS: 4,
      marginGridTop: paidField ? '16px' : '0px'
    },
    {
      accessorKey: 'typePaid',
      label: 'Payment',
      name: 'Choose Payment Type',
      type: "select",
      noShow: !paidField,
      required: true,
      getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
        var listData: any[] = [{ value: 'CASH', label: 'Cash' }, { value: 'CARD', label: 'Card' }, { value: 'REV', label: 'Revolut' }]
        resolve(listData)
      }),
      gridXS: 12, gridMS: 4,
    },

    {
      accessorKey: 'paidValue',
      label: 'Value Paid',
      name: '',
      type: "number",
      value: valuePaidField,
      noShow: !paidField,
      setValue: (value:any) => setValuePaidField(value),
      gridXS: 12, gridMS: 4
    },
    {
      accessorKey: 'description',
      label: 'Description',
      name: 'Ex: Voucher, CBD Oil ...',
      type: "text",
      gridXS: 12, gridMS: 12
    },
  ]


  function selectOrders(value: any) {
    setSearchButton(value)
    handlePayments(value)
  }

  function handlePayingAllRow(values: any) {
    try {
      setLoading(true)
      api.post('payment/owner', values, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Payments done`, { position: "top-center", autoClose: 1000, })
        handlePayments('O')
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as { message: string }
        toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
      })
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }

  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h3 className="font-medium text-3xl md:text-5xl text-pinkBackground font-borsok">Payments/Orders</h3>
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
              hideColumns={searchButton != 'O' ? {action: false} : null}
              createRow={(data) => createNewRow(data)}
              searchCalendar={(data) => changeCalendarDates(data)}
              calendarData={[startDate, endDate, selectDateType]}
              disableActions={true}
              titleCreate="Add New Payment"
            />
          </div>
        </>

      }
    </div>
  )
}