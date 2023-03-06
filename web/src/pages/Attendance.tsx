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
import { Add } from '@mui/icons-material';
import { DataGrid, GridToolbar, useGridApiContext, useGridSelector, gridPageCountSelector, gridPageSelector,} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { IconButton } from "@mui/material";
import { CreateNewModal } from "../components/CreateNewModal";
import { AxiosError } from "axios";
import { toast } from "react-toastify";

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
        light: colors.neutral[700],
        //main: colors.neutral[700],
        main:  '#FF499E',
        dark: colors.neutral[700],
        contrastText: colors.white,
      },
      secondary: {
        light: colors.white,
        main: '#FF499E',
        dark: colors.neutral[700],
        contrastText: colors.white,
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
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [valueField, setValueField] = useState(12.5)
  const [dateValueField, setDateValueField] = useState(dayjs().format('YYYY-MM-DD'));

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
        if(rows.length != 0 ) {
          var base = [{ 
            accessorKey:'name', 
            header: 'Name', 
            size: 150
          }, 
          {
            accessorKey:'total', 
            header: 'Total', 
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
            size: 50
          },
          {
            accessorKey:'paid', 
            header: 'Paid', 
            muiTableHeadCellProps: {
              align: 'center',
            },
            muiTableBodyCellProps: {
              align: 'center',
            },
            size: 50
          }]
          for (const item of dates) {
            console.log(item)
            base.push({
              accessorKey:item, 
              header: item, 
              size: 100, 
              muiTableHeadCellProps: {
                align: 'center',
              },
              muiTableBodyCellProps: {
                align: 'center',
              }})
          }
          setColumns(base)
        }
        
      }).catch(err => {
        console.log(err)
      })
  }

  const handleCreateNewRow = (values: any) => {
    /*
    createRow(values).then(() => {
      data.push(values);
      if(setData != undefined)
        setData([...data]);
    })*/
  };

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
      </div>
        
      
      <ThemeProvider theme={theme}>
        <div className="md:m-9 bg-white rounded w-full">
          <MaterialReactTable
            columns={columns as MRT_ColumnDef<(typeof attendances)[0]>[]}
            data={attendances}
            enableColumnResizing
            renderTopToolbarCustomActions={() => (
              <>
                <Box sx={{ fontSize: 16, fontWeight: 'medium', paddingTop: 0, paddingLeft: 1 }}>
                  {"Attendances"}
                  <IconButton onClick={() => setCreateModalOpen(true)}>
                    <Add />
                  </IconButton>
                </Box>
                
              </>
              
            )}
          />
          <CreateNewModal
            columns={[
                {
                  accessorKey: 'dogId',
                  label: 'Dog',
                  name: 'Choose dog',
                  type: "select",
                  required: true,
                  getDataSelect: (inputValue: string) => new Promise<any[]>((resolve, reject) => { 
                    api.get('dogs/select', { params: { name: inputValue}, headers: { Authorization: getToken()}}).then(response =>{
                      var data = response.data
                      var listData:any[] = []
                      data.forEach((element:any) => {
                        listData.push({value: element.id, label: element.name})
                      });
                      resolve(listData)
                    }).catch((err: AxiosError) => {
                      const data = err.response?.data as {message: string}
                      toast.error(`Unidentified error: ${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
                      throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
                    })
                  })
                },
                {
                  accessorKey: 'date',
                  label: 'Date',
                  name: '',
                  type: "date",
                  value: dateValueField,
                  setValue: (value) => setDateValueField(value),
                },
                {
                  accessorKey: 'fullDay',
                  label: 'Half Day',
                  name: 'Full Day',
                  type: "checkbox",
                  setLocalStatus: (status) => {
                    if(status) 
                      setValueField(17.50)
                    else
                      setValueField(12.50)
                  }
                },
                {
                  accessorKey: 'value',
                  label: 'Value',
                  name: '',
                  type: "number",
                  value: valueField,
                  setValue: (value) => setValueField(value),
                },
                {
                  accessorKey: 'paid',
                  label: 'Paid',
                  name: 'Paid',
                  type: "checkbox",
                },
                {
                  accessorKey: 'descriptionValue',
                  label: 'Description',
                  name: '',
                  type: "text",
                }]}
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
          />
        </div>
      </ThemeProvider>
     
    </div>
  )
}

/*
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
        />*/

