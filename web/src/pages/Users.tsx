import { useEffect, useState } from "react"
import { Loading } from "../components/Loading"
import DataTableCustom from "../components/DataTableCustom"
import { api, getToken } from "../lib/axios"
import { AxiosError } from "axios"
import { toast } from "react-toastify"
import {Helmet} from "react-helmet";

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

const headersSettings = [
  {
    accessorKey: 'key',
    header: 'Key',
    size: 180,
  },
  {
    accessorKey: 'value',
    header: 'Value',
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
    gridXS: 12, gridMS: 12,
  },
  {
    accessorKey: 'email',
    label: 'Email',
    name: 'Email',
    type: "email",
    required: true,
    gridXS: 12, gridMS: 12,
  },
  {
    accessorKey: 'password',
    label: 'Password',
    name: 'Password',
    type: "password",
    required: true,
    gridXS: 12, gridMS: 12,
  }
]


const columnHeadersSettings = [
  {
    accessorKey: 'key',
    label: 'Key',
    name: 'Key',
    type: "text",
    required: true,
    gridXS: 12, gridMS: 12,
  },
  {
    accessorKey: 'value',
    label: 'Value',
    name: 'Value',
    type: "text",
    required: true,
    gridXS: 12, gridMS: 12,
  }
]

export function Users() {

  const [users, setUsers] = useState([{}])
  const [settings, setSettings] = useState([{}])
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
        getAllSettings()
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false) 
      })
    }

    function getAllSettings() {
      setLoading(true)
      api.get('preference', {
        headers: {
          Authorization: getToken()
        }
      }).then(response =>{
        var data = response.data
        var listData = JSON.parse(JSON.stringify(data));
        setSettings(listData)
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false) 
      })
    }

  function updateDataRow(data: object) {
    setLoading(true)
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
        toast.error(`${data.message || err.response?.data ||err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`${data.message || err.response?.data || err.message}`);
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
        toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`${data.message || err.response?.data || err.message}`);
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
        toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
  }

  function updateDataRowSetting(data: object) {
    setLoading(true)
    const promise = new Promise((resolve, reject) => {
      api.put('preference', data, {
        params: {
          id: (data as any).id
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Updated: ${response.data?.key}`, { position: "top-center", autoClose: 1000, })
        resolve(`Updated: ${response.data?.key}`);
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`${data.message || err.response?.data ||err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`${data.message || err.response?.data || err.message}`);
      })
    })
    return promise
  }

  function createNewRowSetting(data: object) {
    setLoading(true)
    const promise = new Promise((resolve, reject) => {
      api.post('preference', data, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Created: ${response.data?.key}`, { position: "top-center", autoClose: 1000, })
        resolve(`Created: ${response.data?.key}`);
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
  }

  function deleteDataRowSetting(id: number) {
    setLoading(true)
    const promise = new Promise((resolve, reject) => {
      api.delete('preference', {
        params: {
          id,
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Deleted: ${response.data?.key}`, { position: "top-center", autoClose: 1000, })
        resolve(`Deleted: ${response.data?.key}`);
        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
  }

  return(
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <Helmet>
        <title>Users & Services</title>
      </Helmet>
      <h3 className="font-medium text-3xl md:text-5xl text-pinkBackground font-borsok">Settings</h3>
      { loading ? <div className="w-full flex justify-center"><Loading /> </div> :
        <>
        <div className="md:flex bg-white w-full mt-4 rounded">
          <DataTableCustom 
            headers={headers} 
            titleCreate="Add New User"
            data={users} 
            setData={(data) => setUsers(data)} 
            title="Users" 
            updateRow={(data) => updateDataRow(data)} 
            createData={columnHeaders}
            createRow={(data) => createNewRow(data)}
            deleteRow={(id) => deleteDataRow(id)}
          />
        </div>
          <div className="md:flex bg-white w-full mt-4 rounded">
            <DataTableCustom 
              titleCreate="Add New Setting"
              headers={headersSettings} 
              data={settings} 
              setData={(data) => setSettings(data)} 
              title="Settings" 
              updateRow={(data) => updateDataRowSetting(data)} 
              createData={columnHeadersSettings}
              createRow={(data) => createNewRowSetting(data)}
              deleteRow={(id) => deleteDataRowSetting(id)}
            />
          </div>
        </>
      }   
    </div>
  )
}