import { useState } from 'react'
import AsyncSelect from 'react-select/async';

interface SelectInputProps {
  getData?:(inputValue: string) => Promise<any>,
  onChangeSelect(value:any):void;
  inputValue?:string
}

export function SelectInput({getData, onChangeSelect, inputValue}:SelectInputProps) {
  const [selectedOption, setSelectedOption] = useState<any>()
  const [input, setInput] = useState(inputValue)

  const handleChange = (selectedOption: any) => {
    //setInput(selectedOption)
    setSelectedOption(selectedOption.label);
    onChangeSelect(selectedOption)
  };

  const handleBlue = (event: React.ChangeEvent<HTMLInputElement>) => {
    if(selectedOption == undefined || selectedOption.value == "") return

    event.target.value = selectedOption.value
    event.target.placeholder = selectedOption.label
    //onChange(event)
  }

  const promiseOptions = (inputValue: string) =>
    new Promise<any[]>((resolve, reject) => {
      if(getData != undefined){
        getData(inputValue).then((data) => {
          setInput(inputValue)
          resolve(data)
        })
      }
        

  });


  return(
    <AsyncSelect 
      cacheOptions 
      defaultOptions 
      loadOptions={promiseOptions}
      onChange={handleChange}
      onBlur={handleBlue}
      inputValue={input}
      //value={input}
      
      onInputChange={(value) => setInput(value)}
      styles={{ menuPortal: base => ({ ...base, color: '#525252' , zIndex: 9999 }) }}
              menuPortalTarget={document.body} 
      classNames={{ control: (state) => "flex w-full h-10 mt-1 transition-all focus:outline-none overflow-auto",}}
      theme={(theme) => ({
        ...theme,
        borderRadius: 4,
        colors: {
          ...theme.colors,
          primary50: 'white',
          primary25: 'white',
          primary: '#FF499E',
        },
      })}
    /> 
  )
}