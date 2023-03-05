import { useState } from 'react'
import AsyncSelect from 'react-select/async';

interface SelectInputProps {
  getData?:(inputValue: string) => Promise<any>,
}

export function SelectInput({getData}:SelectInputProps) {
  const [selectedOption, setSelectedOption] = useState('')

  const handleChange = (selectedOption: any) => {
    console.log(selectedOption)
    setSelectedOption(selectedOption);
  };

  const promiseOptions = (inputValue: string) =>
    new Promise<any[]>((resolve, reject) => {
      console.log("get data")
      console.log(getData)
      console.log("select")
      console.log(inputValue)
      if(getData != undefined){
        console.log('execute')
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