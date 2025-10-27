
import { Badge, styled, TextField, ThemeProvider } from "@mui/material";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { theme } from "../lib/theme";
import dayjs from "dayjs";
import { PickersDay } from "@mui/x-date-pickers";
import { useState } from "react";

interface ChooseDateButtonProps {
  label: String;
  date: Date;
  setDate: (date: Date) => void;
  calendar: Array<{dayBooking: {date: string, daysBooking: []}}>
}

import updateLocale from "dayjs/plugin/updateLocale";

dayjs.extend(updateLocale);

dayjs.updateLocale("en", {
  weekStart: 1
});

export function ChooseDateButton({ label, date, setDate, calendar }: ChooseDateButtonProps) {

  const [highlightedDays, setHighlitedDays] = useState(calendar != undefined ? calendar : []);
  
  return (
    <div className="h-10 my-2 ">
      <ThemeProvider theme={theme}>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            className=" transition-all"
            value={date}
            renderDay={(day, _value, DayComponentProps) => {
              let selectDay:any|null = null
              calendar.map((hightlighed) => {
                if(hightlighed.dayBooking.date.includes(dayjs(day).toISOString())){
                  selectDay = hightlighed
                  //return hightlighed
                }
              })

              return (
                <Badge
                  key={day.toString()}
                  overlap="circular"
                  badgeContent={selectDay!=null ? selectDay.dayBooking.daysBooking.length : undefined}
                  color="success"
                  sx={{
                    "& .MuiBadge-badge": {
                      color: "#FFFFFF",
                      fontWeight: 900,
                    }
                  }}
                >
                  <PickersDay {...DayComponentProps} />
                </Badge>
              );
              
            }}
            views={['year', 'month', 'day']}
            
            //label={label}
            /*PopperProps={{
              //desktopPaper: { // Or 'mobilePaper' for the mobile variant
                sx: {
                  width: 350, // Adjust this to your desired width in pixels
                  minWidth: 350, // Ensure a minimum width
                  '& .MuiDateCalendar-root': { // Target the calendar's root element
                    width: '100%', // Make the calendar itself take the full width of the paper
                    height: 350 // You can also adjust the height if desired
                  }
                },
                
              //},
            }}*/
            PopperProps={{
              
              sx: {
                '& .MuiPaper-root': { // Targets the paper container of the popper
                  minWidth: '400px', // Sets a minimum width for the popup
                  // You can also set a fixed width: width: '400px',
                  width: '400px',
                  height: '460px',
                },
                '& .css-epd502': {height: '450px', maxHeight: '450px', width: '400px'},
                '& .MuiCalendarOrClockPicker-root': {height: '450px', maxHeight: '450px', width: '400px'},
                '& .MuiCalendarPicker-root': { height: '450px', maxHeight: '450px', width: '400px'},
                '& .MuiDayPicker-slideTransition': {height: '450px', maxHeight: '450px'},
                '& .MuiDayPicker-monthContainer': {height: '450px', maxHeight: '450px', width: '400px'},
                '& .MuiDayPicker-header':{width: '400px'},
                '& .MuiDayPicker-weekDayLabel': {
                  fontSize: '20px',
                  marginX: '9px',
                  marginY: '8px',
                },
                '& .MuiPickersDay-root': { // Target the days
                  fontSize: '22px', // Increase font size for the days
                  marginX: '9px',
                  marginY: '8px',
                  color: '#404040',
                  width: '36px',
                  maxWidth: '36px',
                  height: '36px'
                },
                '& .MuiDayCalendar-header': { // Target the header (month, year)
                  //fontSize: '20px', // Increase font size for the header
                },
              },
            }}
            onChange={date => date != null ? setDate(date) : null}
            inputFormat="DD/MM/YYYY"
            renderInput={(params) => <TextField {...params} sx={{
              "& .MuiInputBase-input": {
                height: "8px" // Set your height here.
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
            }} className="w-full p-0 m-0" />}
          />
        </LocalizationProvider>
      </ThemeProvider>
    </div>

  )
}