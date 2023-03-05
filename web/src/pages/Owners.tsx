import { ButtonLight } from "../components/ButtonLight";
import { useNavigate } from 'react-router-dom';
import DataTableCustom from "../components/DataTableCustom";
import { useEffect, useState } from "react";
import { api, getToken } from "../lib/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";


const headers = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 150,
  },
  {
    accessorKey: 'emailAddress',
    header: 'Email',
  },
  {
    accessorKey: 'phoneOne',
    header: 'Phone',
    size: 100,
  },
  {
    accessorKey: 'phoneTwo',
    header: 'Phone 2',
    size: 100,
  }, 
  {
    accessorKey: 'address',
    header: 'Address'
  }
]

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
    type: "email",
    required: true,
  },
  {
    accessorKey: 'phoneOne',
    label: 'Phone One',
    name: '+353 8x xxx xxxx',
    type: "tel",
    required: true,
  },
  {
    accessorKey: 'phoneTwo',
    label: 'Phone Two',
    name: '+353 8x xxx xxxx',
    type: "tel",
  }, 
  {
    accessorKey: 'address',
    label: 'Address',
    name: 'Owner Address',
    type: "text",
    required: true,
  }
]

export function Owners(){

  //const navigate = useNavigate();
  const [owners, setOwners] = useState([{}])

  /*function newOwnerDog() {
    navigate('new')
  }*/

  useEffect(() => {
    api.get('owners', {
      headers: {
        Authorization: getToken()
      }
    }).then(response =>{
      console.log(response.data)
      var data = response.data
      var listData = JSON.parse(JSON.stringify(data));
      /*for(const i in listData) {
        delete listData[i].phoneTwo;
      }*/
      setOwners(listData)
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

  function createNewRow(data: object) {
    console.log(data)
    const promise = new Promise((resolve, reject) => {
      api.post('owners', data, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Created: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
        throw new Error(`Unidentified error: ${data.message || err.message}`);
      })
    });
    return promise
  }

  /*
  <div className="md:flex bg-white w-full p-4 md:p-8 mt-4 rounded">
    <ButtonLight text="New Owner" onClick={newOwnerDog}/>
  </div>
  */

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h1 className="font-medium text-3xl md:text-4xl text-white">Owners</h1>

      <div className="md:flex bg-white w-full mt-4 rounded">
        <DataTableCustom 
          headers={headers} 
          data={owners} 
          setData={(data) => setOwners(data)} 
          title="Owners" 
          updateRow={(data) => updateDataRow(data)} 
          createData={columnHeaders}
          createRow={(data) => createNewRow(data)}
        />
      </div>
    </div>
  )
}