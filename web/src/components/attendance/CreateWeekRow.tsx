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

interface CreateWeekRowProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
}

export const CreateWeekRow = ({
  open,
  onClose,
  onSubmit,
}: CreateWeekRowProps) => {

  const [valueCheckbox, setValueCheckbox] = useState<{ first:boolean, second: boolean, third: boolean, fourth: boolean, fifth: boolean }>({first:true, second: true, third: true, fourth: true, fifth: true })

  const [firstDay, setFirstDay] = useState({date: dayjs().isoWeekday(1).toDate(), value: FULLDAY, typeDay: 'FD'})
  const [secondDay, setSecondDay] = useState({date: dayjs().isoWeekday(2).toDate(), value: FULLDAY, typeDay: 'FD'})
  const [thirdDay, setThirdDay] = useState({date: dayjs().isoWeekday(3).toDate(), value: FULLDAY, typeDay: 'FD'})
  const [fourthDay, setFourthDay] = useState({date: dayjs().isoWeekday(4).toDate(), value: FULLDAY, typeDay: 'FD'})
  const [fifthDay, setFifthDay] = useState({date: dayjs().isoWeekday(5).toDate(), value: FULLWEEK, typeDay: 'FW'})
  const [paidField, setPaidField] = useState(false)
  const [valuePaidField, setValuePaidField] = useState("")
  const [descriptionField, setDescriptionField] = useState('')

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
    console.log('calc')
    var paidValue = 0
    if(firstDay.value != 0) 
      paidValue = Number(paidValue)+ Number(firstDay.value)
    if(secondDay.value != 0) 
      paidValue = Number(paidValue)+ Number(secondDay.value)
    console.log(paidValue)
    if(thirdDay.value != 0)
      paidValue = Number(paidValue)+ Number(thirdDay.value)
    console.log(paidValue)
    if(fourthDay.value != 0)
      paidValue = Number(paidValue)+ Number(fourthDay.value)
    if(fifthDay.value != 0)
      paidValue = Number(paidValue)+ Number(fifthDay.value)
    console.log(paidValue)

    setValuePaidField(String(paidValue))
  }

  function cleanFields() {
    setFirstDay({date: dayjs().isoWeekday(1).toDate(), value: FULLDAY, typeDay: 'FD'})
    setSecondDay({date: dayjs().isoWeekday(2).toDate(), value: FULLDAY, typeDay: 'FD'})
    setThirdDay({date: dayjs().isoWeekday(3).toDate(), value: FULLDAY, typeDay: 'FD'})
    setFourthDay({date: dayjs().isoWeekday(4).toDate(), value: FULLDAY, typeDay: 'FD'})
    setFifthDay({date: dayjs().isoWeekday(5).toDate(), value: FULLWEEK, typeDay: 'FW'})
    setPaidField(false)
    setValueCheckbox({first:true, second: true, third: true, fourth: true, fifth: true })

  }


  return (
    <>
      <CreateNewModal
        title="Adding Dog Week"
        key={"WeekRowCreateModal"}
        columns={[
          {
            accessorKey: 'dogId',
            label: 'Dog',
            name: 'Choose dog',
            type: "select",
            required: true,
            getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => {
              api.get('dogs/select', { params: { name: inputValue }, headers: { Authorization: getToken() } }).then(response => {
                var data = response.data
                var listData: any[] = []
                data.forEach((element: any) => {
                  listData.push({ value: element.id, label: `${element.name} ${element.nickname != null && element.nickname != "" ? '- ' + element.nickname : ''}- ${element.Owner.name}`, element: element })
                });
                resolve(listData)
              }).catch((err: AxiosError) => {
                const data = err.response?.data as { message: string }
                toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
                throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
              })
            }),
            gridXS: 12, gridMS: 12,
          },
          {
            accessorKey: 'first',
            label: '' + firstDay.date.toLocaleString(undefined, {weekday: "short"}),
            name: '',
            type: "checkbox",
            value: valueCheckbox.first,
            setValue: (value) => {
              if(value)
                setFirstDay({date: dayjs().isoWeekday(1).toDate(), value: FULLDAY, typeDay: 'FD'})
              else
                setFirstDay({date: dayjs().isoWeekday(1).toDate(), value: 0, typeDay: ''}) 
              setValueCheckbox({ first: value, second: valueCheckbox.second, third: valueCheckbox.third, fourth: valueCheckbox.fourth, fifth: valueCheckbox.fifth })
            },
            gridXS: 12, gridMS: valueCheckbox.first ? 1.5 : 12,
            marginGridTop: '18px'
          },
          {
            accessorKey: 'firstDayDate',
            label: 'Date: '+firstDay.date.toLocaleString(undefined, {weekday: "short"}),
            name: '',
            type: "date",
            noShow: !valueCheckbox.first,
            value: firstDay.date,
            setValue: (value) => setFirstDay({date: value, value: firstDay.value, typeDay: firstDay.typeDay}),
            gridXS: 12, gridMS: 3.5,
          },
          {
            accessorKey: 'firstDayValue',
            label: 'Sales',
            name: '',
            type: "number",
            noShow: !valueCheckbox.first,
            value: firstDay.value,
            setValue: (value) => {
              setFirstDay({date: firstDay.date, value: value, typeDay: firstDay.typeDay})
            },
            gridXS: 12, gridMS: 2,
          },
          {
            accessorKey: 'firstDayTypeDay',
            label: 'Type Day',
            name: 'Type Day',
            type: "radio",
            value: firstDay.typeDay,
            noShow: !valueCheckbox.first,
            radioListValues: [
              { key: "fullDay", value: "FD", label: "D" },
              { key: "halfDay", value: "HD", label: "D½" },
            ],
            setValue: (value) =>  {
              setFirstDay({date: firstDay.date, typeDay: value, value: selectRadioTypeValue(value)})
            },
            gridXS: 12, gridMS: 5,
            marginGridTop: '18px',
          },
          {
            accessorKey: 'second',
            label: '' + secondDay.date.toLocaleString(undefined, {weekday: "short"}),
            name: '',
            type: "checkbox",
            value: valueCheckbox.second,
            setValue: (value) => {
               if(value)
                setSecondDay({date: dayjs().isoWeekday(2).toDate(), value: FULLDAY, typeDay: 'FD'})
              else
                setSecondDay({date: dayjs().isoWeekday(2).toDate(), value: 0, typeDay: ''}) 

              setValueCheckbox({ first: valueCheckbox.first, second: value, third: valueCheckbox.third, fourth: valueCheckbox.fourth, fifth: valueCheckbox.fifth })
            },
            gridXS: 12, gridMS: valueCheckbox.second ? 1.5 : 12,
            marginGridTop: '18px'
          },
          {
            accessorKey: 'secondDayDate',
            label: 'Date: '+secondDay.date.toLocaleString(undefined, {weekday: "short"}),
            name: '',
            type: "date",
            noShow: !valueCheckbox.second,
            value: secondDay.date,
            setValue: (value) => setSecondDay({date: value, value: secondDay.value, typeDay: secondDay.typeDay}),
            gridXS: 12, gridMS: 3.5,
          },
          {
            accessorKey: 'secondDayValue',
            label: 'Sales',
            name: '',
            type: "number",
            noShow: !valueCheckbox.second,
            value: secondDay.value,
            setValue: (value) => {
              setSecondDay({date: secondDay.date, value: value, typeDay: secondDay.typeDay})
            },
            gridXS: 12, gridMS: 2,
          },
          {
            accessorKey: 'secondDayTypeDay',
            label: 'Type Day',
            name: 'Type Day',
            type: "radio",
            noShow: !valueCheckbox.second,
            value: secondDay.typeDay,
            radioListValues: [
              { key: "fullDay", value: "FD", label: "D" },
              { key: "halfDay", value: "HD", label: "D½" },
            ],
            setValue: (value) =>  {
              setSecondDay({date: secondDay.date, typeDay: value, value: selectRadioTypeValue(value)})
            },
            gridXS: 12, gridMS: 5,
            marginGridTop: '20px',
          },
          {
            accessorKey: 'third',
            label: '' + thirdDay.date.toLocaleString(undefined, {weekday: "short"}),
            name: '',
            type: "checkbox",
            value: valueCheckbox.third,
            setValue: (value) => {
              if(value)
                setThirdDay({date: dayjs().isoWeekday(3).toDate(), value: FULLDAY, typeDay: 'FD'})
              else
                setThirdDay({date: dayjs().isoWeekday(3).toDate(), value: 0, typeDay: ''}) 

              setValueCheckbox({ first: valueCheckbox.first, second: valueCheckbox.second, third: value, fourth: valueCheckbox.fourth, fifth: valueCheckbox.fifth })
            },
            gridXS: 12, gridMS: valueCheckbox.third ? 1.5 : 12,
            marginGridTop: '18px'
          },
          {
            accessorKey: 'thirdDayDate',
            label: 'Date: '+thirdDay.date.toLocaleString(undefined, {weekday: "short"}),
            name: '',
            type: "date",
            noShow: !valueCheckbox.third,
            value: thirdDay.date,
            setValue: (value) => setThirdDay({date: value, value: thirdDay.value, typeDay: thirdDay.typeDay}),
            gridXS: 12, gridMS: 3.5,
          },
          {
            accessorKey: 'thirdDayValue',
            label: 'Sales',
            name: '',
            type: "number",
            noShow: !valueCheckbox.third,
            value: thirdDay.value,
            setValue: (value) => {
              setThirdDay({date: thirdDay.date, value: value, typeDay: thirdDay.typeDay})
            },
            gridXS: 12, gridMS: 2,
          },
          {
            accessorKey: 'thirdDayTypeDay',
            label: 'Type Day',
            name: 'Type Day',
            type: "radio",
            noShow: !valueCheckbox.third,
            value: thirdDay.typeDay,
            radioListValues: [
              { key: "fullDay", value: "FD", label: "D" },
              { key: "halfDay", value: "HD", label: "D½" },
            ],
            setValue: (value) =>  {
              setThirdDay({date: thirdDay.date, typeDay: value, value: selectRadioTypeValue(value)})
            },
            gridXS: 12, gridMS: 5,
            marginGridTop: '20px',
          },
          {
            accessorKey: 'fourth',
            label: '' + fourthDay.date.toLocaleString(undefined, {weekday: "short"}),
            name: '',
            type: "checkbox",
            value: valueCheckbox.fourth,
            setValue: (value) => {
              if(value)
                setFourthDay({date: dayjs().isoWeekday(2).toDate(), value: FULLDAY, typeDay: 'FD'})
              else
                setFourthDay({date: dayjs().isoWeekday(2).toDate(), value: 0, typeDay: ''}) 

              setValueCheckbox({ first: valueCheckbox.first, second: valueCheckbox.second, third: valueCheckbox.third, fourth: value, fifth: valueCheckbox.fifth })
            },
            gridXS: 12, gridMS: valueCheckbox.fourth ? 1.5 : 12,
            marginGridTop: '18px'
          },
          {
            accessorKey: 'fourthDayDate',
            label: 'Date: '+fourthDay.date.toLocaleString(undefined, {weekday: "short"}),
            name: '',
            type: "date",
            noShow: !valueCheckbox.fourth,
            value: fourthDay.date,
            setValue: (value) => setFourthDay({date: value, value: fourthDay.value, typeDay: fourthDay.typeDay}),
            gridXS: 12, gridMS: 3.5,
          },
          {
            accessorKey: 'fourthDayValue',
            label: 'Sales',
            name: '',
            type: "number",
            noShow: !valueCheckbox.fourth,
            value: fourthDay.value,
            setValue: (value) => {
              setFourthDay({date: fourthDay.date, value: value, typeDay: fourthDay.typeDay})
            },
            gridXS: 12, gridMS: 2,
          },
          {
            accessorKey: 'fourthDayTypeDay',
            label: 'Type Day',
            name: 'Type Day',
            type: "radio",
            noShow: !valueCheckbox.fourth,
            value: fourthDay.typeDay,
            radioListValues: [
              { key: "fullDay", value: "FD", label: "D" },
              { key: "halfDay", value: "HD", label: "D½" },
            ],
            setValue: (value) =>  {
              setFourthDay({date: fourthDay.date, typeDay: value, value: selectRadioTypeValue(value)})
            },
            gridXS: 12, gridMS: 5,
            marginGridTop: '20px',
          },
          {
            accessorKey: 'fifth',
            label: '' + fifthDay.date.toLocaleString(undefined, {weekday: "short"}),
            name: '',
            type: "checkbox",
            value: valueCheckbox.fifth,
            setValue: (value) => {
              if(value)
                setFifthDay({date: dayjs().isoWeekday(5).toDate(), value: FULLWEEK, typeDay: 'FW'})
              else
                setFifthDay({date: dayjs().isoWeekday(5).toDate(), value: 0, typeDay: ''}) 

              setValueCheckbox({ first: valueCheckbox.first, second: valueCheckbox.second, third: valueCheckbox.third, fourth: valueCheckbox.fourth, fifth: value })
            },
            gridXS: 12, gridMS: valueCheckbox.fifth ? 1.5 : 12,
            marginGridTop: '18px'
          },
          {
            accessorKey: 'fifthDayDate',
            label: 'Date: '+fifthDay.date.toLocaleString(undefined, {weekday: "short"}),
            name: '',
            type: "date",
            noShow: !valueCheckbox.fifth,
            value: fifthDay.date,
            setValue: (value) => setFifthDay({date: value, value: fifthDay.value, typeDay: fifthDay.typeDay}),
            gridXS: 12, gridMS: 3.5,
          },
          {
            accessorKey: 'fifthDayValue',
            label: 'Sales',
            name: '',
            type: "number",
            noShow: !valueCheckbox.fifth,
            value: fifthDay.value,
            setValue: (value) => {
              setFifthDay({date: fifthDay.date, value: value, typeDay: fifthDay.typeDay})
            },
            gridXS: 12, gridMS: 2,
          },
          {
            accessorKey: 'fifthDayTypeDay',
            label: 'Type Day',
            name: 'Type Day',
            type: "radio",
            noShow: !valueCheckbox.fifth,
            value: fifthDay.typeDay,
            radioListValues: [
              { key: "fullDay", value: "FD", label: "D" },
              { key: "halfDay", value: "HD", label: "D½" },
              { key: "fullWeek", value: "FW", label: "Full Week" },
            ],
            setValue: (value) =>  {
              setFifthDay({date: fifthDay.date, typeDay: value, value: selectRadioTypeValue(value)})
            },
            gridXS: 12, gridMS: 5,
            marginGridTop: '24px',
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
          },
          {
            accessorKey: 'firstDayDescription',
            label: '',
            name: '',
            type: "text",
            value: `DAYCARE - ${dayjs(firstDay.date).format('DD/MM/YYYY')} ${descriptionField}`.trimEnd(),
            noEdit: true,
            noShow: true,
          },
          {
            accessorKey: 'secondDayDescription',
            label: '',
            name: '',
            type: "text",
            value: `DAYCARE - ${dayjs(secondDay.date).format('DD/MM/YYYY')} ${descriptionField}`.trimEnd(),
            noEdit: true,
            noShow: true,
          },
          {
            accessorKey: 'thirdDayDescription',
            label: '',
            name: '',
            type: "text",
            value: `DAYCARE - ${dayjs(thirdDay.date).format('DD/MM/YYYY')} ${descriptionField}`.trimEnd(),
            noEdit: true,
            noShow: true,
          },
          {
            accessorKey: 'fourthDayDescription',
            label: '',
            name: '',
            type: "text",
            value: `DAYCARE - ${dayjs(fourthDay.date).format('DD/MM/YYYY')} ${descriptionField}`.trimEnd(),
            noEdit: true,
            noShow: true,
          },
          {
            accessorKey: 'fifthDayDescription',
            label: '',
            name: '',
            type: "text",
            value: `DAYCARE - ${dayjs(fifthDay.date).format('DD/MM/YYYY')} ${descriptionField}`.trimEnd(),
            noEdit: true,
            noShow: true,
          }
        ]}
        open={open}
        onClose={() => {
          cleanFields()
          onClose()}
        }
        onSubmit={(values) => onSubmit(values)}
        grid={true}
      />
    </>
  )
}