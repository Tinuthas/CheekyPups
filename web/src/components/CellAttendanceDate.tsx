import { AxiosError } from "axios"
import { MRT_ColumnDef } from "material-react-table"
import MenuItemCustom from "./MenuItemCustom"
import {api, getToken} from "../lib/axios";
import { toast } from "react-toastify";
import { useState } from "react";

const HALFDAY = import.meta.env.VITE_HALFDAY
const FULLDAY = import.meta.env.VITE_FULLDAY
const FULLWEEK = import.meta.env.VITE_FULLWEEK
const SECONDDOG = import.meta.env.VITE_SECONDDOG


function convertToDate(dateString: string) {
  let d = dateString.split("/");
  return new Date(d[2] + '/' + d[1] + '/' + d[0]);
}


function getIdAttendance(item:any, row:any) {
  var listDates:string[] = row?.original?.dates
  var listIds:number[] = row?.original?.attendanceIds
  return listIds[listDates.indexOf(item)]
}

interface ReturnMenuItemCustomProps {
  renderedCellValue: any,
  row: any,
  item: string,
  onSubmit: () => Promise<boolean>
}

function ReturnMenuItemCustom({renderedCellValue, row, item, onSubmit} : ReturnMenuItemCustomProps) {

  const [valueField, setValueField] = useState(FULLDAY)
  const [valueDecriptionField, setValueDecriptionField] = useState("")
  const [typeDayField, setTypeDayField] = useState("FD");
  const [paidField, setPaidField] = useState(false);

  function getAttendance(id: number) {
    api.get('attendance/id', {
      params: {
        id,
      }, headers: {
          Authorization: getToken()
      }}).then(response => {
        var att = response.data
        console.log(att.typeDay)
        setValueField(Number(att.extract.value))
        setValueDecriptionField(att.extract.description)
        setPaidField(att.paid)
        setTypeDayField(att.typeDay)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      })
  }


function handleEdit(item:any, row:any, id:number) {
  try{
    var data = {
      typeDay: (typeDayField.toString().toUpperCase()), 
      paid: (paidField.toString().toLowerCase() === 'true'),
      value: Number(valueField), 
      descriptionValue: valueDecriptionField}
    console.log(data)
    api.put('attendance', data, {
      params: {
        id,
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      onSubmit().then((value) => {
        toast.success(`Attendance Updated`, { position: "top-center", autoClose: 1000, })
      }).catch((err: Error) => {
        toast.error(`Unidentified error: ${err.message}`, { position: "top-center", autoClose: 5000, })
      })
    }).catch((err: AxiosError) => {
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.response?.data ||err.message}`, { position: "top-center", autoClose: 5000, })
    })
  }catch(e) {
    toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
  }
}

function handlePaid(item:string, id:number) {
  try{
    console.log(item, id)
    api.put('attendance/pay', {descriptionValue: `DAYCARE - ${item}`},{
      params: {
        id,
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      onSubmit().then((value) => {
        toast.success(`Attendance Updated`, { position: "top-center", autoClose: 1000, })
      }).catch((err: Error) => {
        toast.error(`Unidentified error: ${err.message}`, { position: "top-center", autoClose: 5000, })
      })
    }).catch((err: AxiosError) => {
      console.log(err)
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.response?.data ||err.message}`, { position: "top-center", autoClose: 5000, })
    })
  }catch(e) {
    toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
  }
}

function handleDelete(id:number) {
  try{
    console.log(id)
    api.delete('attendance', {
      params: {
        id,
      },
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      onSubmit().then((value) => {
        toast.success(`Attendance Deleted`, { position: "top-center", autoClose: 1000, })
      }).catch((err: Error) => {
        toast.error(`Unidentified error: ${err.message}`, { position: "top-center", autoClose: 5000, })
      })
    }).catch((err: AxiosError) => {
      console.log(err)
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.response?.data ||err.message}`, { position: "top-center", autoClose: 5000, })
    })
  }catch(e) {
    toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
  }
}

function selectRadioTypeValue(value: string) {
  switch (value) {
    case 'FD': 
      setValueField(FULLDAY)
      break;
    case 'HD': 
      setValueField(HALFDAY)
      break;
    case 'FW': 
      setValueField(FULLWEEK)
      break;
    case 'SD': 
      setValueField(SECONDDOG)
      break;
  }
  setTypeDayField(value)
}

  return (
    <MenuItemCustom 
            handleDelete={(id) => handleDelete(id)} 
            handleEdit={(id) => handleEdit(item, row, id)}
            handlePaid={(id) => handlePaid(item, id)}
            id={getIdAttendance(item, row)}
            paid={renderedCellValue?.toString().toUpperCase().includes('P')}
            getAttendance={(id:number) => getAttendance(id)}
            editData={[
              {
                accessorKey: 'typeDay',
                  label: 'Type Day',
                  name: 'Type Day',
                  type: "radio",
                  value: typeDayField,
                  radioListValues: [
                    {key: "fullDay", value: "FD", label: "Full Day"},
                    {key: "halfDay", value: "HD", label: "Half Day"},
                    {key: "fullWeek", value: "FW", label: "Full Week"},
                    {key: "secondDog", value: "SD", label: "Second Dog"}
                  ],
                setValue: (value) => selectRadioTypeValue(value),
              },
              {
                accessorKey: 'value',
                label: 'Value',
                name: '',
                type: "number",
                value: valueField,
                setValue: (value) => setValueField(value),
              },
              {
                accessorKey: 'paid',
                label: 'Paid',
                name: 'Paid',
                type: "checkbox",
                value: paidField,
                setValue: (value) => setPaidField(value),
              },
              {
                accessorKey: 'descriptionValue',
                label: 'Description',
                name: '',
                type: "text",
                value: valueDecriptionField,
                setValue: (value) => setValueDecriptionField(value),
              }]}
          >
          { renderedCellValue?.toString().toUpperCase().includes('P') ?
            <span className="font-black text-green-600">{renderedCellValue.toString().toUpperCase().replace('P', '')}</span>
          : <span className="font-black text-stone-500">{renderedCellValue}</span>
          }
          </MenuItemCustom>
  )
}

export function cellComponent(item: string, onSubmit: () => Promise<boolean>, totalSumDays: number) {

  var column:MRT_ColumnDef<any> = {
    accessorKey: item, 
    header: item,
    Header: ({ column }) => <div className="w-[90px] p-0 text-center">{column.columnDef.header}</div>,
    Cell: ({ renderedCellValue, row }) => (
      <div className="w-[133.055px]">
        { renderedCellValue != null ?
          <ReturnMenuItemCustom 
            renderedCellValue={renderedCellValue} 
            row={row} 
            item={item} 
            onSubmit={onSubmit}/>
        : null}
      </div>
    ),
    Footer: ({  }) => <div className="w-[90px] text-center mr-[43.06px]">{totalSumDays}</div>
  }
  return column
}