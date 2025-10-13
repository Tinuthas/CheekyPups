import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from "@mui/material";
import { useState } from "react";
import { ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { theme, iconStyle } from "../lib/theme";
import dayjs from "dayjs";
import NextIcon from '@mui/icons-material/SkipNextRounded';
import PreviousIcon from '@mui/icons-material/SkipPreviousRounded';

interface FilterDatesRangeProps {
  data: Array<any>
  //onClose: () => void;
  //onSubmit: (data: Array<any>) => void;
  onSubmit: (dateStart: Date, dateEnd:Date) => void
}

export const FilterDatesRange = ({
  data,
  onSubmit
}: FilterDatesRangeProps) => {

  const [startDate, setStartDate] = useState<Date>(data[0]);
  const [endDate, setEndDate] = useState<Date>(data[1]);
  const [selectDateType, setSelectDateType] = useState<string>(data[2])

  function selectMonthDate() {
    setStartDate(dayjs().startOf('month').toDate())
    setEndDate(dayjs().endOf('month').toDate())
    setSelectDateType('M')
    onSubmit(startDate, endDate)
  }

  function selectThreeMonthDate() {
    setStartDate(dayjs().startOf('month').subtract(3, 'month').toDate())
    setEndDate(dayjs().endOf('month').toDate())
    setSelectDateType('T')
    onSubmit(startDate, endDate)
  }

  function selectWeekDate() {
    setStartDate(dayjs().startOf('isoWeek').toDate())
    setEndDate(dayjs().endOf('isoWeek').toDate())
    setSelectDateType('W')
    onSubmit(startDate, endDate)
  }

  function selectYearDate() {
    setStartDate(dayjs().startOf('year').toDate())
    setEndDate(dayjs().endOf('year').toDate())
    setSelectDateType('Y')
    onSubmit(startDate, endDate)
  }

  function onPrevious() {
    switch (selectDateType) {
      case 'W':
        setStartDate(dayjs(startDate).subtract(1, 'week').toDate())
        setEndDate(dayjs(endDate).subtract(1, 'week').toDate())
        break;
      case 'T':
        setStartDate(dayjs(startDate).subtract(3, 'month').toDate())
        setEndDate(dayjs(endDate).subtract(3, 'month').toDate())
        break;
      case 'M':
        setStartDate(dayjs(startDate).subtract(1, 'month').toDate())
        setEndDate(dayjs(endDate).subtract(1, 'month').toDate())
        break;
      case 'Y':
        setStartDate(dayjs(startDate).subtract(1, 'year').toDate())
        setEndDate(dayjs(endDate).subtract(1, 'year').toDate())
        break;
    }
    onSubmit(startDate, endDate)
  }

  function onNext() {
    switch (selectDateType) {
      case 'W':
        setStartDate(dayjs(startDate).add(1, 'week').toDate())
        setEndDate(dayjs(endDate).add(1, 'week').toDate())
        break;
      case 'M':
        setStartDate(dayjs(startDate).add(1, 'month').toDate())
        setEndDate(dayjs(endDate).add(1, 'month').toDate())
        break;
      case 'T':
        setStartDate(dayjs(startDate).add(3, 'month').toDate())
        setEndDate(dayjs(endDate).add(3, 'month').toDate())
        break;
      case 'Y':
        setStartDate(dayjs(startDate).add(1, 'year').toDate())
        setEndDate(dayjs(endDate).add(1, 'year').toDate())
        break;
    }
    onSubmit(startDate, endDate)
  }

  return (
    <>
      <div className="flex mt-3 w-full justify-center text-center text-lg md:text-xl font-borsok text-neutral-600">
        <h5>{startDate.toLocaleString(undefined, { weekday: "short", day: "numeric", month: 'short', year: 'numeric' })} - {endDate.toLocaleString(undefined, { weekday: "short", day: "numeric", month: 'short', year: 'numeric' })}</h5>
      </div>
      <div className="flex mt-5 w-full">
        <ThemeProvider theme={theme}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <div className="border rounded-full border-neutral-600 hover:border-pinkBackground mx-3 h-[36px] my-[10px] justify-center" onClick={onPrevious}>
              <PreviousIcon sx={iconStyle} />
            </div>
            <div className="mr-2 md:mr-6">
              <DatePicker
                label="Date Start"
                value={startDate}
                onChange={(newValue) => {
                  setStartDate(dayjs(newValue).toDate() || new Date());
                  onSubmit(startDate, endDate)
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
                value={endDate}
                onChange={(newValue) => {
                  setEndDate(dayjs(newValue).toDate() || new Date());
                  onSubmit(startDate, endDate)
                }}
                inputFormat="DD/MM/YYYY"
                renderInput={(params) => <TextField {...params} />}
              />
            </div>
            <div className="border rounded-full border-neutral-600 hover:border-pinkBackground mx-3 h-[36px] my-[10px] justify-center" onClick={onNext}>
              <NextIcon sx={iconStyle} />
            </div>
          </LocalizationProvider>
        </ThemeProvider>
      </div>
      <div className="flex flex-row justify-evenly m-6">
        <button onClick={() => selectWeekDate()} className={`rounded w-[90px] h-[35px] border border-pinkBackground ${selectDateType == 'W' ? 'bg-white  text-pinkBackground hover:bg-pinkBackground hover:text-white' : 'bg-pinkBackground  text-white hover:bg-white hover:text-pinkBackground'}`}>WEEK</button>
        <button onClick={() => selectMonthDate()} className={`rounded w-[90px] h-[35px] border border-pinkBackground ${selectDateType == 'M' ? 'bg-white  text-pinkBackground hover:bg-pinkBackground hover:text-white' : 'bg-pinkBackground  text-white hover:bg-white hover:text-pinkBackground'}`}>1 MONTH</button>
        <button onClick={() => selectThreeMonthDate()} className={`rounded w-[90px] h-[35px] border border-pinkBackground ${selectDateType == 'T' ? 'bg-white  text-pinkBackground hover:bg-pinkBackground hover:text-white' : 'bg-pinkBackground  text-white hover:bg-white hover:text-pinkBackground'}`}> 3 MONTH</button>
        <button onClick={() => selectYearDate()} className={`rounded w-[90px] h-[35px] border border-pinkBackground ${selectDateType == 'Y' ? 'bg-white  text-pinkBackground hover:bg-pinkBackground hover:text-white' : 'bg-pinkBackground  text-white hover:bg-white hover:text-pinkBackground'}`}>YEAR</button>
        {/**<button className={`rounded w-[75px] h-[35px] border border-pinkBackground ${selectDateType == 'A' ? 'bg-white  text-pinkBackground hover:bg-pinkBackground hover:text-white' : 'bg-pinkBackground  text-white hover:bg-white hover:text-pinkBackground'}`}>ALL</button>*/}
      </div>
    </>
  )
}