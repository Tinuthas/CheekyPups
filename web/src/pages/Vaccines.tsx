import { AxiosError } from "axios";
import dayjs from "dayjs";
import { MRT_ColumnDef } from "material-react-table";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import DataTableCustom from "../components/DataTableCustom";
import { api, getToken } from "../lib/axios";

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
      listData.push({value: element.id, label: `${element.name} ${element.surname != null ?'- '+ element.surname : ''}`})
    });
    resolve(listData)
  }).catch((err: AxiosError) => {
    const data = err.response?.data as {message: string}
    toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
    throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
  })
})

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
  },
  {
    accessorKey: 'type',
    label: 'Type',
    name: 'Ex. 7N1KC',
    type: "text",
  }
]

export function Vaccines(){

  const [vaccines, setVaccines] = useState([{}])

  useEffect(() => {
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
    }).catch((err: AxiosError) => {
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      return 
    })
  }, [])

  function updateDataRow(data: any) {
    const cloneData = JSON.parse(JSON.stringify(data))
    
    delete cloneData.dog;
    console.log(cloneData)
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
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data ||err.message}`, { position: "top-center", autoClose: 5000, })
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    })
    return promise
  }

  function deleteDataRow(id: number) {
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
      }).catch((err: AxiosError) => {
        console.log(err)
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
  }

  function createNewRow(data: any) {
    var newData = {dog_id: Number(data['dog']), dateVaccine: data.dateVaccine, typeVaccine: data.type};
    //delete Object.assign(newData, data, {['dog_id']: Number(data['dog']) })['dog'];
    //delete Object.assign(newData, data, {['typeVaccine']: data['type'] })['type'];
    //console.log(newData)
    //return new Promise((resolve) => resolve('success'))
    const promise = new Promise((resolve, reject) => {
      api.post('vaccine', newData, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Created vaccine: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
        resolve(`Created vaccine: ${response.data?.name}`);
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h1 className="font-medium text-3xl md:text-4xl text-white">Vaccines</h1>

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
    </div>
  )
}