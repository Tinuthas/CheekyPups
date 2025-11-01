import { TextField, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import {DesktopTimePicker} from "@mui/x-date-pickers/DesktopTimePicker"
import { theme } from "../lib/theme";
import { useState } from "react";
import dayjs from "dayjs";

interface TimeFieldProps {
  value: Date;
  label: string;
  onChange: (value:any) => void;
}

export function TimeField({value, label, onChange} : TimeFieldProps) {
  
  return (
    <div className="h-10 mt-1">
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopTimePicker
            className="block w-full px-4 h-10 py-2  text-neutral-600 bg-white border-[1px] border-neutral-300 hover:border-neutral-400 rounded transition-all focus:outline-none focus:border-pinkBackground"
            //label={label}
            ampm={true}
            views={['hours', 'minutes']}
            value={value || new Date()}
            onChange={(newValue) => {onChange(newValue)}}
            inputFormat="HH:mm"
            renderInput={(params) => <TextField sx={{'& .MuiInputBase-root': {height: `40px`},'& .MuiInputBase-input': { color: '#525252', borderWidth: 1, paddingX: 2 }}} {...params} />}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  )
}