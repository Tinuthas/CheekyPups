
interface InputLabelProps{
  labelName: string;
  value: string;
  placeholder: string;
  type: string;
  onChange(event: React.ChangeEvent<HTMLInputElement>):void;
}

export const InputLabel = ({labelName, value, type, placeholder, onChange}: InputLabelProps) => {
  return (
    <div className="mb-2 md:flex md:flex-row md:items-center xl:justify-between">
      <label htmlFor={type} className="block text-sm font-semibold text-neutral-800 md:w-[80px] xl:w-[120px]">
        {labelName}
      </label>
      <input
        placeholder={placeholder}
        onChange={onChange} type={type}
        className="block w-full px-4 py-2 mt-2 md:ml-6 text-neutral-600 bg-white border-[1px] border-neutral-700 rounded"
      />
    </div>
  )
}