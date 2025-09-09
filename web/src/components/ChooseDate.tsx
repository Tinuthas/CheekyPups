
import { TextField } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";

interface ChooseDateButtonProps {
  label: String;
  date: Date;
  setDate: (date:Date) => void;
}

export function ChooseDateButton({label, date, setDate}: ChooseDateButtonProps) {

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker 
        value={date} 
        label={label}
        onChange={date => date!= null ?  setDate(date) : null} 
        inputFormat="DD/MM/YYYY"
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
    
  )
}