import { ButtonLight } from "../components/ButtonLight";

export function NewOwnerDog(){

  function createNewOwnerDog() {

  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h1 className="font-semibold text-3xl md:text-4xl text-white">New Owner</h1>
      <div className="md:flex bg-white w-full p-4 md:p-8 mt-4 rounded">
        <ButtonLight text="Create New Owner" onClick={createNewOwnerDog}/>
      </div>
    </div>
  )
}