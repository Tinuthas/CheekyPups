import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { theme, iconStyle } from "../lib/theme";
import TextField from '@mui/material/TextField';
import { ButtonLight } from "../components/ButtonLight";
import { useState } from "react";
import dayjs from "dayjs";
import { Loading } from "./Loading";
import NextIcon from '@mui/icons-material/SkipNextRounded';
import PreviousIcon from '@mui/icons-material/SkipPreviousRounded';
import SearchIcon from '@mui/icons-material/Search';

interface FilterDaysProps {
  onSubmit: () => void;
  dateStart: Date;
  dateEnd: Date;
  setDateStart: (date: Date) => void;
  setDateEnd: (date: Date) => void;
  loading: boolean;
  onPreviousWeek: () => void
  onNextWeek: () => void
}

export function FilterDays({ onSubmit, loading, dateEnd, dateStart, setDateEnd, setDateStart, onPreviousWeek, onNextWeek }: FilterDaysProps) {
  function addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  return (
    <div className="md:flex bg-white p-4 md:p-4 mt-4 rounded-3xl">
      <div className="flex">
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            {loading ? <div className="ml-8"></div> :
              <div className="border-2 rounded-full border-neutral-500 hover:border-pinkBackground mx-3 my-[10px] justify-center" onClick={onPreviousWeek}>
                <PreviousIcon sx={iconStyle} />
              </div>
            }
            <div className="mr-2 md:mr-6 mt-2">
              <DatePicker
                label="Start Date"
                value={dateStart}
                onChange={(newValue) => {
                  setDateStart(newValue || new Date());
                }}
                className="border-neutral-500 hover:border-pinkBackground "
                inputFormat="DD/MM/YYYY"
                renderInput={(params) => <TextField {...params}
                  sx={{
                    "& .MuiInputBase-input": {
                      height: "10px" // Set your height here.
                    }, '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#737373',
                      },
                      '&:hover fieldset': {
                        borderColor: '#f02a77',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#f02a77',
                      },
                    },
                  }} />
                }
              />
            </div>
            <div className="mt-2">
              <DatePicker
                label="End Date"
                value={dateEnd}
                onChange={(newValue) => {
                  setDateEnd(newValue || new Date());
                }}
                minDate={dateStart}
                maxDate={addDays(dateStart, 7)}
                inputFormat="DD/MM/YYYY"
                renderInput={(params) => <TextField {...params} sx={{
                  "& .MuiInputBase-input": {
                    height: "10px" // Set your height here.
                  }, '& .MuiOutlinedInput-root': {
                    '& fieldset': {
                      borderColor: '#737373',
                    },
                    '&:hover fieldset': {
                      borderColor: '#f02a77',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#f02a77',
                    },
                  },
                }} />}
              />
            </div>
            {loading ? <div className="ml-8"></div> :
              <div className="border-2 rounded-full border-neutral-500 hover:border-pinkBackground mx-3 my-[10px] justify-center" onClick={onNextWeek}>
                <NextIcon sx={iconStyle} />
              </div>
            }
          </LocalizationProvider>
        </ThemeProvider>
      </div>
      {loading ? <div className=" h-12 mb-1"><Loading pink={true} /></div> :
        <ButtonLight text="Search" onClick={() => onSubmit()} style=" w-full md:w-auto px-6 h-[59px]"/>
      }
    </div>
  )
}
/*<div className="border-2 rounded-full border-neutral-500 hover:border-pinkBackground my-[10px] justify-center">
          <SearchIcon fontSize="large" sx={iconStyle}/>
        </div>*/
//<ButtonLight text="Search" onClick={() => onSubmit()} />