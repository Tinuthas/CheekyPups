import { effect } from "zod";


interface CurrencyFieldProps {
  value: number;
  label: string;
  onChange: (value:any) => void;
}


export function CurrencyField({value, label, onChange} : CurrencyFieldProps) {


  return (
    <div className="h-12 mt-2 relative">
      <div className="absolute inset-y-0 start-0 top-0 flex items-center ps-3.5 pointer-events-none ml-3">
            <span>€</span>
        </div>
      <input
        placeholder={label}
        onChange={onChange} type="number"
        value={value}
        onWheel={(e) => (e.target as HTMLElement).blur()}
        datatype="currency"
        className="block w-full h-12 px-6 py-2 mt-2 text-neutral-600 bg-white border-[1px] border-neutral-300 hover:border-neutral-400 rounded transition-all focus:outline-none focus:border-pinkBackground [-moz-appearance:_textfield] [&::-webkit-inner-spin-button]:m-0 [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:m-0 [&::-webkit-outer-spin-button]:appearance-none"
      />
    </div>
  )
}