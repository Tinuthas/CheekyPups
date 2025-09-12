
import { TextField, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { theme } from "../lib/theme";
import dayjs from "dayjs";

interface ChooseDateButtonProps {
  label: String;
  date: Date;
  setDate: (date:Date) => void;
}

export function ChooseDateButton({label, date, setDate}: ChooseDateButtonProps) {

  return (
    <div className="">
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker 
            className=""
            value={date} 
            //label={label}
            onChange={date => date!= null ?  setDate(date) : null} 
            inputFormat="DD/MM/YYYY"
            renderInput={(params) => <TextField {...params} className="w-full"/>}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
    
  )
}