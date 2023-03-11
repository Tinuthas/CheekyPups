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
import MenuItemCustom from "../components/MenuItemCustom";
import clsx from 'clsx'

const HALF_DAY = 12.5
const FULL_FAY = 17.5

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

interface AttendanceData {
  name:string;
  total: number;
  paid: number;
}


export function Attendance(){

  const [attendances, setAttendances] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [dateStart, setDateStart] = useState(dayjs().startOf('week').toDate());
  const [dateEnd, setDateEnd] = useState(dayjs().endOf('week').toDate());
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [valueField, setValueField] = useState(HALF_DAY)
  const [dateValueField, setDateValueField] = useState(dayjs().format('YYYY-MM-DD'));
  const [marginTable, setMarginTable] = useState(0)
  const [openDelete, setOpenDelete] = useState(false)

  console.log(marginTable)

  useEffect(() => {
    clickSearchByDates()
  }, [])

  function clickDateAttendance(cell:any, row: any) {
    console.log('clicked')
    console.log(row)
    console.log(cell)
  }

  function cellComponent(item: string) {
    var column:MRT_ColumnDef<any> = {
      accessorKey:item, 
      header: item,
      Header: ({ column }) => <div className="w-[90px] p-0 text-center">{column.columnDef.header}</div>,
      Cell: ({ renderedCellValue, row }) => (
        <div className="w-[133.055px]">
          { renderedCellValue != null ?
            <MenuItemCustom handleDelete={() => console.log(row)}>
            { renderedCellValue?.toString().toUpperCase().includes('P') ?
              <span className="font-black text-green-600">{renderedCellValue.toString().toUpperCase().replace('P', '')}</span>
            : <span className="font-black text-stone-500">{renderedCellValue}</span>
            }
            </MenuItemCustom>
          : null}
          
        </div>
       
      )
    }
    return column

  }

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
        var marginDates = 0
        att.map((item, index) => {
          var listDates:any = {}
          listDates['total'] = 0
          listDates['paid'] = 0
          for (let i = 0; i < item.dates.length; i++) {

            listDates[dayjs(item.dates[i]).format('DD/MM/YYYY')] = item.paids[i] ? (item.fullDates[i] ? 'DP' : '½DP') : item.fullDates[i] ? 'D' : '½D'
            dates.add(dayjs(item.dates[i]).format('DD/MM/YYYY'))
            listDates['total'] = listDates['total'] + 1
            listDates['paid'] = item.paids[i]? listDates['paid'] + 1 : listDates['paid']
          }
          marginDates = listDates['total'] > marginDates ? listDates['total'] : marginDates
          var obj = Object.assign({}, item, listDates);
          console.log(obj)
          rows.push(obj)
        })
        console.log(marginDates)
        setMarginTable(marginDates)
        setAttendances(rows)
        if(rows.length != 0 ) {
          var base:MRT_ColumnDef<any>[] = [{ 
            accessorKey:'name', 
            header: 'Dog name',
          }, 
          {
            accessorKey:'total', 
            header: 'Total',
            size: 125,
            Header: ({ column }) => <div className="w-[32px] p-0 text-center">{column.columnDef.header}</div>,
            Cell: ({ renderedCellValue }) => <div className="w-[32px] text-center">{renderedCellValue}</div>
          },
          {
            accessorKey:'paid', 
            header: 'Paid',
            size: 120,
            Cell: ({ renderedCellValue }) => <div className="w-[28px] text-center">{renderedCellValue}</div>
          }]
          for (const item of dates) {
            base.push(cellComponent(item))
          }
          console.log(base)
          setColumns(base)
        }
        
      }).catch(err => {
        console.log(err)
      })
  }


  const handleCreateNewRow = (values: any) => {
    console.log(values)
    var newValues = {
      dog_id: Number(values.dogId), 
      date: values.date, 
      fullDay: (values.fullDay?.toLowerCase?.() === 'true'), 
      paid: (values.paid?.toLowerCase?.() === 'true'),  
      value: values.value, 
      descriptionValue: values.descriptionValue
    }
    api.post('attendance', newValues, {
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      toast.success(`Attedanted: ${values.dog}`, { position: "top-center", autoClose: 1000, })
      clickSearchByDates()
      //attendances.push(newValues);
      //setAttendances([...attendances]);
    }).catch((err: AxiosError) => {
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
    })
  };

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h1 className="font-medium text-3xl md:text-4xl text-white">Attendances</h1>
      <div className="md:flex bg-white p-4 md:p-8 mt-4 rounded">
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
            <div className="">
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
        <div className={clsx('w-full mt-9 transition-all', {
          'md:px-28 lg:px-56 xl:px-[450px]': marginTable == 0,
          'md:px-16 lg:px-48 xl:px-[300px]': marginTable == 1,
          'md:px-20 lg:px-36 xl:px-60': marginTable == 2,
          'md:px-16 lg:px-44 xl:px-36': marginTable == 3,
          'md:px-12 lg:px-40 xl:px-16': marginTable == 4,
          'md:px-8 lg:px-24 xl:px-0 desktop:px-8': marginTable == 5,
          'px-0' : marginTable >= 5,
        })}>
          <div className="bg-white rounded">

          
          <MaterialReactTable
            columns={columns as MRT_ColumnDef<(typeof attendances)[0]>[]}
            data={attendances}
            renderTopToolbarCustomActions={() => (
              <Box sx={{ fontSize: 16, fontWeight: 'medium', paddingTop: 0, paddingLeft: 1 }}>
                {"Attendances"}
                <IconButton onClick={() => {
                    setValueField(HALF_DAY)
                    setCreateModalOpen(true)
                  }}>
                  <Add />
                </IconButton>
              </Box>
            )}
            muiTablePaperProps={{
              elevation: 0, //change the mui box shadow
              //customize paper styles
              sx: {
                borderRadius: '4',
                border: '1px dashed #ffffff',
              },
            }}
            layoutMode="grid"
            muiTableHeadCellProps={{
              sx: {
                flex: '0 0 auto',
              },
            }}
            muiTableBodyCellProps={{
              sx: {
                flex: '0 0 auto',
              },
            }}
          />
          {createModalOpen ? 
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
                    status === true ? setValueField(FULL_FAY) : setValueField(HALF_DAY)               
                  }
                },
                {
                  accessorKey: 'value',
                  label: 'Value',
                  name: '',
                  type: "number",
                  value: valueField,
                  setValue: (value) => setValueField(Number(value)),
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
          />: null
          }
        </div>
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

