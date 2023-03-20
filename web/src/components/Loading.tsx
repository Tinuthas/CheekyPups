import ReactLoading from 'react-loading';

interface LoadingProps {
  pink?:boolean
}

export function Loading({pink}: LoadingProps) {



  return(
    <div className=' w-fit h-16 flex justify-center'>
       <ReactLoading type="spin" color={`${pink == undefined|| pink == false ? '#FFFFFF' : '#FF499E'} `} />
    </div>
   
  )
}