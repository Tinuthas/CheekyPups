import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {api, getToken} from "../../lib/axios";
import { AxiosError } from "axios";

interface CreateExistedCustomerProps {
  onClose: () => void;
  onSubmit: (values:any) => void;
  open: boolean;
  listTimes: [{}]
}

export const CreateExistedCustomer = ({
  open,
  onClose,
  onSubmit,
  listTimes
}: CreateExistedCustomerProps) => {

  const [ownerName, setOwnerName] = useState("")
  const [phoneOwner, setPhoneOwner] = useState("")
  const [valueCheckbox, setValueCheckbox] = useState<{ second: boolean, third: boolean, fourth: boolean }>({ second: false, third: false, fourth: false })
  const [firstDog, setFirstDog] = useState<{ time: {} | null, name: string, breed: string, dogId:number }>({ time: null, name: "", breed: "", dogId: 0})
  const [secondDog, setSecondDog] = useState<{ time: {} | null, name: string, breed: string, dogId:number }>({ time: null, name: "", breed: "", dogId: 0 })
  const [thirdDog, setThirdDog] = useState<{ time: {} | null, name: string, breed: string, dogId:number }>({ time: null, name: "", breed: "", dogId: 0 })
  const [fourthDog, setFourthDog] = useState<{ time: {} | null, name: string, breed: string, dogId:number }>({ time: null, name: "", breed: "", dogId: 0 })
  const [fifthDog, setFifthDog] = useState<{ time: {} | null, name: string, breed: string, dogId:number }>({ time: null, name: "", breed: "", dogId: 0 })
  const [valueListTimes, setValueListTimes] = useState<[{}]>(listTimes)
  const [valueListDogs, setValueListDogs] = useState<any[]>([])
  const [typeOfferedField, setTypeOfferedField] = useState("confirmed")
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

  function removeItemArrayDogs(key: any) {
    var newList = valueListDogs
    console.log('remove item')
    console.log(newList)
    console.log(key)
    var index: number = newList.findIndex((i: any) => i.element.id === key.id);
    console.log('index')
    console.log(index)
    if (index > -1) {
      newList.splice(index, 1);
    }
    setValueListDogs(newList)
  }

  return (
    <>
      <CreateNewModal
        key={"ExistedCustomerKey"}
        columns={[
          {
            accessorKey: 'searchBooking',
            label: 'Search Owner/Phone/Dog',
            name: 'Search Owner/Phone/Dog',
            type: "select",
            required: true,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              api.get('booking/select', { params: { name: inputValue }, headers: { Authorization: getToken() } }).then(response => {
                var data = response.data
                var listData: any[] = []
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
              console.log('select value')
              console.log(value)
              setOwnerName(value.element.Owner.name)
              setPhoneOwner(value.element.Owner.phoneOne)
              setFirstDog({time: firstDog.time, name: value.element.name, breed: value.element.breed, dogId: value.element.id})
              var dogs = value.element.Owner.dogs
              console.log(dogs)
              dogs.forEach((dog:any) => {
                valueListDogs.push({value: dog.id, label: `${dog.name} - ${dog.breed}`, element: dog})
              });
              removeItemArrayDogs(value.element)
            },
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
            noEdit: true,
          },
          {
            accessorKey: 'phone',
            label: 'Phone',
            name: '',
            type: "text",
            value: phoneOwner,
            setValue: (value) => setPhoneOwner(value),
            gridXS: 12, gridMS: 6,
            noEdit: true,
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
              setFirstDog({ time: value, breed: firstDog.breed, name: firstDog.name, dogId: firstDog.dogId })
            },
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'firstDogId',
            label: '',
            name: '',
            type: "number",
            value: firstDog.dogId,
            noShow: true,
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'firstDogName',
            label: 'Dog Name',
            name: '',
            type: "text",
            value: firstDog.name,
            setValue: (value) => setFirstDog({ time: firstDog.time, breed: firstDog.breed, name: value, dogId: firstDog.dogId }),
            gridXS: 12, gridMS: 4,
            noEdit: true,
          },
          {
            accessorKey: 'firstDogBreed',
            label: 'Dog Breed',
            name: '',
            type: "text",
            value: firstDog.breed,
            setValue: (value) => setFirstDog({ time: firstDog.time, breed: value, name: firstDog.name, dogId: firstDog.dogId }),
            gridXS: 12, gridMS: 4,
            noEdit: true,
          },
          {
            accessorKey: 'second',
            label: 'Second Dog',
            name: 'Second Dog',
            type: "checkbox",
            value: valueCheckbox.second, 
            noShow: valueListDogs.length == 0,
            setValue: (value) => setValueCheckbox({ second: value, third: valueCheckbox.third, fourth: valueCheckbox.fourth }),
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'searchSecondDog',
            label: 'Search Second Dog',
            name: 'Search Second Dog',
            type: "select",
            required: true,
            noShow: !valueCheckbox.second || valueListDogs.length == 0,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              resolve(valueListDogs)
            }),
            setValue: (value) => {
              setSecondDog({time: secondDog.time, name: value.element.name, breed: value.element.breed, dogId: value.element.id})
              removeItemArrayDogs(value.element)
            },
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
              setSecondDog({ time: value, breed: secondDog.breed, name: secondDog.name, dogId: secondDog.dogId })
            },
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'secondDogId',
            label: '',
            name: '',
            type: "number",
            value: secondDog.dogId,
            noShow: true,
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'secondDogName',
            label: 'Dog Name',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second,
            value: secondDog.name,
            setValue: (value) => setSecondDog({ time: secondDog.time, breed: secondDog.breed, name: value, dogId: secondDog.dogId }),
            gridXS: 12, gridMS: 4,
            noEdit: true,
          },
          {
            accessorKey: 'secondDogBread',
            label: 'Dog Bread',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second,
            value: secondDog.breed,
            setValue: (value) => setSecondDog({ time: secondDog.time, breed: value, name: secondDog.name, dogId: secondDog.dogId }),
            gridXS: 12, gridMS: 4,
            noEdit: true,
          },
          {
            accessorKey: 'third',
            label: 'Third Dog',
            name: 'Third Dog',
            type: "checkbox",
            noShow: !valueCheckbox.second || valueListDogs.length == 0,
            value: valueCheckbox.third,
            setValue: (value) => setValueCheckbox({ second: valueCheckbox.second, third: value, fourth: valueCheckbox.fourth }),
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'searchThirdDog',
            label: 'Search Third Dog',
            name: 'Search Third Dog',
            type: "select",
            required: true,
            noShow: !valueCheckbox.second || !valueCheckbox.third || valueListDogs.length == 0,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              resolve(valueListDogs)
            }),
            setValue: (value) => {
              setThirdDog({time: thirdDog.time, name: value.element.name, breed: value.element.breed, dogId: value.element.id})
              removeItemArrayDogs(value.element)
            },
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
              setThirdDog({ time: value, breed: thirdDog.breed, name: thirdDog.name, dogId: thirdDog.dogId })
            },
            gridXS: 12, gridMS: 4,

          },
          {
            accessorKey: 'thirdDogId',
            label: '',
            name: '',
            type: "number",
            value: thirdDog.dogId,
            noShow: true,
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'thirdDogName',
            label: 'Dog Name',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second || !valueCheckbox.third,
            value: thirdDog.name,
            setValue: (value) => setThirdDog({ time: thirdDog.time, breed: thirdDog.breed, name: value, dogId: thirdDog.dogId }),
            gridXS: 12, gridMS: 4,
            noEdit: true,
          },
          {
            accessorKey: 'thirdDogBread',
            label: 'Dog Bread',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second || !valueCheckbox.third,
            value: thirdDog.breed,
            setValue: (value) => setThirdDog({ time: thirdDog.time, breed: value, name: thirdDog.name, dogId: thirdDog.dogId }),
            gridXS: 12, gridMS: 4,
            noEdit: true,
          }, {
            accessorKey: 'fourth',
            label: 'Fourth Dog',
            name: 'Fourth Dog',
            type: "checkbox",
            noShow: !valueCheckbox.second || !valueCheckbox.third || valueListDogs.length == 0,
            value: valueCheckbox.fourth,
            setValue: (value) => setValueCheckbox({ second: valueCheckbox.second, third: valueCheckbox.third, fourth: value }),
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'searchFourthDog',
            label: 'Search Fourth Dog',
            name: 'Search Fourth Dog',
            type: "select",
            required: true,
            noShow: !valueCheckbox.second || !valueCheckbox.third || !valueCheckbox.fourth || valueListDogs.length == 0,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              resolve(valueListDogs)
            }),
            setValue: (value) => {
              setFourthDog({time: fourthDog.time, name: value.element.name, breed: value.element.breed, dogId: value.element.id})
              removeItemArrayDogs(value.element)
            },
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
              setFourthDog({ time: value, breed: fourthDog.breed, name: fourthDog.name, dogId: fourthDog.dogId })
            },
            gridXS: 12, gridMS: 4,

          },
          {
            accessorKey: 'fourthDogId',
            label: '',
            name: '',
            type: "number",
            value: fourthDog.dogId,
            noShow: true,
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'fourthDogName',
            label: 'Dog Name',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second || !valueCheckbox.third || !valueCheckbox.fourth,
            value: fourthDog.name,
            setValue: (value) => setFourthDog({ time: fourthDog.time, breed: fourthDog.breed, name: value, dogId: fourthDog.dogId }),
            gridXS: 12, gridMS: 4,
            noEdit: true,
          },
          {
            accessorKey: 'fourthDogBread',
            label: 'Dog Bread',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second || !valueCheckbox.third || !valueCheckbox.fourth,
            value: fourthDog.breed,
            setValue: (value) => setFourthDog({ time: fourthDog.time, breed: value, name: fourthDog.name, dogId: fourthDog.dogId }),
            gridXS: 12, gridMS: 4,
            noEdit: true,
          },
          {
            accessorKey: 'typeOffered',
            label: 'Type Offering',
            name: 'Type Offering',
            type: "radio",
            value: typeOfferedField,
            radioListValues: [
              { key: "confirmed", value: "confirmed", label: "Confirmed" },
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