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
import { ButtonGroupList } from '../components/ButtonGroupList';
import { DialogListModal } from '../components/DialogListModal';

const hideColumns = { owner: true }

const selectPromise = (inputValue: string) => new Promise<any[]>((resolve, reject) => {
  api.get('owners/select', { params: { name: inputValue }, headers: { Authorization: getToken() } }).then(response => {
    var data = response.data
    var listData: any[] = []
    data.forEach((element: any) => {
      listData.push({ value: element.id, label: element.name })
    });
    resolve(listData)
  }).catch((err: AxiosError) => {
    const data = err.response?.data as { message: string }
    toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
    throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
  })
})


export function Dogs() {

  const [searchButton, setSearchButton] = useState('A')
  const [dogs, setDogs] = useState([{}])
  const [openAvatar, setOpenAvatar] = useState(false)
  const [loading, setLoading] = useState(false)
  const [dateBirthdayField, setDateBirthdayField] = useState(new Date())
  const [openIndex, setOpenIndex] = useState(-1)
  const [openListModal, setOpenListModal] = useState(false)
  const [ownerDogInfos, setOwnerDogInfos] = useState([{}])
  const [loadingModal, setLoadingModal] = useState(false)

  useEffect(() => {
    getAllDogs()
  }, [])

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
      setValue: (value: any) => setDateBirthdayField(value)
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
      name: 'Ex. Yorkie, Cockapoo',
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
    }).then(response => {
      var data = response.data
      var listData = JSON.parse(JSON.stringify(data));
      for (const i in listData) {
        listData[i].birthdayDate = dayjs(listData[i].birthdayDate).format('DD/MM/YYYY')
        delete listData[i].ownerId;
      }
      setDogs(listData)
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    })
  }

  function getAllDogsQuery(type: string) {
    setLoading(true)
    api.get('dogs/type', {
      params: {
        type: type
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      var data = response.data
      var listData = JSON.parse(JSON.stringify(data));
      for (const i in listData) {
        listData[i].birthdayDate = dayjs(listData[i].birthdayDate).format('DD/MM/YYYY')
        delete listData[i].ownerId;
      }
      setDogs(listData)
      setLoading(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    })
  }

  function callListOwnerDog(id: any): any {
    setLoadingModal(true)
    api.get('payment/extracts', {
      params: {
        id,
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      console.log('return call list extracts')
      setOwnerDogInfos(JSON.parse(JSON.stringify(response.data)))
      setLoadingModal(false)
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoadingModal(false)
    })
  }

  const headers: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'name',
      header: 'Name',
      size: 170,
      Cell: ({ renderedCellValue, row }) => (
        <>
          <div className="w-full cursor-pointer" onClick={() => {
            setOpenListModal(true)
            setOpenIndex(row.original.id)
          }}>
            <span>{renderedCellValue}</span>
          </div>
          {row.original.id == openIndex && openListModal ?
            <DialogListModal
              open={openListModal}
              onClose={() => setOpenListModal(false)}
              onSubmit={() => console.log('submit')}
              name={row.original.name}
              callInit={() => callListOwnerDog(row.original.id)}
              data={ownerDogInfos}
              setData={setOwnerDogInfos}
              headers={headersOwnerDog}
              loading={loadingModal}
              deleteRow={(id) => deleteDataRow(id)}
              updateRow={(data) => updateDataRow(data)}
              infoData={{ owner: row.original.name, dogs: "" }}
            />
            : null}
        </>
      )
    },
    {
      accessorKey: 'nickname',
      header: 'Nickname',
      size: 180,
    },
    {
      accessorKey: 'owner',
      header: 'Owner',
      enableEditing: false,
    },
    {
      accessorKey: 'birthdayDate',
      header: 'Birthday',
      size: 150
    },
    {
      accessorKey: 'gender',
      header: 'Gender',
      size: 130,
    },
    {
      accessorKey: 'colour',
      header: 'Colour',
      size: 130,
    },
    {
      accessorKey: 'breed',
      header: 'Breed',
      size: 150,
    }
  ]

  const headersOwnerDog: MRT_ColumnDef<any>[] = [
    {
      accessorKey: 'date',
      header: 'Date',
      size: 150,
      enableEditing: false,
    },
    {
      accessorKey: 'value',
      header: 'Value',
      size: 130,
      Cell: ({ renderedCellValue, row }) => (
        <>
          {Number(row.original.value) <= 0 ?
            <span className="text-red-600 font-medium">{renderedCellValue}</span>
            :
            <span className="text-green-600 font-medium">{renderedCellValue}</span>
          }
        </>
      )
    },
    {
      accessorKey: 'description',
      header: 'Description',
      size: 300,
    }
  ]



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
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
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
    delete Object.assign(newData, data, { ['owner_id']: Number(data['owner']) })['owner'];
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
        const data = err.response?.data as { message: string }
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
        const data = err.response?.data as { message: string }
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      })
    });
    return promise
  }

  function selectTypeOwner(value: any) {
    setSearchButton(value)
    if (value == null || value == 'A')
      getAllDogs()
    else
      getAllDogsQuery(value)
  }


  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h3 className="font-medium text-3xl md:text-4xl text-white font-borsok">Dogs</h3>
      {loading ? <div className="w-full flex justify-center"><Loading /> </div> :
        <>
          <div className="md:flex w-fit rounded m-1 bg-white">
            <ButtonGroupList listButtons={[{ key: "A", name: "All" }, { key: "D", name: "Daycare" }, { key: "G", name: "Grooming" }]} selectButton={(value) => selectTypeOwner(value)} selectedButton={searchButton} />
          </div>
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
        </>
      }
    </div>
  )
}

//        <DataTableCustom headers={["Name", "Birth Date", "Gender", "Colour", "Bread"]} onClick={(id) => onClickRowOwner(id)} data={dogs}/>
/**Cell: ({ renderedCellValue, row }) => (
        <>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem',}}> 
          {<span className="cursor-pointer" onClick={() => {
                setOpenAvatar(true)
                setOpenIndex(row.original.id)
          }}>
            <Avatar sx={{ width: 30, height: 30 }} src={row.original.avatarUrl} />
          </span>}
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
      )*/