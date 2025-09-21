import { useEffect, useState } from "react"
import { Loading } from "../components/Loading"
import DataTableCustom from "../components/DataTableCustom"
import { api, getToken } from "../lib/axios"
import { AxiosError } from "axios"
import { toast } from "react-toastify"

const headers = [
  {
    accessorKey: 'name',
    header: 'Name',
    size: 180,
  },
  {
    accessorKey: 'email',
    header: 'Email',
    size: 200,
  }
]


const columnHeaders = [
  {
    accessorKey: 'name',
    label: 'Name',
    name: 'Users Name',
    type: "text",
    required: true,
  },
  {
    accessorKey: 'email',
    label: 'Email',
    name: 'Email',
    type: "email",
    required: true,
  },
  {
    accessorKey: 'password',
    label: 'Password',
    name: 'Password',
    type: "password",
    required: true,
  }
]

export function Users() {

  const [users, setUsers] = useState([{}])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
      getAllUsers()
  }, [])

  function getAllUsers() {
      setLoading(true)
      api.get('users', {
        headers: {
          Authorization: getToken()
        }
      }).then(response =>{
        var data = response.data
        var listData = JSON.parse(JSON.stringify(data));
        setUsers(listData)
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false) 
      })
    }

  function updateDataRow(data: object) {
    setLoading(true)
    console.log((data as any).id)
    const promise = new Promise((resolve, reject) => {
      api.put('users', data, {
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
    var newData = Object.assign(data, { ['admin']: false })
    const promise = new Promise((resolve, reject) => {
      api.post('users', newData, {
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
      api.delete('users', {
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
  
    

  return(
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h3 className="font-medium text-3xl md:text-4xl text-white font-borsok">Owners</h3>
      { loading ? <div className="w-full flex justify-center"><Loading /> </div> :
        <div className="md:flex bg-white w-full mt-4 rounded">
          <DataTableCustom 
            headers={headers} 
            data={users} 
            setData={(data) => setUsers(data)} 
            title="Users" 
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