import { useEffect, useMemo, useState } from "react"
import {api, getToken} from "../lib/axios";
import dayjs from "dayjs";
import TextField from '@mui/material/TextField';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { Button } from "../components/Button";
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
    components: {
      MuiIconButton: {
        styleOverrides: {
          sizeMedium: {
            color: '#262626'
          }
        }
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            color:'#262626'
          }
        }
      },
      MuiInputLabel: {
        styleOverrides: {
          root: {
            color:'#262626'
          }
        }
      }
    }
  });


export function Attendance(){

  const col = useMemo(()=>[
    {field:'name', headerName: 'Name', width: 170}
  ], [])

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
          for (let i = 0; i < item.dates.length; i++) {
            
            listDates[dayjs(item.dates[i]).format('DD/MM/YYYY')] = item.fullDates[i]? 'D' : '½D'
            dates.add(dayjs(item.dates[i]).format('DD/MM/YYYY'))
            listDates['total'] = listDates['total'] + 1
          }
          var obj = Object.assign({}, item, listDates);
          console.log('total')
          console.log(obj)
          rows.push(obj)
        })

        setAttendances(rows)

        var base = [{field:'name', headerName: 'Name', width: 150}, {field:'total', headerName: 'Total', width: 60}]
        for (const item of dates) {
          console.log(item)
          base.push({field:item, headerName: item, width: 100})
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
        
        <Button text="Search" onClick={clickSearchByDates}/>
      </div>
        
      <div className="md:m-9 h-[60vh] w-full bg-white rounded">
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
      </div>
    </div>
  )
}

