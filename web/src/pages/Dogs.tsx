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
    accessorKey: 'owner',
    header: 'Owner',
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

const hideColumns = { owner: false }

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

const columnHeaders = [
  {
    accessorKey: 'ownerId',
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
  },
  {
    accessorKey: 'gender',
    label: 'Gender',
    name: 'Ex. Male, Female',
    type: "text",
  },
  {
    accessorKey: 'colour',
    label: 'Colour',
    name: 'Ex. Black, White',
    type: "text",
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

  const [dogs, setDogs] = useState([{}])

  useEffect(() => {
    api.get('dogs', {
      headers: {
        Authorization: getToken()
      }
    }).then(response =>{
      var data = response.data
      var listData = JSON.parse(JSON.stringify(data));
      for(const i in listData) {
        listData[i].birthdayDate = dayjs(listData[i].birthdayDate).format('DD/MM/YYYY')
        delete listData[i].ownerId;
      }
      setDogs(listData)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      return 
    })
  }, [])

  function updateDataRow(data: any) {
    const cloneData = JSON.parse(JSON.stringify(data))
    delete cloneData.owner;
    const promise = new Promise((resolve, reject) => {
      api.put('dogs', data, {
        params: {
          id: (data as any).id
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Updated: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
        resolve(`Updated: ${response.data?.name}`);
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data ||err.message}`, { position: "top-center", autoClose: 5000, })
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    })
    return promise
  }


  function createNewRow(data: any) {
    var newData = {};
    delete Object.assign(newData, data, {['owner_id']: Number(data['ownerId']) })['ownerId'];
    //return new Promise((resolve) => resolve('success'))
    const promise = new Promise((resolve, reject) => {
      api.post('dogs', newData, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Created: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
        resolve(`Created: ${response.data?.name}`);
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
  }

  function deleteDataRow(id: number) {
    console.log('delete id')
    console.log(id)
    const promise = new Promise((resolve, reject) => {
      api.delete('dogs', {
        params: {
          id,
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Deleted: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
        resolve(`Deleted: ${response.data?.name}`);
      }).catch((err: AxiosError) => {
        console.log(err)
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
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
          hideColumns={hideColumns}
          createRow={(data) => createNewRow(data)}
          updateRow={(data) => updateDataRow(data)}
          deleteRow={(id) => deleteDataRow(id)}
          setData={(data) => setDogs(data)} />
      </div>
    </div>
  )
}

//        <DataTableCustom headers={["Name", "Birth Date", "Gender", "Colour", "Bread"]} onClick={(id) => onClickRowOwner(id)} data={dogs}/>
