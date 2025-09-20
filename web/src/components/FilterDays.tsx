import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { theme, iconStyle } from "../lib/theme";
import TextField from '@mui/material/TextField';
import { ButtonLight } from "../components/ButtonLight";
import { useState } from "react";
import dayjs from "dayjs";
import {Loading} from "./Loading";
import NextIcon from '@mui/icons-material/SkipNextRounded';
import PreviousIcon from '@mui/icons-material/SkipPreviousRounded';

interface FilterDaysProps {
  onSubmit: () => void;
  dateStart: Date;
  dateEnd: Date;
  setDateStart: (date:Date) => void;
  setDateEnd: (date:Date) => void;
  loading: boolean;
  onPreviousWeek: () => void
  onNextWeek: () => void
}

export function FilterDays({onSubmit, loading, dateEnd, dateStart, setDateEnd, setDateStart, onPreviousWeek, onNextWeek}: FilterDaysProps) {
  function addDays(date:Date, days:number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  return (
    <div className="md:flex bg-white p-4 md:p-8 mt-4 rounded">
        <div className="flex">
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            { loading ? <div className="ml-8"></div> :
              <div className="border rounded-full border-neutral-600 hover:border-pinkBackground mx-3 h-[36px] my-[10px] justify-center" onClick={onPreviousWeek}>
                <PreviousIcon sx={iconStyle}/>
              </div>
            }
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
                minDate={dateStart}
                maxDate={addDays(dateStart, 7)}
                inputFormat="DD/MM/YYYY"
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            { loading ? <div className="ml-8"></div> :
              <div className="border rounded-full border-neutral-600 hover:border-pinkBackground mx-3 h-[36px] my-[10px] justify-center" onClick={onNextWeek}>
                <NextIcon sx={iconStyle}/>
              </div>
            }
          </LocalizationProvider>
        </ThemeProvider>
        </div>
        { loading ? <div className="ml-8"><Loading pink={true}/></div> :
          <ButtonLight text="Search" onClick={() => onSubmit()}/>
        }
      </div>
  )
}