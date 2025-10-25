import { ButtonLight } from "../components/ButtonLight";
import { useNavigate } from 'react-router-dom';
import DataTableCustom from "../components/DataTableCustom";
import { useEffect, useState } from "react";
import { api, getToken } from "../lib/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { Loading } from "../components/Loading";
import { ButtonGroupList } from "../components/ButtonGroupList";
import { MRT_ColumnDef } from "material-react-table";
import { PaysInfoListModal } from "../components/payment/PaysInfoListModal";


export function Owners() {

  const [searchButton, setSearchButton] = useState('A')
  const [owners, setOwners] = useState([{}])
  const [openIndex, setOpenIndex] = useState(-1)
  const [openListModal, setOpenListModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ownerType, setOwnerType] = useState('D')


  useEffect(() => {
    getAllOwnersFilter()
  }, [])

  const columnHeaders = [
  {
    accessorKey: 'name',
    label: 'Name',
    name: 'Owner Name',
    type: "text",
    required: true,
  },
  {
    accessorKey: 'emailAddress',
    label: 'Email',
    name: 'Owner Email',
    type: "email"
  },
  {
    accessorKey: 'phoneOne',
    label: 'Phone One',
    name: '08x xxx xxxx',
    type: "tel",
    required: true,
  },
  {
    accessorKey: 'type',
    label: 'Daycare or Grooming',
    name: '',
    value: ownerType,
    setValue: (value: string) => setOwnerType(value),
    type: "radio",
    radioListValues: [
      { key: "daycare", value: "D", label: "Daycare" },
      { key: "grooming", value: "G", label: "Grooming" },
    ]
  },
  {
    accessorKey: 'secondOwner',
    label: 'Second Owner Name',
    name: '',
    type: "text",
  },
  {
    accessorKey: 'phoneTwo',
    label: 'Phone Two',
    name: '8x xxx xxxx',
    type: "tel",
  },
  {
    accessorKey: 'address',
    label: 'Address',
    name: 'Owner Address',
    type: "text",
  },
  {
    accessorKey: 'notes',
    label: 'Notes',
    name: '',
    type: "text",
  }
]

  const headers: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 200,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <div className="w-full cursor-pointer" onClick={() => {
            setOpenListModal(true)
            setOpenIndex(row.original.id)
          }}>
            <span>{renderedCellValue}</span>
          </div>
          {row.original.id == openIndex && openListModal ?
            <PaysInfoListModal
              open={openListModal}
              onClose={() => setOpenListModal(false)}
              infoData={{ownerId:row.original.id}}
            />
            : null}
        </>
      )
    },
    {
      accessorKey: 'emailAddress',
      header: 'Email',
      size: 200,
    },
    {
      accessorKey: 'phoneOne',
      header: 'Phone',
      size: 135,
    },
    {
      accessorKey: 'type',
      header: 'D/G',
      size: 80,
    },
    {
      accessorKey: 'secondOwner',
      header: '2nd Owner Name',
      size: 200
    },
    {
      accessorKey: 'phoneTwo',
      header: 'Phone 2',
      size: 135,
    },
    {
      accessorKey: 'address',
      header: 'Address'
    },
    {
      accessorKey: 'notes',
      header: 'Notes'
    }
  ]

  const headersOwnerDog: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      size: 150,
      enableEditing: false,
    },
    {
      accessorKey: 'value',
      header: 'Value',
      size: 130,
      Cell: ({ renderedCellValue, row }) => (
        <>
          {Number(row.original.value) <= 0 ?
            <span className="text-red-600 font-medium">{renderedCellValue}</span>
            :
            <span className="text-green-600 font-medium">{renderedCellValue}</span>
          }
        </>
      )
    },
    {
      accessorKey: 'description',
      header: 'Description',
      size: 300,
    }
  ]


  function getAllOwnersFilter(type?: string) {
    if (type == null || type == 'A')
      getAllOwners()
    else
      getAllOwnersQuery(type)
  }

  function getAllOwners() {
    setLoading(true)
    api.get('owners', {
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      var data = response.data
      var listData = JSON.parse(JSON.stringify(data));
      setOwners(listData)
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    })
  }

  function getAllOwnersQuery(type: string) {
    setLoading(true)
    api.get('owners/type', {
      params: {
        type: type
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      var data = response.data
      var listData = JSON.parse(JSON.stringify(data));
      setOwners(listData)
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    })
  }

  function updateDataRow(data: object) {
    setLoading(true)
    const promise = new Promise((resolve, reject) => {
      api.put('owners', data, {
        params: {
          id: (data as any).id
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Updated: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
        resolve(`Updated: ${response.data?.name}`);
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

  function createNewRow(data: object) {
    setLoading(true)
    const promise = new Promise((resolve, reject) => {
      api.post('owners', data, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Created: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
        resolve(`Created: ${response.data?.name}`);
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

  function deleteDataRow(id: number) {
    setLoading(true)
    const promise = new Promise((resolve, reject) => {
      api.delete('owners', {
        params: {
          id,
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Deleted: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
        resolve(`Deleted: ${response.data?.name}`);
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

  function selectTypeOwner(value: any) {
    setSearchButton(value)
    getAllOwnersFilter(value)
  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h3 className="font-medium text-3xl md:text-5xl text-pinkBackground font-borsok">Owners</h3>

      {loading ? <div className="w-full flex justify-center"><Loading /> </div> :
        <>
          <div className="md:flex w-fit rounded m-1 bg-white">
            <ButtonGroupList listButtons={[{ key: "A", name: "All" }, { key: "D", name: "Daycare" }, { key: "G", name: "Grooming" }]} selectButton={(value) => selectTypeOwner(value)} selectedButton={searchButton} />
          </div>
          <div className="md:flex bg-white w-full mt-4 rounded">
            <DataTableCustom
              headers={headers}
              data={owners}
              setData={(data) => setOwners(data)}
              titleCreate="Add New Owner"
              title="Owners"
              updateRow={(data) => updateDataRow(data)}
              createData={columnHeaders}
              createRow={(data) => createNewRow(data)}
              deleteRow={(id) => deleteDataRow(id)}
            />
          </div>
        </>
      }
    </div>
  )
}


