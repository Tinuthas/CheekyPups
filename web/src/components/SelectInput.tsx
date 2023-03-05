import { useState } from 'react'
import AsyncSelect from 'react-select/async';

interface SelectInputProps {
  getData?:(inputValue: string) => Promise<any>,
  onChange(event: React.ChangeEvent<HTMLInputElement>):void;
}

export function SelectInput({getData, onChange}:SelectInputProps) {
  const [selectedOption, setSelectedOption] = useState<any>()

  const handleChange = (selectedOption: any) => {
    setSelectedOption(selectedOption);
  };

  const handleBlue = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.target.value = selectedOption.value
    event.target.placeholder = selectedOption.label
    onChange(event)
  }

  const promiseOptions = (inputValue: string) =>
    new Promise<any[]>((resolve, reject) => {
      if(getData != undefined){
        getData(inputValue).then((data) => {
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
      classNames={{ control: (state) => "block w-full h-12 mt-2 transition-all focus:outline-none",}}
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