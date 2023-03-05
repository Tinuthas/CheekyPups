import { useState } from 'react'
import AsyncSelect from 'react-select/async';

interface SelectInputProps {
  getData?:Promise<any>,
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
      if(getData != undefined){
        console.log('execute')
        getData.then((data) => {
          resolve(data)
        })
        /*getData().then(() => {
          console.log('result')
        }).catch(() => {
          console.log('error')
        })*/
      }
        
      
      

      /*setTimeout(() => {
        resolve([{ value: 'chocolate', label: 'Chocolate' },
        { value: 'strawberry', label: 'Strawberry' }, { value: 'name', label: 'Declan' }]);
      }, 1000);*/
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