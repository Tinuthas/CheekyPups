import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { theme } from "../lib/theme";
import TextField from '@mui/material/TextField';
import { ButtonLight } from "../components/ButtonLight";
import { useState } from "react";
import dayjs from "dayjs";

interface FilterDaysProps {
  onSubmit: (dateStart: Date, dateEnd: Date) => void;
}

export function FilterDays({onSubmit}: FilterDaysProps) {

  const [dateStart, setDateStart] = useState(dayjs().startOf('week').toDate());
  const [dateEnd, setDateEnd] = useState(dayjs().endOf('week').toDate());

  return (
    <div className="md:flex bg-white p-4 md:p-8 mt-4 rounded">
        <div className="flex">
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="mr-2 md:mr-6">
              <DatePicker
                label="Date Start"
                value={dateStart}
                onChange={(newValue) => {
                  setDateStart(newValue || new Date());
                }}
                inputFormat="DD/MM/YYYY"
                renderInput={(params) => <TextField {...params} 
                />
              }
              />
            </div>
            <div className="">
              <DatePicker
                label="Date End"
                value={dateEnd}
                onChange={(newValue) => {
                  setDateEnd(newValue || new Date());
                }}
                inputFormat="DD/MM/YYYY"
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
          </LocalizationProvider>
        </ThemeProvider>
        </div>
        <ButtonLight text="Search" onClick={() => onSubmit(dateStart, dateEnd)}/>
      </div>
  )
}