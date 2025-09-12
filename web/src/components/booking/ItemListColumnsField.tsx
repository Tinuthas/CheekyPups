
export function ItemListColumnsField() {

  return(
    <div key={"column_key_names"} className="h-12 w-[400px] md:w-full mt-4 border border-pinkBackground rounded text-neutral-800 flex flex-row self-center p-4 font-bold text-lg">
      <div className="self-center md:w-[60px]">
        <h5>Time</h5>
      </div>
      <div className="md:w-[90px] ml-2 md:ml-6 self-center">
        <h5>Owner</h5>
      </div>
      <div className="md:w-[100px] ml-2 md:ml-6 self-center">
        <h5>Phone</h5>
      </div>
      <div className="md:w-[90px] ml-2 md:ml-6 self-center">
        <h5>Dog</h5>
      </div>
      <div className="md:w-[90px] ml-2 md:ml-6 self-center">
        <h5>Bread</h5>
      </div>
    </div>
  )
}