import { SelectInput } from "./SelectInput";

interface InputLabelProps{
  labelName: string;
  placeholder: string;
  type: string;
  accessorKey: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>):void;
  getData?:Promise<any>;
}

export const InputLabel = ({labelName, type, placeholder, accessorKey, onChange, getData}: InputLabelProps) => {

  function setEventChange(event: React.ChangeEvent<HTMLInputElement>) {
    event.target.name = accessorKey
    onChange(event)
  }

  return (
    <div className="mb-2">
      <label htmlFor={type} className="block text-sm font-medium text-neutral-800">
        {labelName}
      </label>
      {
        type.includes('select') ?
          <SelectInput getData={getData}/>
        :
          <input
            placeholder={placeholder}
            onChange={setEventChange} autoFocus type={type}
            className="block w-full h-12 px-4 py-2 mt-2 text-neutral-600 bg-white border-[1px] border-neutral-300 hover:border-neutral-400 rounded transition-all focus:outline-none focus:border-pinkBackground"
          />
      }
      
    </div>
  )
}