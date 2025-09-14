import { SelectInput } from "./SelectInput";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState } from "react";
import { boolean } from "zod";
import { DateField } from "./DateField";
import { TimeField } from "./TimeField";

interface InputLabelProps{
  labelName: string;
  placeholder: string;
  type: string;
  accessorKey: string;
  value?: any;
  setValue?(value:any):void;
  onChange(event: React.ChangeEvent<HTMLInputElement>):void;
  onChangeValue(key:any, value: any):void;
  onSelect?(key: any, value:any):void;
  getData?:(inputValue: string) => Promise<any>;
  setLocalStatus?(status:boolean):void;
}

export const InputLabel = ({labelName, type, placeholder, accessorKey, value, setValue, onChange, onChangeValue, onSelect, getData, setLocalStatus}: InputLabelProps) => {

  const [status, setStatus] = useState(false)

  function setEventChange(event: React.ChangeEvent<HTMLInputElement>) {
    console.log(accessorKey)
   
    event.target.name = accessorKey
    if(type == "checkbox"){ 
      var checked = event.target.checked
      if(setLocalStatus != undefined){
        setLocalStatus(checked)
        setStatus(checked)
      }
      event.target.value = checked.toString()
      if(setValue != undefined)
        setValue(checked)
    }else if(value != null && setValue != undefined){
      setValue(event.target.value)
    }

    console.log(event.target.value)
    /*if(type == "select"){
      if(onSelect != undefined)
        onSelect(accessorKey.toLowerCase().replace('id', ''), event.target.placeholder)
    }*/
      
    onChange(event)
  }

  function handleOnChangeValue(valueField: any) {
    if(type == "select"){
      if(onSelect != undefined)
        onSelect(accessorKey.toLowerCase().replace('id', ''), valueField.label)
      onChangeValue(accessorKey, valueField.value.toString())
    }else if(type == "date" || type == "time") {
      var date = new Date(valueField)
      if(setValue != undefined)
        setValue(date)
      onChangeValue(accessorKey, date)
    }
    
   
  }

  return (
    <div className="mb-2">
      {type.includes('checkbox') ? null :
        <label htmlFor={type} className="block text-sm font-medium text-neutral-800">
          {labelName}
        </label>
      }
      {
        type.includes('select') ?
          <SelectInput getData={getData} onChangeSelect={handleOnChangeValue}/>
        : type.includes('checkbox') ? 
          <FormControlLabel control={<Checkbox onChange={setEventChange} sx={{ color: '#FF499E', '& .MuiSvgIcon-root': { fontSize: 28 } }} checked={value}  />}  label={status ? placeholder : labelName}  />
        : type.includes('date') ?
          <DateField label={labelName} value={value} onChange={handleOnChangeValue} />
        : type.includes('time') ?
          <TimeField label={labelName} value={value} onChange={handleOnChangeValue} />
        :
          <input
            placeholder={placeholder}
            onChange={setEventChange} type={type}
            value={value}
            className="block w-full h-12 px-4 py-2 mt-2 text-neutral-600 bg-white border-[1px] border-neutral-300 hover:border-neutral-400 rounded transition-all focus:outline-none focus:border-pinkBackground"
          />
      }
      
    </div>
  )
}