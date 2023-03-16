import { useEffect, useState } from "react"
import {api, getToken} from "../lib/axios";
import dayjs from "dayjs";
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { AvatarModal } from "../components/AvatarProfile";
import { FilterDays } from "../components/FilterDays";
import { DataTableAttendance } from "../components/DataTableAttendance";
import { cellComponent } from "../components/CellAttendanceDate";


type Attendances = Array<{
  id:string;
  attendanceIds: string[];
  dog_id: string,
  name: string
  dates: string[];
  fullDates: boolean[];
  paids: boolean[];
}>

export function Attendances(){

  const [attendances, setAttendances] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [dateStart, setDateStart] = useState(dayjs().startOf('week').toDate());
  const [dateEnd, setDateEnd] = useState(dayjs().endOf('week').toDate());
  const [marginTable, setMarginTable] = useState(0)
  const [openNameAvatar, setOpenNameAvatar] = useState('')
  const [openUrlAvatar, setOpenUrlAvatar] = useState('')
  const [openAvatar, setOpenAvatar] = useState(false)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    clickSearchByDates()
  }, [])

  function handleOpenAvatar(row:any) {
    setOpenAvatar(true)
    setOpenNameAvatar(row?.original?.name)
    setOpenUrlAvatar(row?.original?.avatarUrl)
  }

  function clickSearchByDates(dateStartField?:Date, dateEndField?:Date){
    setLoading(true)
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
          rows.push(obj)
        })
        setMarginTable(marginDates)
        setAttendances(rows)
        if(rows.length != 0 ) {
          var base:MRT_ColumnDef<any>[] = [{ 
            accessorKey:'name', 
            header: 'Dog name',
            size: 200,
            Cell: ({ renderedCellValue, row }) => (
              <>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: '1rem', }}>
                  <span className="cursor-pointer" onClick={() => handleOpenAvatar(row)}>
                    <Avatar sx={{ width: 30, height: 30 }} src={row.original.avatarUrl}  />
                  </span>
                  <span>{renderedCellValue}</span>
                </Box>
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
          for (const item of Array.from(dates).sort()) {
            base.push(cellComponent(item, () => clickSearchByDates()))
          }
          console.log(base)
          setColumns(base)
        }
        setLoading(false)
      }).catch(err => {
        console.log(err)
        setLoading(false)
      })
  }


  const handleCreateNewRow = (values: any) => {
    setLoading(true)
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
    }).catch((err: AxiosError) => {
      const data = err.response?.data as {message: string}
      toast.error(`Unidentified error: ${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      throw new Error(`Unidentified error: ${data.message || err.response?.data || err.message}`);
      setLoading(false)
    })
  };

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h1 className="font-medium text-3xl md:text-4xl text-white">Attendances</h1>
      <FilterDays 
        dateStart={dateStart}
        dateEnd={dateEnd}
        setDateStart={(date) => setDateStart(date)}
        setDateEnd={(date) => setDateEnd(date)}
        onSubmit={() => clickSearchByDates()} 
        loading={loading}/>
        
      <DataTableAttendance 
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

