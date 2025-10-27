import { AxiosError } from "axios";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DataTableCustom from "../components/DataTableCustom";
import { api, getToken } from "../lib/axios";
import {Loading} from "../components/Loading";

function convertToDate(dateString: string) {
  let d = dateString.split("/");
  return new Date(d[2] + '/' + d[1] + '/' + d[0]);
}

const nowDate = new Date()

function checkDateVaccine(date: string) {
  if(date == undefined) return false
  try{
    var dateConv = convertToDate(date)
    return dateConv < nowDate
  }catch(e) {
    console.log(e)
    return false
  }
}

const headers:MRT_ColumnDef<any>[] = [
  {
    accessorKey: 'dog',
    header: 'Dog',
    enableEditing: false,
  },
  {
    accessorKey: 'dateVaccine',
    header: 'Date Expiration',
    Cell: ({ renderedCellValue, row }) => (
      <>
        { checkDateVaccine(row.original.dateVaccine) ?
          <span className="text-red-600 font-medium">{renderedCellValue}</span>
        :
          <span className="text-green-600 font-medium">{renderedCellValue}</span>
        }
      </>
    )
  },
  {
    accessorKey: 'type',
    header: 'Type',
  },
]


const selectPromise = (inputValue: string) => new Promise<any[]>((resolve, reject) => { 
  api.get('dogs/select', { params: { name: inputValue}, headers: { Authorization: getToken()}}).then(response =>{
    var data = response.data
    var listData:any[] = []
    data.forEach((element:any) => {
      listData.push({value: element.id, label: `${element.name} ${element.nickname != null ?'- '+ element.nickname : ''}`})
    });
    resolve(listData)
  }).catch((err: AxiosError) => {
    const data = err.response?.data as {message: string}
    toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
    throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
  })
})



export function Vaccines(){
  /*
  const [vaccines, setVaccines] = useState([{}])
  const [loading, setLoading] = useState(false)
  const [dateVaccineField, setDateVaccineField] = useState(new Date())

  const columnHeaders = [
    {
      accessorKey: 'dog',
      label: 'Dog',
      name: 'Choose dog',
      type: "select",
      required: true,
      getDataSelect: selectPromise
    },
    {
      accessorKey: 'dateVaccine',
      label: 'Vaccine Expiration Date',
      name: '',
      type: "date",
      value: dateVaccineField,
      setValue: (value:any) => setDateVaccineField(value)
    },
    {
      accessorKey: 'type',
      label: 'Type',
      name: 'Ex. 7N1KC',
      type: "text",
    }
  ]

  function getAllVaccine() {
    setLoading(true)
    api.get('vaccine', {
      headers: {
        Authorization: getToken()
      }
    }).then(response =>{
      var data = response.data
      var listData = JSON.parse(JSON.stringify(data));
      for(const i in listData) {
        listData[i].dateVaccine = dayjs(listData[i].dateVaccine).format('DD/MM/YYYY')
      }
      setVaccines(listData)
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false) 
    })
  }

  useEffect(() => {
    getAllVaccine()
  }, [])

  function updateDataRow(data: any) {
    setLoading(true)
    const cloneData = JSON.parse(JSON.stringify(data))
    delete cloneData.dog;
    const promise = new Promise((resolve, reject) => {
      api.put('vaccine', cloneData, {
        params: {
          id: (data as any).id
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        console.log('success')
        toast.success(`Updated vaccine: ${response.data?.id}`, { position: "top-center", autoClose: 1000, })
        resolve(`Updated vaccine: ${response.data?.id}`);
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data ||err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    })
    return promise
  }

  function deleteDataRow(id: number) {
    setLoading(true)
    const promise = new Promise((resolve, reject) => {
      api.delete('vaccine', {
        params: {
          id,
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Deleted vaccine: ${response.data?.id}`, { position: "top-center", autoClose: 1000, })
        resolve(`Deleted vaccine: ${response.data?.id}`);
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
  }

  function createNewRow(data: any) {
    setLoading(true)
    var newData = {dog_id: Number(data['dog']), dateVaccine: data.dateVaccine, typeVaccine: data.type};
    const promise = new Promise((resolve, reject) => {
      api.post('vaccine', newData, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Created vaccine: ${response.data?.id}`, { position: "top-center", autoClose: 1000, })
        resolve(`Created vaccine: ${response.data?.id}`);
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h1 className="font-medium text-3xl md:text-4xl text-white">Vaccines</h1>
      { loading ? <div className="w-full flex justify-center"><Loading /> </div> :
        <div className="md:flex bg-white w-full mt-4 rounded">
          <DataTableCustom 
            title='Vaccines' 
            data={vaccines} 
            headers={headers} 
            createData={columnHeaders}
            //hideColumns={hideColumns}
            createRow={(data) => createNewRow(data)}
            updateRow={(data) => updateDataRow(data)}
            deleteRow={(id) => deleteDataRow(id)}
            setData={(data) => setVaccines(data)} />
        </div>
      }
    </div>
  )
    */
   return(<></>)
}