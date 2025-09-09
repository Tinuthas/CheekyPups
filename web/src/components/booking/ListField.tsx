import { CalendarPicker } from "@mui/x-date-pickers";
import { ButtonLight } from "../ButtonLight";
import { ChooseDateButton } from "../ChooseDate";


export function ListField ( ){

  function addEventClick() {

  }

  function chooseDate(date: Date | null) {

  }


  return (
    <div className="border-neutral-800">
      <div>
        <h3>8th September 2025</h3>
        <div>
          <ChooseDateButton label={"Choose Date"} date={new Date()} setDate={date => chooseDate(date)} />
          <ButtonLight text={"Add Event"} onClick={addEventClick} />
        </div>
        
      </div>
      <div>
        <div>
          List
        </div>
      </div>
      


    </div>
  )
}