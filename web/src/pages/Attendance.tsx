import { useEffect, useMemo, useState } from "react"
import {api, getToken} from "../lib/axios";
import dayjs from "dayjs";
import colors from 'tailwindcss/colors'
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ButtonLight } from "../components/ButtonLight";
import { DataGrid, GridToolbar, useGridApiContext, useGridSelector, gridPageCountSelector, gridPageSelector,} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';

type Attendances = Array<{
  id:string;
  attendanceIds: string[];
  dog_id: string,
  name: string
  dates: string[];
  fullDates: boolean[];
  paids: boolean[];
}>

export function CustomFooterStatusComponent(props: {total:number}) {
  const apiRef = useGridApiContext();
  const page = useGridSelector(apiRef, gridPageSelector);
  const pageCount = useGridSelector(apiRef, gridPageCountSelector);
  return (
    <Box sx={{ p: 1, display: 'flex', justifyContent: 'space-between'}}>
      <Box sx={{display: 'flex', alignItems: 'end', }}>Total Rows: {props.total}</Box>

      <Pagination
        count={pageCount}
        page={page + 1}
        onChange={(event, value) => apiRef.current.setPage(value - 1)}
      />
    </Box>
  );
}

  const theme = createTheme({
    palette: {
      //mode: 'dark',
      primary: {
        light: '#FF499E',
        main: colors.neutral[700],
        dark: colors.pink[600],
        contrastText: colors.yellow[400],
      },
      secondary: {
        light: colors.white,
        main: '#FF499E',
        dark: colors.pink[700],
        contrastText: colors.yellow[400],
      },
      contrastThreshold: 3,
      tonalOffset: 0.2,
    },
    typography: {
      fontFamily: [
        'Inter',
        //'Roboto',
        'Avenir',
        '"Helvetica Neue"',
        'Arial',
        'sans-serif'
      ].join(','),
    }
  });


export function Attendance(){

  const [attendances, setAttendances] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [dateStart, setDateStart] = useState(dayjs().startOf('week').toDate());
  const [dateEnd, setDateEnd] = useState(dayjs().endOf('week').toDate());

  useEffect(() => {
    clickSearchByDates()
  }, [])

  function clickSearchByDates(){
    api.get<Attendances>('attendance', {
      params: {
        dateStart: dayjs(dateStart).toISOString(), 
        dateEnd: dayjs(dateEnd).toISOString()
      }, headers: {
        Authorization: getToken()
      }}).then(response => {
        
        var att = response.data
        var rows: any[] = []
        const dates = new Set<string>();
        att.map((item, index) => {
          var listDates:any = {}
          listDates['total'] = 0
          listDates['paid'] = 0
          for (let i = 0; i < item.dates.length; i++) {
            
            listDates[dayjs(item.dates[i]).format('DD/MM/YYYY')] = item.fullDates[i]? 'D' : '½D'
            dates.add(dayjs(item.dates[i]).format('DD/MM/YYYY'))
            listDates['total'] = listDates['total'] + 1
            listDates['paid'] = item.paids[i]? listDates['paid'] + 1 : listDates['paid']
          }
          var obj = Object.assign({}, item, listDates);
          console.log(obj)
          rows.push(obj)
        })

        setAttendances(rows)

        var base = [{ 
          field:'name', 
          headerName: 'Name', 
          width: 150
        }, 
        {
          field:'total', 
          headerName: 'Total', 
          headerAlign: 'center',
          align: 'center',
          width: 50
        },
        {
          field:'paid', 
          headerName: 'Paid', 
          headerAlign: 'center',
          align: 'center',
          width: 50
        }]
        for (const item of dates) {
          console.log(item)
          base.push({field:item, headerName: item, width: 100, headerAlign: 'center', align: 'center'})
        }
        setColumns(base)
      }).catch(err => {
        console.log(err)
      })
  }

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h1 className="font-semibold text-3xl md:text-4xl text-white">Attendance List</h1>
      <div className="md:flex bg-white w-full p-4 md:p-8 mt-4 rounded">
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
            <div className="md:mr-2">
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
        
        <ButtonLight text="Search" onClick={clickSearchByDates}/>

        <ButtonLight text="Add Attendance" onClick={clickSearchByDates}/>
      </div>
        
      <div className="md:m-9 h-[60vh] w-full bg-white rounded">
      <ThemeProvider theme={theme}>
        <DataGrid
          columns={columns}
          rows={attendances}
          components={{
            Toolbar: GridToolbar,
            Footer: CustomFooterStatusComponent,
          }}
          componentsProps={{
            footer: { total: attendances.length },
          }}
        />
        </ThemeProvider>
      </div>
    </div>
  )
}

