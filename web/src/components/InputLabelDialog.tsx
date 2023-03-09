import { SelectInput } from "./SelectInput";
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import { useState } from "react";
import { boolean } from "zod";

interface InputLabelProps{
  labelName: string;
  placeholder: string;
  type: string;
  accessorKey: string;
  value?: any;
  setValue?(value:any):void;
  onChange(event: React.ChangeEvent<HTMLInputElement>):void;
  onSelect?(key: any, value:any):void;
  getData?:(inputValue: string) => Promise<any>;
  setLocalStatus?(status:boolean):void;
}

export const InputLabel = ({labelName, type, placeholder, accessorKey, value, setValue, onChange, onSelect, getData, setLocalStatus}: InputLabelProps) => {

  const [status, setStatus] = useState(false)

  function setEventChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.name = accessorKey
    if(type == "checkbox"){ 
      var checked = event.target.checked
      if(setLocalStatus != undefined){
        setLocalStatus(checked)
        setStatus(checked)
      }
        
      console.log(checked)
      event.target.value = checked.toString()
    }
    
    if(value != null && setValue != undefined){
      setValue(event.target.value)
    }
    if(type == "select"){
      if(onSelect != undefined)
        onSelect(accessorKey.toLowerCase().replace('id', ''), event.target.placeholder)
    }
      
    onChange(event)
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
          <SelectInput getData={getData} onChange={setEventChange}/>
        : type.includes('checkbox') ?
          <FormControlLabel control={<Checkbox onChange={setEventChange} sx={{ color: '#FF499E', '& .MuiSvgIcon-root': { fontSize: 28 } }} />}  label={status ? placeholder : labelName} />
        :
          <input
            placeholder={placeholder}
            onChange={setEventChange} autoFocus type={type}
            value={value}
            className="block w-full h-12 px-4 py-2 mt-2 text-neutral-600 bg-white border-[1px] border-neutral-300 hover:border-neutral-400 rounded transition-all focus:outline-none focus:border-pinkBackground"
          />
      }
      
    </div>
  )
}