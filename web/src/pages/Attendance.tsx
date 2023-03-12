import { useEffect, useMemo, useState } from "react"
import {api, getToken} from "../lib/axios";
import dayjs from "dayjs";
import TextField from '@mui/material/TextField';
import Avatar from '@mui/material/Avatar';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { ThemeProvider } from "@mui/material/styles";
import { ButtonLight } from "../components/ButtonLight";
import { Add } from '@mui/icons-material';
import Box from '@mui/material/Box';
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { IconButton } from "@mui/material";
import { CreateNewModal } from "../components/CreateNewModal";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import MenuItemCustom from "../components/MenuItemCustom";
import clsx from 'clsx'
import { theme } from "../lib/theme";
import { AvatarModal } from "../components/AvatarProfile";

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

function convertToDate(dateString: string) {
  let d = dateString.split("/");
  let dat = new Date(d[2] + '/' + d[1] + '/' + d[0]);
  return dat;     
}

interface Attendance {
  id: number;
  paid: boolean;
  fullDay: boolean;
  extract: {
    value: number,
    description: string,
  },
  day: {
    date: string,
  }
}


export function Attendance(){

  const [attendances, setAttendances] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [dateStart, setDateStart] = useState(dayjs().startOf('week').toDate());
  const [dateEnd, setDateEnd] = useState(dayjs().endOf('week').toDate());
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [marginTable, setMarginTable] = useState(0)
  const [openIndex, setOpenIndex] = useState(-1)
  const [openAvatar, setOpenAvatar] = useState(false)

  /*const [valueField, setValueField] = useState(HALF_DAY)
  const [valueDecriptionField, setValueDecriptionField] = useState("")
  const [dateValueField, setDateValueField] = useState(dayjs().format('YYYY-MM-DD'));
  const [fullDayField, setFullDayField] = useState(false);
  const [paidField, setPaidField] = useState(false);
  const [attendanceField, setAttedanceField] = useState<Attendance>({
    id: 1,
    paid: false,
    fullDay: false,
    extract: {
      value: HALF_DAY,
      description: "",
    },
    day: {
      date: dayjs().format('YYYY-MM-DD'),
    }
  });*/

  useEffect(() => {
    clickSearchByDates()
  }, [])

  function handleEdit(item:any, row:any) {
    var date = dayjs(convertToDate(item)).format('YYYY-MM-DD')
    var listDates:string[] = row?.original?.dates
    var listIds:number[] = row?.original?.attendanceIds
  }

  function getIdAttendance(item:any, row:any) {
    var listDates:string[] = row?.original?.dates
    var listIds:number[] = row?.original?.attendanceIds
    return listIds[listDates.indexOf(item)]
  }

  function getAttendance(id: number) {
    api.get<Attendance>('attendance/id', {
      params: {
        id,
      }, headers: {
          Authorization: getToken()
      }}).then(response => {
        /*var att = response.data
        setAttedanceField(att)
        console.log('field')
        console.log(attendanceField)
        setDateValueField(dayjs(att.day.date).format('YYYY-MM-DD'))
        console.log(dateValueField)
        setValueField(Number(att.extract.value))
        setValueDecriptionField(att.extract.description)
        setPaidField(att.paid)
        setFullDayField(att.fullDay)*/
      }).catch((err: AxiosError) => {
        const data = err.response?.data as {message: string}
        toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      })
  }

  function cellComponent(item: string) {
    var column:MRT_ColumnDef<any> = {
      accessorKey: item, 
      header: item,
      Header: ({ column }) => <div className="w-[90px] p-0 text-center">{column.columnDef.header}</div>,
      Cell: ({ renderedCellValue, row }) => (
        <div className="w-[133.055px]">
          { renderedCellValue != null ?
            <MenuItemCustom 
              handleDelete={() => console.log(row)} 
              handleEdit={() => handleEdit(item, row)}
              id={getIdAttendance(item, row)}
              getAttendance={(id:number) => getAttendance(id)}
              editData={[
                {
                  accessorKey: 'date',
                  label: 'Date',
                  name: '',
                  type: "date",
                  //value: dayjs(attendanceField.day.date).format('YYYY-MM-DD'),
                  //setValue: (value) => setDateValueField(value),
                },
                {
                  accessorKey: 'fullDay',
                  label: 'Half Day',
                  name: 'Full Day',
                  type: "checkbox",
                  /*value: attendanceField.fullDay,
                  setValue: (value) => setFullDayField(value),
                  setLocalStatus: (status) => {      
                    status === true ? setValueField(FULL_FAY) : setValueField(HALF_DAY)               
                  }*/
                },
                {
                  accessorKey: 'value',
                  label: 'Value',
                  name: '',
                  type: "number",
                  /*value: attendanceField.extract.value,
                  setValue: (value) => setValueField(Number(value)),*/
                },
                {
                  accessorKey: 'paid',
                  label: 'Paid',
                  name: 'Paid',
                  type: "checkbox",
                  /*value: attendanceField.paid,
                  setValue: (value) => setPaidField(value),*/
                },
                {
                  accessorKey: 'descriptionValue',
                  label: 'Description',
                  name: '',
                  type: "text",
                  /*value: attendanceField.extract.description,
                  setValue: (value) => setValueDecriptionField(value),*/
                }]}
            >
              
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
  
            listDates[item.dates[i]] = item.paids[i] ? (item.fullDates[i] ? 'DP' : '½DP') : item.fullDates[i] ? 'D' : '½D'
            dates.add(item.dates[i])
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
            Cell: ({ renderedCellValue, row }) => (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', }}>
                  <span className="cursor-pointer" onClick={() => {
                    console.log(row)
                    setOpenAvatar(true)
                    setOpenIndex(row.original.dog_id)
                  }}>
                    <Avatar sx={{ width: 30, height: 30 }} src={row.original.avatarUrl}  />
                  </span>
                  <span>{renderedCellValue}</span>
                </Box>
                {row.original.dog_id == openIndex && openAvatar ? 
                  <AvatarModal 
                    open={openAvatar}
                    onClose={() => setOpenAvatar(false)}
                    onSubmit={(value) => {
                      clickSearchByDates()
                      setOpenAvatar(false)
                    }}
                    nameFile={row.original.dog_id+"_"+row.original.name.toLowerCase() ?? ""}
                    avatarUrl={row.original.avatarUrl}
                    name={row.original.name}
                    id={Number(row.original.dog_id)}
                  />
                : null
                }
              </>
            )
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
                    //setValueField(HALF_DAY)
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
                  /*value: dateValueField,
                  setValue: (value) => setDateValueField(value),*/
                },
                {
                  accessorKey: 'fullDay',
                  label: 'Half Day',
                  name: 'Full Day',
                  type: "checkbox",
                  /*setLocalStatus: (status) => {      
                    status === true ? setValueField(FULL_FAY) : setValueField(HALF_DAY)               
                  }*/
                },
                {
                  accessorKey: 'value',
                  label: 'Value',
                  name: '',
                  type: "number",
                  /*value: valueField,
                  setValue: (value) => setValueField(Number(value)),*/
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

