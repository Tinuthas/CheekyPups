import { ButtonLight } from "../components/ButtonLight";
import { useNavigate } from 'react-router-dom';
import DataTableCustom from "../components/DataTableCustom";
import { useEffect, useState } from "react";
import { api, getToken } from "../lib/axios";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {Loading} from "../components/Loading";

const headers = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 180,
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
    accessorKey: 'phoneTwo',
    header: 'Phone 2',
    size: 135,
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

  const [owners, setOwners] = useState([{}])
  const [loading, setLoading] = useState(false)

  function getAllOwners() {
    setLoading(true)
    api.get('owners', {
      headers: {
        Authorization: getToken()
      }
    }).then(response =>{
      var data = response.data
      var listData = JSON.parse(JSON.stringify(data));
      setOwners(listData)
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false) 
    })
  }

  useEffect(() => {
    getAllOwners()
  }, [])

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
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data ||err.message}`, { position: "top-center", autoClose: 5000, })
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
        const data = err.response?.data as {message: string}
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
      <h1 className="font-medium text-3xl md:text-4xl text-white">Owners</h1>
      { loading ? <div className="w-full flex justify-center"><Loading /> </div> :
        <div className="md:flex bg-white w-full mt-4 rounded">
          <DataTableCustom 
            headers={headers} 
            data={owners} 
            setData={(data) => setOwners(data)} 
            title="Owners" 
            updateRow={(data) => updateDataRow(data)} 
            createData={columnHeaders}
            createRow={(data) => createNewRow(data)}
            deleteRow={(id) => deleteDataRow(id)}
          />
        </div>
      }   
    </div>
  )
}