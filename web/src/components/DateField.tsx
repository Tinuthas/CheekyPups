import { TextField, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { theme } from "../lib/theme";
import { useState } from "react";

interface DateFieldProps {
  value: Date;
  label: string;
  onChange: (value:any) => void;
}

export function DateField({value, label, onChange} : DateFieldProps) {
  
  return (
    <div className="h-12 mt-2">
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className="block w-full px-4 h-12 py-2  text-neutral-600 bg-white border-[1px] border-neutral-300 hover:border-neutral-400 rounded transition-all focus:outline-none focus:border-pinkBackground"
            //label={label}
            value={value || new Date()}
            onChange={(newValue) => {onChange(newValue)}}
            inputFormat="DD/MM/YYYY"
            renderInput={(params) => <TextField sx={{'& .MuiInputBase-root': {height: `48px`},'& .MuiInputBase-input': { color: '#525252', borderWidth: 1, paddingX: 2 }}} {...params} />}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  )
}