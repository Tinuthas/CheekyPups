import { toast } from "react-toastify"


export function About(){

  function onClickToast() {
    toast.success('test')
  }

  return (
    <div className="bg-pinkBackground w-full h-screen">
       <h1 onClick={onClickToast}>About</h1>
    </div>
  
  )
}