import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { api, getToken } from "../../lib/axios";
import { AxiosError } from "axios";

const HALFDAY = import.meta.env.VITE_HALFDAY
const FULLDAY = import.meta.env.VITE_FULLDAY
const FULLWEEK = import.meta.env.VITE_FULLWEEK
const SECONDDOG = import.meta.env.VITE_SECONDDOG

interface CreateMergeOwnersProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
}

export const CreateMergeOwners = ({
  open,
  onClose,
  onSubmit,
}: CreateMergeOwnersProps) => {

  const [valueListOwners, setValueListOwners] = useState<any>([])
  const [lengthOwners, setLengthOwners] = useState(0)
  const [fromOwner, setFromOwner] = useState({id: 0})
  const [toOwner, setToOwner] = useState({id: 0})




  function removeItemArrayOwners(listDogs: Array<any>, key: any, oldKey?:any) {
    console.log(listDogs)
    if(oldKey!= undefined && oldKey != null) {
      listDogs.push(oldKey)
    }
    var index: number = listDogs.findIndex((i: any) => i.element.id === key.id);
    if (index > -1) {
      console.log('remove list')
      listDogs.splice(index, 1);
    }
    setValueListOwners(listDogs)
  }


  function cleanFields() {
    setFromOwner({id: 0})
    setToOwner({id: 0})
  }


  return (
    <>
      <CreateNewModal
        title="Merging Owners Info"
        columns={[
          {
            accessorKey: 'fromOwnerId',
            label: 'From Owner',
            name: 'Choose Owner',
            type: "select",
            required: true,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              api.get('owners/select', { params: { name: inputValue }, headers: { Authorization: getToken() } }).then(response => {
                var data = response.data
                var listData: any[] = []
                
                console.log(valueListOwners)
                data.forEach((element: any) => {
                  var search = valueListOwners.findIndex((i: any) => i.value === element.id)
                  console.log(search)
                  if(search == -1) {
                    listData.push({ value: element.id, label: `${element.name} - ${element.phoneOne} - ${element.type == null ? 'G' : element.type} - ${element.emailAddress != null ? element.emailAddress : ''}`, element: element })
                  }
                });

                resolve(listData)
              }).catch((err: AxiosError) => {
                const data = err.response?.data as { message: string }
                toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
                throw new Error(`${data.message || err.response?.data || err.message}`);
              })
            }),
            setValue: (value: any) => {
              var owner = value.element
              
              var list: { value: any; label: string; element: any; }[] = []

              
              list.push({ value: owner.id, label: `${owner.name} - ${owner.phoneOne}`, element: owner })
              
              setLengthOwners(list.length)
              setFromOwner({id: value.element.id})
              removeItemArrayOwners(list, value.element)
            },
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'toOwnerId',
            label: 'To Owner',
            name: 'Choose Owner',
            type: "select",
            required: true,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              api.get('owners/select', { params: { name: inputValue }, headers: { Authorization: getToken() } }).then(response => {
                var data = response.data
                var listData: any[] = []
                data.forEach((element: any) => {
                  var search = valueListOwners.find((e:any )=> e.id === element.id)
                  if(search == undefined) {
                    listData.push({ value: element.id, label: `${element.name} - ${element.phoneOne} - ${element.type == null ? 'G' : element.type} - ${element.emailAddress != null ? element.emailAddress : ''}`, element: element })
                  }
                });
                resolve(listData)
              }).catch((err: AxiosError) => {
                const data = err.response?.data as { message: string }
                toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
                throw new Error(`${data.message || err.response?.data || err.message}`);
              })
            }),
            setValue: (value: any) => {
              var owner = value.element
              var list: { value: any; label: string; element: any; }[] = []

              
              list.push({ value: owner.id, label: `${owner.name} - ${owner.phoneOne}`, element: owner })
              
              setLengthOwners(list.length)
              setFromOwner({id: value.element.id})
              removeItemArrayOwners(list, value.element)
            },
            gridXS: 12, gridMS: 12,
          },
          
          ]}
        open={open}
        onClose={() => {
          cleanFields()
          onClose()
        }}
        onSubmit={(values) => {
          onSubmit(values)
          cleanFields()
          }}
        grid={true}
      /> 
    </>
  )
}