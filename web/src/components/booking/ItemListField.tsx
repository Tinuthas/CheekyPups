
export interface ItemListFieldProps {
  id: Number
  time: String
  ownerName?: String
  phone?: String
  dogName?: String
  dogBread?: String
}

export function ItemListField({id, time, ownerName, phone, dogName, dogBread}:ItemListFieldProps) {

  return(
    <div className="h-20 w-[400px] md:w-full mt-4 border border-neutral-300 rounded text-neutral-800 flex flex-row self-center p-4 hover:border-neutral-800 md:text-lg" >
      <div className="self-center ">
        <h5>{time}</h5>
      </div>
      <div className="ml-[10px] md:ml-6 self-center">
        <h5>{ownerName}</h5>
      </div>
      <div className="ml-[10px] md:ml-6 self-center">
        <h5>{phone}</h5>
      </div>
      <div className="ml-[10px] md:ml-6 self-center">
        <h5>{dogName}</h5>
      </div>
      <div className="ml-[10px] md:ml-6 self-center">
        <h5>{dogBread}</h5>
      </div>
    </div>
  )
}