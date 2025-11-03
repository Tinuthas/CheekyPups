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

interface CreateNewAttendanceProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
}

export const CreateNewAttendance = ({
  open,
  onClose,
  onSubmit,
}: CreateNewAttendanceProps) => {

  const [paidField, setPaidField] = useState(false)
  const [dateValueField, setDateValueField] = useState(new Date());
  const [descriptionField, setDescriptionField] = useState(`DAYCARE - ${dayjs(dateValueField).format('DD/MM/YYYY')}`)
  const [valueListDogs, setValueListDogs] = useState<any>([])
  const [valueCheckbox, setValueCheckbox] = useState<{ second: boolean, third: boolean, fourth: boolean }>({ second: false, third: false, fourth: false })
  const [lengthDogs, setLengthDogs] = useState(0)

  const [firstDog, setFirstDog] = useState({id: 0, value: FULLDAY, typeDay: 'FD'})
  const [secondDog, setSecondDog] = useState({id: 0, value: SECONDDOG, typeDay: 'SD', element: null})
  const [thirdDog, setThirdDog] = useState({id: 0, value: SECONDDOG, typeDay: 'SD', element: null})
  const [fourthDog, setFourthDog] = useState({id: 0, value: SECONDDOG, typeDay: 'SD', element: null})
  const [valuePaidField, setValuePaidField] = useState("")


  function removeItemArrayDogs(listDogs: any, key: any, oldKey?:any) {
    
    if(oldKey!= undefined && oldKey != null) {
      listDogs.push(oldKey)
    }
    var index: number = listDogs.findIndex((i: any) => i.element.id === key.id);
    if (index > -1) {
      listDogs.splice(index, 1);
    }
    setValueListDogs(listDogs)
  }

  function setDateAndDescription(newDate: Date) {
    const newDescription = descriptionField.replace(dayjs(dateValueField).format('DD/MM/YYYY'), dayjs(newDate).format('DD/MM/YYYY'))
    setDescriptionField(newDescription)
    setDateValueField(newDate)
  }

  function selectRadioTypeValue(value: any) {
    
    if(value == 'FD') {
      return FULLDAY
    }else if(value == 'HD') {
      return HALFDAY
    }else if(value == 'FW') {
      return FULLWEEK
    }else if(value == 'SD') {
      return SECONDDOG
    }else {
      return 0
    }
  }

  function calculateValuePaid() {
    var paidValue = firstDog.value

    if(secondDog.id != 0) 
      paidValue = Number(paidValue)+ Number(secondDog.value)
    if(thirdDog.id != 0)
      paidValue = Number(paidValue)+ Number(thirdDog.value)
    if(fourthDog.id != 0)
      paidValue = Number(paidValue)+ Number(fourthDog.value)

    setValuePaidField(paidValue)
  }

  function cleanFields() {
    setFirstDog({id: 0, value: FULLDAY, typeDay: 'FD'})
    setSecondDog({id: 0, value: SECONDDOG, typeDay: 'SD', element: null})
    setThirdDog({id: 0, value: SECONDDOG, typeDay: 'SD', element: null})
    setFourthDog({id: 0, value: SECONDDOG, typeDay: 'SD', element: null})
    setPaidField(false)
    setValueCheckbox({ second: false, third: false, fourth: false })
    setValuePaidField(firstDog.value)
  }


  return (
    <>
      <CreateNewModal
        title="Adding Dog Day"
        columns={[
          {
            accessorKey: 'date',
            label: 'Date',
            name: '',
            type: "date",
            value: dateValueField,
            setValue: (value) => setDateAndDescription(value),
            gridXS: 12, gridMS: 5,
          },
          {
            accessorKey: 'firstDogId',
            label: 'Dog',
            name: 'Choose dog',
            type: "select",
            required: true,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              api.get('dogs/select', { params: { name: inputValue }, headers: { Authorization: getToken() } }).then(response => {
                var data = response.data
                var listData: any[] = []
                data.forEach((element: any) => {
                  listData.push({ value: element.id, label: `${element.name} ${element.nickname != null && element.nickname != "" ? ' - ' + element.nickname : ''} - ${element.Owner.name}`, element: element })
                });
                resolve(listData)
              }).catch((err: AxiosError) => {
                const data = err.response?.data as { message: string }
                toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
                throw new Error(`${data.message || err.response?.data || err.message}`);
              })
            }),
            setValue: (value: any) => {
              var dogs = value.element.Owner.dogs
              
              var listDogs: { value: any; label: string; element: any; }[] = []

              dogs.forEach((dog: any) => {
                listDogs.push({ value: dog.id, label: `${dog.name} - ${value.element.Owner.name}`, element: dog })
              });
              setLengthDogs(listDogs.length)
              setFirstDog({id: value.element.id, value: firstDog.value, typeDay: firstDog.typeDay})

              removeItemArrayDogs(listDogs, value.element)
            },
            gridXS: 12, gridMS: 7,
          },
          
          {
            accessorKey: 'firstDogTypeDay',
            label: 'Type Day',
            name: 'Type Day',
            type: "radio",
            value: firstDog.typeDay,
            radioListValues: [
              { key: "fullDay", value: "FD", label: "Full Day" },
              { key: "halfDay", value: "HD", label: "Half Day" },
              { key: "fullWeek", value: "FW", label: "Full Week" },
            ],
            setValue: (value) =>  {
              setFirstDog({typeDay: value, id: firstDog.id, value: selectRadioTypeValue(value)})
            },
            gridXS: 12, gridMS: 8,
            marginGridTop: '18px',
          },
          {
            accessorKey: 'firstDogValue',
            label: 'Sales',
            name: '',
            type: "number",
            value: firstDog.value,
            setValue: (value) => {
              setFirstDog({id: firstDog.id, value: value, typeDay: firstDog.typeDay})
           
            },
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'second',
            label: 'Second Dog',
            name: 'Second Dog',
            type: "checkbox",
            value: valueCheckbox.second,
            noShow: !(lengthDogs >= 2),
            setValue: (value) =>  {
              if(value)
                setSecondDog({id: 0, value: SECONDDOG, typeDay: 'SD', element: null})
              else
                setSecondDog({id: 0, value: 0, typeDay: '', element: null}) 
              setValueCheckbox({ second: value, third: valueCheckbox.third, fourth: valueCheckbox.fourth })
            },
            gridXS: 12, gridMS: 5,
            marginGridTop: '16px'
          },
          {
            accessorKey: 'secondDogId',
            label: 'Search Second Dog',
            name: 'Search Second Dog',
            type: "select",
            required: true,
            noShow: !valueCheckbox.second,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              resolve(valueListDogs)
            }),
            setValue: (value) => {
              removeItemArrayDogs(valueListDogs, value.element, secondDog.element)
              setSecondDog({id: value.element.id, value: secondDog.value, typeDay: secondDog.typeDay, element: value})
              
            },
            gridXS: 12, gridMS: 7,
          },
          {
            accessorKey: 'secondDogTypeDay',
            label: 'Type Day',
            name: 'Type Day',
            type: "radio",
            value: secondDog.typeDay,
            noShow: !valueCheckbox.second,
            radioListValues: [
              { key: "secondDog", value: "SD", label: "2nd Dog" },
              { key: "halfDay", value: "HD", label: "Half Day" },
              { key: "fullWeek", value: "FW", label: "2nd Full Week" },
            ],
            setValue: (value) => {
              setSecondDog({id: secondDog.id,value: selectRadioTypeValue(value), typeDay: value, element: secondDog.element })
       
            },
            gridXS: 12, gridMS: 8,
            marginGridTop: '18px',
          },
          {
            accessorKey: 'secondDogValue',
            label: 'Sales',
            name: '',
            type: "number",
            value: secondDog.value,
            noShow: !valueCheckbox.second,
            setValue: (value) =>  {
              setSecondDog({id: secondDog.id, value: value, typeDay: secondDog.typeDay, element: secondDog.element})
            
            },
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'third',
            label: 'Third Dog',
            name: 'Third Dog',
            type: "checkbox",
            value: valueCheckbox.third,
            noShow: !(lengthDogs >= 3),
            setValue: (value) => {
              if(value)
                setThirdDog({id: 0, value: SECONDDOG, typeDay: 'SD', element: null})
              else
                setThirdDog({id: 0, value: 0, typeDay: '', element: null}) 
              setValueCheckbox({ second: valueCheckbox.second, third: value, fourth: valueCheckbox.fourth })
            },
            gridXS: 12, gridMS: 5,
            marginGridTop: '16px'
          },
          {
            accessorKey: 'thirdDogId',
            label: 'Search Third Dog',
            name: 'Search Third Dog',
            type: "select",
            required: true,
            noShow: !valueCheckbox.third,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              resolve(valueListDogs)
            }),
            setValue: (value) => {
              removeItemArrayDogs(valueListDogs, value.element, thirdDog.element)
              setThirdDog({id: value.element.id, value: thirdDog.value, typeDay: thirdDog.typeDay , element: value})
             
             
            },
            gridXS: 12, gridMS: 7,
          },
          {
            accessorKey: 'thirdDogTypeDay',
            label: 'Type Day',
            name: 'Type Day',
            type: "radio",
            value: thirdDog.typeDay,
            noShow: !valueCheckbox.third,
            radioListValues: [
              { key: "secondDog", value: "SD", label: "2nd Dog" },
              { key: "halfDay", value: "HD", label: "Half Day" },
              { key: "fullWeek", value: "FW", label: "2nd Full Week" },
            ],
            setValue: (value) => {
              setThirdDog({ id: thirdDog.id, value: selectRadioTypeValue(value), typeDay: value, element: thirdDog.element })
             
            },
            gridXS: 12, gridMS: 8,
            marginGridTop: '18px',
          },
          {
            accessorKey: 'thirdDogValue',
            label: 'Sales',
            name: '',
            type: "number",
            value: thirdDog.value,
            noShow: !valueCheckbox.third,
            setValue: (value) => {
              setThirdDog({id: thirdDog.id, value: value, typeDay: thirdDog.typeDay, element: thirdDog.element})
             
            },
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'fourth',
            label: 'Fourth Dog',
            name: 'Fourth Dog',
            type: "checkbox",
            value: valueCheckbox.fourth,
            noShow: !(lengthDogs >= 3),
            setValue: (value) => {
              if(value)
                setFourthDog({id: 0, value: SECONDDOG, typeDay: 'SD', element: null})
              else
                setFourthDog({id: 0, value: 0, typeDay: '', element: null}) 
              setValueCheckbox({ second: valueCheckbox.second, third: valueCheckbox.third, fourth: value })
            },
            gridXS: 12, gridMS: 5,
            marginGridTop: '16px'
          },
          {
            accessorKey: 'fourthDogId',
            label: 'Search Fourth Dog',
            name: 'Search Fourth Dog',
            type: "select",
            required: true,
            noShow: !valueCheckbox.fourth,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              resolve(valueListDogs)
            }),
            setValue: (value) => {
              removeItemArrayDogs(valueListDogs, value.element, fourthDog.element)
              setFourthDog({id: value.element.id, value: fourthDog.value, typeDay: fourthDog.typeDay, element: value})
          
            },
            gridXS: 12, gridMS: 7,
          },
          {
            accessorKey: 'fourthDogTypeDay',
            label: 'Type Day',
            name: 'Type Day',
            type: "radio",
            value: fourthDog.typeDay,
            noShow: !valueCheckbox.fourth,
            radioListValues: [
              { key: "secondDog", value: "SD", label: "2nd Dog" },
              { key: "halfDay", value: "HD", label: "Half Day" },
              { key: "fullWeek", value: "FW", label: "2nd Full Week" },
            ],
            setValue: (value) => {
              setFourthDog({ id: fourthDog.id,value: selectRadioTypeValue(value), typeDay: value, element: fourthDog.element})
        
            },
            gridXS: 12, gridMS: 8,
            marginGridTop: '18px',
          },
          {
            accessorKey: 'fourthDogValue',
            label: 'Sales',
            name: '',
            type: "number",
            value: fourthDog.value,
            noShow: !valueCheckbox.fourth,
            setValue: (value) => {
              setFourthDog({id: fourthDog.id, value: value, typeDay: fourthDog.typeDay, element: fourthDog.element})
  
            },
            gridXS: 12, gridMS: 4,
          },
          {
            accessorKey: 'paid',
            label: 'Paid',
            name: 'Paid',
            type: "checkbox",
            value: paidField,
            setValue: (value) => setPaidField(value),
            gridXS: 12, gridMS: 4,
            marginGridTop: '16px'
          },
          {
            accessorKey: 'typePaid',
            label: 'Payment',
            name: 'Choose Payment Type',
            type: "select",
            noShow: !paidField,
            required: true,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              var listData: any[] = [{ value: 'CASH', label: 'Cash' }, { value: 'CARD', label: 'Card' }, { value: 'REV', label: 'Revolut' }]
              resolve(listData)
            }),
            setValue: (value) => {
              calculateValuePaid()
            },
            gridXS: 12, gridMS: 4,
          },

          {
            accessorKey: 'paidValue',
            label: 'Value Paid',
            name: '',
            type: "number",
            value: valuePaidField,
            noShow: !paidField,
            setValue: (value) => setValuePaidField(value),
            gridXS: 12, gridMS: 4
          },
          {
            accessorKey: 'descriptionValue',
            label: 'Description',
            name: '',
            type: "text",
            value: descriptionField,
            setValue: (value) => setDescriptionField(value),
            gridXS: 12, gridMS: 12,
          }]}
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