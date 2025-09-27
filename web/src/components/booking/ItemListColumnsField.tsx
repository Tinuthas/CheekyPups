
export function ItemListColumnsField() {

  return(
    <div key={"column_key_names"} className="h-12 w-fit mt-4 border border-neutral-800 rounded text-neutral-800 flex flex-row self-center p-4 font-bold text-lg">
      <div className="self-center w-[100px] ml-[10px]">
        <h5>Time</h5>
      </div>
      <div className="w-[120px] ml-2 md:ml-6 self-center text-center">
        <h5>Owner</h5>
      </div>
      <div className="w-[120px] ml-2 md:ml-6 self-center text-center">
        <h5>Phone</h5>
      </div>
      <div className="w-[120px] ml-2 md:ml-6 self-center text-center">
        <h5>Dog</h5>
      </div>
      <div className="w-[120px] ml-2 md:ml-6 self-center text-center">
        <h5>Bread</h5>
      </div>
      <div className="w-[80px] ml-2 md:ml-6 self-center text-center">
        <h5>Menu</h5>
      </div>
    </div>
  )
}