import { useEffect, useState } from "react"
import {api, getToken} from "../lib/axios";
import dayjs from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek) 
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { AvatarModal } from "../components/AvatarProfile";
import { FilterDays } from "../components/FilterDays";
import { DataTableAttendance } from "../components/attendance/DataTableAttendance";
import { cellComponent } from "../components/attendance/CellAttendanceDate";

type Attendances = Array<{
  id:string;
  attendanceIds: string[];
  dog_id: string,
  name: string
  dates: string[];
  typeDays: string[];
  paids: boolean[];
}>

export function Attendances(){

  const [attendances, setAttendances] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [dateStart, setDateStart] = useState(dayjs().startOf('isoWeek').toDate());
  const [dateEnd, setDateEnd] = useState(dayjs().endOf('isoWeek').toDate());
  const [marginTable, setMarginTable] = useState(0)
  const [openNameAvatar, setOpenNameAvatar] = useState('')
  const [openUrlAvatar, setOpenUrlAvatar] = useState('')
  const [openAvatar, setOpenAvatar] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    clickSearchByDates()
  }, [dateStart, dateEnd])

  function onSubmitUpdatePage(){
    clickSearchByDates()
    return new Promise<boolean>((resolve, reject) => {
      resolve(true)
    })
  }

  function onNextPreviousWeek(days: number) {
    var newDateStart = new Date(dateStart)
    newDateStart.setDate(dateStart.getDate() + days)
    var newDateEnd = new Date(dateEnd)
    newDateEnd.setDate(dateEnd.getDate() + days)
    setDates(newDateStart, newDateEnd)
    clickSearchByDates(newDateStart, newDateEnd)
  }

  function setDates(newDateStart:Date, newDateEnd:Date) {
    setDateStart(newDateStart)
    setDateEnd(newDateEnd)
    console.log(dateStart + " " +dateEnd )
  }

  function handleOpenAvatar(row:any) {
    setOpenAvatar(true)
    setOpenNameAvatar(row?.original?.name)
    setOpenUrlAvatar(row?.original?.avatarUrl)
  }

  function clickSearchByDates(dateStartField?:Date, dateEndField?:Date){
    setLoading(true)
    if(dateStartField == null) dateStartField = dateStart
    if(dateEndField == null) dateEndField = dateEnd
    api.get<Attendances>('attendance', {
      params: {
        dateStart: dayjs(dateStartField).toISOString(), 
        dateEnd: dayjs(dateEndField).toISOString()
      }, headers: {
        Authorization: getToken()
      }}).then(response => {
        setDates(dateStartField, dateEndField)
        var att = response.data
        if(att.length != 0) {
          var rows: any[] = []
          const dates = new Set<string>();
          var marginDates = 0
          att.map((item, index) => {
            var listDates:any = {}
            listDates['total'] = 0
            listDates['paid'] = 0 
            for (let i = 0; i < item.dates.length; i++) {
              listDates[item.dates[i]] = item.paids[i] ? (item.typeDays[i] != 'HD' ? 'DP' : '½DP') : item.typeDays[i] != 'HD' ? 'D' : '½D'
              dates.add(item.dates[i])
              listDates['total'] = listDates['total'] + 1
              listDates['paid'] = item.paids[i]? listDates['paid'] + 1 : listDates['paid']
            }
            marginDates = listDates['total'] > marginDates ? listDates['total'] : marginDates
            
            var obj = Object.assign({}, item, listDates);
            rows.push(obj)
          })
          setMarginTable(marginDates)
          setAttendances(rows)
          if(rows.length != 0 ) {
            var base:MRT_ColumnDef<any>[] = [{ 
              accessorKey:'name', 
              header: 'Dog Name',
              size: 180,
              Cell: ({ renderedCellValue, row }) => (
                <>
                  {row?.original?.['dates'].length >= 5 ?
                    <div className="flex flex-row justify-center align-baseline">
                      <div className="w-[5px] h-[20px] bg-purple-600 mr-2 rounded"></div>
                      <span className="font-medium">{renderedCellValue }</span>
                    </div>
                  :row?.original?.['owner_dogs'] >= 2 ? 
                    <div className="flex flex-row justify-center align-baseline">
                      <div className="w-[5px] h-[20px] bg-lime-500 mr-2 rounded"></div>
                      <span className="font-medium">{renderedCellValue }</span>
                    </div>
                  : 
                    <div>
                      <span className="font-medium">{renderedCellValue }</span>
                    </div>
                  }
                </>
              ), 
              Footer: ({  }) => <div className="">Total: </div> 
            }]
            for (const item of Array.from(dates)) {
              var totalSumDays = 0
              rows.map((row) => {
                item in row ? totalSumDays++ : null
              })
              
              base.push(cellComponent(item, () => onSubmitUpdatePage(), totalSumDays))
            }
            //console.log(base)
            setColumns(base)
          }
        }else{
          setAttendances([])
          setMarginTable(0)
          setColumns([])
        }
        setLoading(false)
      }).catch(err => {
        console.log(err)
        setLoading(false)
      })
  }


  const handleCreateNewRow = (values: any) => {
    setLoading(true)
    console.log(values)
    console.log('paid')
    console.log(values.paid)
    var newValues = {
      dog_id: Number(values.dogId), 
      date: values.date, 
      typeDay: values.typeDay?.toUpperCase?.(), 
      paid: values.paid,  
      value: values.value, 
      typePaid: values.typePaid?.toUpperCase?.(),
      descriptionValue: values.descriptionValue
    }
    api.post('attendance', newValues, {
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      toast.success(`Attedanted: ${values.dog}`, { position: "top-center", autoClose: 1000, })
      clickSearchByDates()
    }).catch((err: AxiosError) => {
      console.log(err)
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      setLoading(false)
    })
  };

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h3 className="font-medium text-3xl md:text-4xl text-white font-borsok">Daycare</h3>
      <h3 className="text-white font-borsok text-lg md:text-xl">{dateStart.toLocaleString(undefined,{weekday: "short", day: "numeric", month:'short', year:'numeric'})} - {dateEnd.toLocaleString(undefined,{weekday: "short", day: "numeric", month:'short', year:'numeric'})}</h3>
      <FilterDays 
        dateStart={dateStart}
        dateEnd={dateEnd}
        setDateStart={(date) => setDateStart(date)}
        setDateEnd={(date) => setDateEnd(date)}
        onSubmit={() => clickSearchByDates()} 
        loading={loading}
        onPreviousWeek={() => onNextPreviousWeek(-7)}
        onNextWeek={() => onNextPreviousWeek(+7)}
        />
        
      <DataTableAttendance 
        title={"" + dateStart.toLocaleString(undefined, {weekday: "short"}) + " " + dayjs(dateStart).format('DD/MM/YYYY') + " - " +dateEnd.toLocaleString(undefined, {weekday: "short"}) + " " + dayjs(dateEnd).format('DD/MM/YYYY')}
        attendances={attendances}
        columns={columns}
        marginTable={marginTable}
        handleCreateNewRow={handleCreateNewRow}
        loading={loading}
      />

      {openAvatar ? 
        <AvatarModal 
          open={openAvatar}
          onClose={() => setOpenAvatar(false)}
          avatarUrl={openUrlAvatar}
          name={openNameAvatar}
        />
      : null }
      
     
    </div>
  )
}


//Adding Avatar Icon in rows name
{/*<Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', }}>
                    <span className="cursor-pointer" onClick={() => handleOpenAvatar(row)}>
                      <Avatar sx={{ width: 30, height: 30 }} src={row.original.avatarUrl}  />
                    </span>
                    <span>{renderedCellValue}</span>
                  </Box> */}

//Adding Paid and Total columns 
/* 
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
            }*/
