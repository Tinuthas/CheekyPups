import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {api, getToken} from "../../lib/axios";
import { AxiosError } from "axios";

interface CreateNewOfferingProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  listTimes: [{}]
}

export const CreateNewOffering = ({
  open,
  onClose,
  onSubmit,
  listTimes
}: CreateNewOfferingProps) => {

  const [ownerId, setOwnerId] = useState("")
  const [ownerName, setOwnerName] = useState("")
  const [phoneOwner, setPhoneOwner] = useState("")
  const [valueCheckbox, setValueCheckbox] = useState<{ second: boolean, third: boolean, fourth: boolean }>({ second: false, third: false, fourth: false })
  const [firstDog, setFirstDog] = useState<{ time: {} | null }>({ time: null })
  const [secondDog, setSecondDog] = useState<{ time: {} | null }>({ time: null })
  const [thirdDog, setThirdDog] = useState<{ time: {} | null }>({ time: null })
  const [fourthDog, setFourthDog] = useState<{ time: {} | null }>({ time: null })
  const [valueListTimes, setValueListTimes] = useState<[{}]>(listTimes)
  const [typeOfferedField, setTypeOfferedField] = useState("offeredFB")
  const [notes, setNotes] = useState("")

  function removeItemArrayTimes(key: any, oldKey: any) {
    var newList = valueListTimes
    if (oldKey != null) {
      newList.push(oldKey)
    }
    var index: number = newList.findIndex((i: any) => i.id === key.id);
    console.log('index')
    console.log(index)
    if (index > -1) {
      newList.splice(index, 1);
    }
    newList.sort((a: any, b: any) => dayjs(a.value).toDate().getTime() - dayjs(b.value).toDate().getTime());
    setValueListTimes(newList)
  }

  return (
    <>
      <CreateNewModal
        key={"OfferingCreateModal"}
        columns={[
          {
            accessorKey: 'searchBooking',
            label: 'Search Owner/Phone/Dog',
            name: 'Search Owner/Phone/Dog',
            type: "select",
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              api.get('booking/select', { params: { name: inputValue }, headers: { Authorization: getToken() } }).then(response => {
                var data = response.data
                var listData: any[] = []
                listData.push({element: null, value: 0, label: `New Owner/Dog`})
                data.forEach((element: any) => {
                  listData.push({ element: element, value: element.id, label: `${element.Owner.name} - ${element.Owner.phoneOne} - ${element.name} - ${element.breed}` })
                });
                resolve(listData)
              }).catch((err: AxiosError) => {
                const data = err.response?.data as { message: string }
                toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
                throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
              })
            }),
            setValue: (value) => {
              console.log(value)
              if(value.element == null) {
                setOwnerName("")
                setPhoneOwner("")
                setOwnerId("")
              }else{
                setOwnerId(value.element.Owner.id)
                setOwnerName(value.element.Owner.name)
                setPhoneOwner(value.element.Owner.phoneOne)
              }
              setFirstDog({ time: firstDog.time })
            },
            gridXS: 12, gridMS: 12,
          },

          {
            accessorKey: 'ownerId',
            label: 'OwnerId',
            name: '',
            type: "text",
            value: ownerId,
            noShow: true,
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'owner',
            label: 'Owner',
            name: '',
            type: "text",
            value: ownerName,
            setValue: (value) => setOwnerName(value),
            gridXS: 12, gridMS: 6,
          },
          {
            accessorKey: 'phone',
            label: 'Phone',
            name: '',
            type: "text",
            value: phoneOwner,
            setValue: (value) => setPhoneOwner(value),
            gridXS: 12, gridMS: 6,
          },
          {
            accessorKey: 'firstDogTime',
            label: 'Time',
            name: 'Choose Time',
            type: "select",
            required: true,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              resolve(valueListTimes)
            }),
            setValue: (value) => {
              removeItemArrayTimes(value, firstDog.time)
              setFirstDog({ time: value })
            },
            gridXS: 12, gridMS: 6,
          },
          {
            accessorKey: 'second',
            label: 'Second Dog',
            name: 'Second Dog',
            type: "checkbox",
            value: valueCheckbox.second,
            setValue: (value) => setValueCheckbox({ second: value, third: valueCheckbox.third, fourth: valueCheckbox.fourth }),
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'secondDogTime',
            label: 'Time',
            name: 'Choose Time',
            type: "select",
            noShow: !valueCheckbox.second,
            required: true,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              resolve(valueListTimes)
            }),
            setValue: (value) => {
              removeItemArrayTimes(value, secondDog.time)
              setSecondDog({ time: value })
            },
            gridXS: 12, gridMS: 6,
          },
          {
            accessorKey: 'third',
            label: 'Third Dog',
            name: 'Third Dog',
            type: "checkbox",
            noShow: !valueCheckbox.second,
            value: valueCheckbox.third,
            setValue: (value) => setValueCheckbox({ second: valueCheckbox.second, third: value, fourth: valueCheckbox.fourth }),
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'thirdDogTime',
            label: 'Time',
            name: 'Choose Time',
            type: "select",
            noShow: !valueCheckbox.second || !valueCheckbox.third,
            required: true,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              resolve(valueListTimes)
            }),
            setValue: (value) => {
              removeItemArrayTimes(value, thirdDog.time)
              setThirdDog({ time: value })
            },
            gridXS: 12, gridMS: 6,

          },
          {
            accessorKey: 'fourth',
            label: 'Fourth Dog',
            name: 'Fourth Dog',
            type: "checkbox",
            noShow: !valueCheckbox.second || !valueCheckbox.third,
            value: valueCheckbox.fourth,
            setValue: (value) => setValueCheckbox({ second: valueCheckbox.second, third: valueCheckbox.third, fourth: value }),
            gridXS: 12, gridMS: 12,
          },

          {
            accessorKey: 'fourthDogTime',
            label: 'Time',
            name: 'Choose Time',
            type: "select",
            noShow: !valueCheckbox.second || !valueCheckbox.third || !valueCheckbox.fourth,
            required: true,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              resolve(valueListTimes)
            }),
            setValue: (value) => {
              removeItemArrayTimes(value, fourthDog.time)
              setFourthDog({ time: value })
            },
            gridXS: 12, gridMS: 6,

          },
          {
            accessorKey: 'typeOffered',
            label: 'Type Offering',
            name: 'Type Offering',
            type: "radio",
            value: typeOfferedField,
            radioListValues: [
              { key: "offeredFB", value: "offeredFB", label: "Meta" },
              { key: "offeredWA", value: "offeredWA", label: "WhatsApp" },
              { key: "offeredText", value: "offeredText", label: "Text" },
              { key: "offeredCall", value: "offeredCall", label: "Call" }
            ],
            setValue: (value) => setTypeOfferedField(value),
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'notes',
            label: 'Notes',
            name: '',
            type: "text",
            value: notes,
            setValue: (value) => setNotes(value),
            gridXS: 12, gridMS: 12,
          }]}
        open={open}
        onClose={() => onClose()}
        onSubmit={(values) => onSubmit(values)}
        grid={true}
      />
    </>
  )
}