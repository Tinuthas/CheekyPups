
import { ThemeProvider } from "@mui/material/styles";
import { theme, iconStyle } from "../../lib/theme";
import NextIcon from '@mui/icons-material/SkipNextRounded';
import PreviousIcon from '@mui/icons-material/SkipPreviousRounded';
import { ButtonLight } from "../ButtonLight";
import { ChooseDateButton } from "../ChooseDate";

interface FilterDateBookingProps {
  date: Date
  setDate: (value:Date) => void
  loading: boolean
  setLoading: (value:boolean) => void,
  onPreviousDate: () => void
  onNextDate:() => void
  addEventClick:() => void
}

export function FilterDateBooking({date, setDate, loading, setLoading, onPreviousDate, onNextDate, addEventClick}:FilterDateBookingProps) {

  return (
    <div className="md:flex justify-center items-center md: mt-4">
      <ThemeProvider theme={theme}>
        <div className="flex justify-center items-center bg-white rounded">
          <div className="border rounded-full border-pinkBackground mx-3" onClick={onPreviousDate}>
            <PreviousIcon sx={iconStyle}/>
          </div>
          <ChooseDateButton label={"Choose Date"} date={date} setDate={date => setDate(new Date(date))} />
          <div className="border rounded-full border-pinkBackground mx-3" onClick={onNextDate}>
            <NextIcon sx={iconStyle}/>
          </div>
        </div>
      </ThemeProvider>
      <ButtonLight text={"Event"} onClick={addEventClick} />
    </div>
  )
}