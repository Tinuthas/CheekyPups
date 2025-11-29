import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { theme, iconStyle } from "../../lib/theme";
import TextField from '@mui/material/TextField';
import { ButtonLight } from "../../components/ButtonLight";
import { useState } from "react";
import dayjs from "dayjs";
import { Loading } from "../Loading";
import NextIcon from '@mui/icons-material/SkipNextRounded';
import PreviousIcon from '@mui/icons-material/SkipPreviousRounded';
import SearchIcon from '@mui/icons-material/Search';
import AddCircleOutlineOutlinedIcon from '@mui/icons-material/AddCircleOutlineOutlined';
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import PersonAddAltRoundedIcon from '@mui/icons-material/PersonAddAltRounded';
import { CreateNewAttendance } from "./CreateNewAttendance";
import { CreateWeekRow } from "./CreateWeekRow";
import { CreateNewOwnerDog } from "./CreateNewOwnerDog";

interface FilterDaysProps {
  onSubmitSearch: () => void;
  dateStart: Date;
  dateEnd: Date;
  setDateStart: (date: Date) => void;
  setDateEnd: (date: Date) => void;
  loading: boolean;
  onPreviousWeek: () => void
  onNextWeek: () => void
  onSubmitNewRow: (values: any) => void;
  onSubmitNewWeek: (values: any) => void;
  onSubmitOwnerDog: (values: any) => void;
}

export function FilterDays({ onSubmitSearch, loading, dateEnd, dateStart, setDateEnd, setDateStart, onPreviousWeek, onNextWeek, onSubmitNewRow, onSubmitNewWeek, onSubmitOwnerDog}: FilterDaysProps) {

  const [createRowModalOpen, setCreateRowModalOpen] = useState(false);
  const [createWeekModalOpen, setCreateWeekModalOpen] = useState(false)
  const [createOwnerDogModalOpen, setCreateOwnerDogModalOpen] = useState(false)

  function addDays(date: Date, days: number) {
    var result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  return (
    <div className="md:flex  p-4 md:p-4 mt-4 ">
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <div className="flex bg-white rounded-3xl">

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

          </div>
          {loading ? null :
            <div className="flex flex-row justify-around w-auto h-14 mt-4 md:mt-0 md:ml-8 bg-white rounded-3xl p-3">
              <div className="mx-3 " onClick={onSubmitSearch}>
                <SearchIcon sx={iconStyle} />
              </div>
              <div className="mx-3 " onClick={() => setCreateOwnerDogModalOpen(true)}>
                <PersonAddAltRoundedIcon sx={iconStyle} />
              </div>
              <div className="mx-3 " onClick={() => setCreateWeekModalOpen(true)}>
                <ViewWeekIcon sx={iconStyle} />
              </div>
              <div className="mx-3 " onClick={() => setCreateRowModalOpen(true)}>
                <AddCircleOutlineOutlinedIcon sx={iconStyle} />
              </div>
            </div>
          }

          {createRowModalOpen ?
            <CreateNewAttendance
              open={createRowModalOpen}
              onClose={() => setCreateRowModalOpen(false)}
              onSubmit={(values) => onSubmitNewRow(values)}
            />
            : null}
          {createWeekModalOpen ?
            <CreateWeekRow
              open={createWeekModalOpen}
              onClose={() => setCreateWeekModalOpen(false)}
              onSubmit={(values) => onSubmitNewWeek(values)}
            />
            : null}
          {createOwnerDogModalOpen ?
            <CreateNewOwnerDog
              open={createOwnerDogModalOpen}
              onClose={() => setCreateOwnerDogModalOpen(false)}
              onSubmit={(values) => onSubmitOwnerDog(values)}
            />
            : null}
        </LocalizationProvider>
      </ThemeProvider>
    </div>
  )
}

// <ButtonLight text="Search" onClick={() => onSubmit()} style=" w-full md:w-auto px-6 h-[59px]"/>

/*<div className="border-2 rounded-full border-neutral-500 hover:border-pinkBackground my-[10px] justify-center">
          <SearchIcon fontSize="large" sx={iconStyle}/>
        </div>*/
//<ButtonLight text="Search" onClick={() => onSubmit()} />