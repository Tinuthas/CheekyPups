import { Avatar, Box } from '@mui/material';
import { AxiosError } from 'axios';
import dayjs from 'dayjs';
import { MRT_ColumnDef } from 'material-react-table';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { AvatarModal } from '../components/AvatarProfile';
import DataTableCustom from '../components/DataTableCustom';
import { Loading } from '../components/Loading';
import { api, getToken } from '../lib/axios';

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
    const data = err.response?.data as {message: string}
    toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
    throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
  })
})


export function Dogs(){

  const [dogs, setDogs] = useState([{}])
  const [openAvatar, setOpenAvatar] = useState(false)
  const [openIndex, setOpenIndex] = useState(-1);
  const [loading, setLoading] = useState(false)
  const [dateBirthdayField, setDateBirthdayField] = useState(new Date())

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
    accessorKey: 'nickname',
    label: 'Dog Nickname',
    name: 'Ex. Any',
    type: "text",
  },
  {
    accessorKey: 'birthdayDate',
    label: 'Birthday Date',
    name: '',
    type: "date",
    value: dateBirthdayField,
    setValue: (value:any) => setDateBirthdayField(value)
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

  function getAllDogs() {
    setLoading(true)
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
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false) 
    })
  }

  const headers:MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      Cell: ({ renderedCellValue, row }) => (
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem',}}> 
          <span className="cursor-pointer" onClick={() => {
                setOpenAvatar(true)
                setOpenIndex(row.original.id)
          }}>
            <Avatar sx={{ width: 30, height: 30 }} src={row.original.avatarUrl} />
          </span>
          <span>{renderedCellValue}</span>
        </Box>
          {row.original.id == openIndex && openAvatar ? 
            <AvatarModal 
              open={openAvatar}
              onClose={() => setOpenAvatar(false)}
              onSubmit={(value) => {
                getAllDogs()
                setOpenAvatar(false)
              }}
              nameFile={row.original.id+"_"+row.original.name.toLowerCase() ?? ""}
              avatarUrl={row.original.avatarUrl}
              name={row.original.name}
              id={Number(row.original.id)}
            />
            : null
          }
        </>
      )
    },
    {
      accessorKey: 'nickname',
      header: 'Nickname',
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      enableEditing: false,
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

  useEffect(() => {
    getAllDogs()
  }, [])

  function updateDataRow(data: any) {
    setLoading(true)
    const cloneData = JSON.parse(JSON.stringify(data))
    delete cloneData.owner;
    const promise = new Promise((resolve, reject) => {
      api.put('dogs', cloneData, {
        params: {
          id: (data as any).id
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Updated: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
        setLoading(false)
        resolve(`Updated: ${response.data?.name}`);
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data ||err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    })
    return promise
  }


  function createNewRow(data: any) {
    console.log(data)
    setLoading(true)
    var newData = {};
    delete Object.assign(newData, data, {['owner_id']: Number(data['owner']) })['owner'];
    console.log(newData)
    //return new Promise((resolve) => resolve('success'))
    const promise = new Promise((resolve, reject) => {
      api.post('dogs', newData, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Created: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
        setLoading(false)
        resolve(`Created: ${response.data?.name}`);
      }).catch((err: AxiosError) => {
        console.log(err)
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
      api.delete('dogs', {
        params: {
          id,
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Deleted: ${response.data?.name}`, { position: "top-center", autoClose: 1000, })
        setLoading(false)
        resolve(`Deleted: ${response.data?.name}`);
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
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
      <h1 className="font-medium text-3xl md:text-4xl text-white font-borsok">Dogs</h1>
      { loading ? <div className="w-full flex justify-center"><Loading /> </div> :
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
      }
    </div>
  )
}

//        <DataTableCustom headers={["Name", "Birth Date", "Gender", "Colour", "Bread"]} onClick={(id) => onClickRowOwner(id)} data={dogs}/>
