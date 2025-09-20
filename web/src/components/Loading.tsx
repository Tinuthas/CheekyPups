import ReactLoading from 'react-loading';

interface LoadingProps {
  pink?:boolean
}

export function Loading({pink}: LoadingProps) {



  return(
    <div className='w-full h-10 flex justify-center my-4'>
       <ReactLoading width={'36px'} type="spin" color={`${pink == undefined|| pink == false ? '#FFFFFF' : '#FF499E'} `} />
    </div>
   
  )
}