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
    header: 'Dog Name',
  },
  {
    accessorKey: 'birthdayDate',
    header: 'Birthday',
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

  function onClickRowOwner(id: string) {
    console.log(id)
  }

  function updateDataRow(data: object) {
    console.log(data)
  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h1 className="font-semibold text-3xl md:text-4xl text-white">Dogs List</h1>
      <div className="md:flex bg-white w-full p-4 md:p-8 mt-4 rounded">
        <ButtonLight text="New Owner" onClick={newDog}/>
      </div>
      
      <div className="md:flex bg-white w-full mt-4 rounded">
        <DataTableCustom title='Dogs' data={dogs} headers={headers} setData={(data) => setDogs(data)} updateRow={(data) => updateDataRow(data)}/>
      </div>
    </div>
  )
}

//        <DataTableCustom headers={["Name", "Birth Date", "Gender", "Colour", "Bread"]} onClick={(id) => onClickRowOwner(id)} data={dogs}/>
