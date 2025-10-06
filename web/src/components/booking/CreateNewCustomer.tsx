import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";

interface CreateNewCustomerProps {
  onClose: () => void;
  onSubmit: (values:any) => void;
  open: boolean;
  listTimes: [{}]
}

export const CreateNewCustomer = ({
  open,
  onClose,
  onSubmit,
  listTimes
}: CreateNewCustomerProps) => {

  const [ownerName, setOwnerName] = useState("")
  const [phoneOwner, setPhoneOwner] = useState("")
  const [valueCheckbox, setValueCheckbox] = useState<{ second: boolean, third: boolean, fourth: boolean }>({ second: false, third: false, fourth: false })
  const [firstDog, setFirstDog] = useState<{ time: {}|null, name: string, breed: string }>({ time: null, name: "", breed: "" })
  const [secondDog, setSecondDog] = useState<{ time: {}|null, name: string, breed: string }>({ time: null, name: "", breed: "" })
  const [thirdDog, setThirdDog] = useState<{ time: {}|null, name: string, breed: string }>({ time: null, name: "", breed: "" })
  const [fourthDog, setFourthDog] = useState<{ time: {}|null, name: string, breed: string }>({ time: null, name: "", breed: "" })
  const [fifthDog, setFifthDog] = useState<{ time: {}|null, name: string, breed: string }>({ time: null, name: "", breed: "" })
  const [valueListTimes, setValueListTimes] = useState<[{}]>(listTimes)
  const [typeOfferedField, setTypeOfferedField] = useState("confirmed")
  const [notes, setNotes] = useState("")

  function removeItemArrayTimes(key:any, oldKey: any) {
      var newList = valueListTimes
      if(oldKey != null) {
        newList.push(oldKey)
      }
      var index: number = newList.findIndex((i:any) => i.id === key.id);
      console.log('index')
      console.log(index)
      if (index > -1) {
        newList.splice(index, 1);
      }
      newList.sort((a:any, b:any) => dayjs(a.value).toDate().getTime() - dayjs(b.value).toDate().getTime());
      setValueListTimes(newList)
  }

  return (
    <>
      <CreateNewModal
        key={"CreatingNewCustomer"}
        columns={[
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
            required: typeOfferedField.startsWith('c') ? true : false,
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
              setFirstDog({ time: value, breed: firstDog.breed, name: firstDog.name })},
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'firstDogName',
            label: 'Dog Name',
            name: '',
            type: "text",
            value: firstDog.name,
            setValue: (value) => setFirstDog({ time: firstDog.time, breed: firstDog.breed, name: value }),
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'firstDogBreed',
            label: 'Dog Breed',
            name: '',
            type: "text",
            value: firstDog.breed,
            setValue: (value) => setFirstDog({ time: firstDog.time, breed: value, name: firstDog.name }),
            gridXS: 12, gridMS: 4,
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
              setSecondDog({ time: value, breed: secondDog.breed, name: secondDog.name })},
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'secondDogName',
            label: 'Dog Name',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second,
            value: secondDog.name,
            setValue: (value) => setSecondDog({ time: secondDog.time, breed: secondDog.breed, name: value }),
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'secondDogBreed',
            label: 'Dog Breed',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second,
            value: secondDog.breed,
            setValue: (value) => setSecondDog({ time: secondDog.time, breed: value, name: secondDog.name }),
            gridXS: 12, gridMS: 4,
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
              setThirdDog({ time: value, breed: thirdDog.breed, name: thirdDog.name })},
            gridXS: 12, gridMS: 4,

          },
          {
            accessorKey: 'thirdDogName',
            label: 'Dog Name',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second || !valueCheckbox.third,
            value: thirdDog.name,
            setValue: (value) => setThirdDog({ time: thirdDog.time, breed: thirdDog.breed, name: value }),
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'thirdDogBreed',
            label: 'Dog Breed',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second || !valueCheckbox.third,
            value: thirdDog.breed,
            setValue: (value) => setThirdDog({ time: thirdDog.time, breed: value, name: thirdDog.name }),
            gridXS: 12, gridMS: 4,
          }, {
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
              setFourthDog({ time: value, breed: fourthDog.breed, name: fourthDog.name })},
            gridXS: 12, gridMS: 4,

          },
          {
            accessorKey: 'fourthDogName',
            label: 'Dog Name',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second || !valueCheckbox.third || !valueCheckbox.fourth,
            value: fourthDog.name,
            setValue: (value) => setFourthDog({ time: fourthDog.time, breed: fourthDog.breed, name: value }),
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'fourthDogBreed',
            label: 'Dog Breed',
            name: '',
            type: "text",
            noShow: !valueCheckbox.second || !valueCheckbox.third || !valueCheckbox.fourth,
            value: fourthDog.breed,
            setValue: (value) => setFourthDog({ time: fourthDog.time, breed: value, name: fourthDog.name }),
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'typeOffered',
            label: 'Type Offering',
            name: 'Type Offering',
            type: "radio",
            value: typeOfferedField,
            radioListValues: [
              {key: "confirmed", value: "confirmed", label: "Confirmed"},
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