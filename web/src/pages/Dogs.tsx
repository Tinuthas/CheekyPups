import { DataGrid, GridRowsProp, GridColDef } from '@mui/x-data-grid';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { ButtonLight } from '../components/ButtonLight';
import DataTableCustom from '../components/DataTableCustom';
import { api, getToken } from '../lib/axios';

const headers = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'birthdayDate',
    header: 'Birthday',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'colour',
    header: 'Colour',
  },
  {
    accessorKey: 'breed',
    header: 'Breed'
  }
]

const selectPromise = (inputValue: string) => new Promise<any[]>((resolve, reject) => { 

  api.get('owners/select', { params: { name: inputValue}, headers: { Authorization: getToken()}}).then(response =>{
    var data = response.data
    var listData:any[] = []
    data.forEach((element:any) => {
      listData.push({value: element.id, label: element.name})
    });
    resolve(listData)
  }).catch((err: AxiosError) => {
    console.log(err)
    console.log(err.response?.data)
    const data = err.response?.data as {message: string}
    toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
    throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
  })

})

/*const selectPromise = Promise.resolve([{ value: 'chocolate', label: 'Chocolate' },
{ value: 'strawberry', label: 'Strawberry' }, { value: 'name', label: 'Declan' }])*/

const columnHeaders = [
  {
    accessorKey: 'owner',
    label: 'Owner',
    name: 'Choose owner',
    type: "select",
    required: true,
    getDataSelect: selectPromise
  },
  {
    accessorKey: 'name',
    label: 'Dog Name',
    name: 'Ex. Einstein',
    type: "text",
    required: true,
  },
  {
    accessorKey: 'birthdayDate',
    label: 'Birthday Date',
    name: '',
    type: "date",
    required: true,
  },
  {
    accessorKey: 'gender',
    label: 'Gender',
    name: 'Ex. Male, Female',
    type: "text",
    required: true,
  },
  {
    accessorKey: 'colour',
    label: 'Colour',
    name: 'Ex. Black, White',
    type: "text",
    required: true,
  },
  {
    accessorKey: 'breed',
    label: 'Breed',
    name: 'Ex. Collin, Cockapoo',
    type: "text",
    required: true,
  }
]

export function Dogs(){

  const navigate = useNavigate();
  const [dogs, setDogs] = useState([{}])

  function newDog() {
    navigate('new')
  }

  useEffect(() => {
    api.get('dogs', {
      headers: {
        Authorization: getToken()
      }
    }).then(response =>{
      console.log(response.data)
      var data = response.data
      var listData = JSON.parse(JSON.stringify(data));
      for(const i in listData) {
        listData[i].birthdayDate = dayjs(listData[i].birthdayDate).format('DD/MM/YYYY')
        delete listData[i].ownerId;
      }
      console.log(listData)
      setDogs(listData)
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
  }

  /*
    <div className="md:flex bg-white w-full p-4 md:p-8 mt-4 rounded">
      <ButtonLight text="New Owner" onClick={newDog}/>
    </div>
  */

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h1 className="font-medium text-3xl md:text-4xl text-white">Dogs</h1>
      
      <div className="md:flex bg-white w-full mt-4 rounded">
        <DataTableCustom 
          title='Dogs' 
          data={dogs} 
          headers={headers} 
          createData={columnHeaders}
          setData={(data) => setDogs(data)} />
      </div>
    </div>
  )
}

//        <DataTableCustom headers={["Name", "Birth Date", "Gender", "Colour", "Bread"]} onClick={(id) => onClickRowOwner(id)} data={dogs}/>
