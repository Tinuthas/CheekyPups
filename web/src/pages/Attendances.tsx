import { useEffect, useState } from "react"
import { api, getToken } from "../lib/axios";
import dayjs from "dayjs";
import isoWeek from 'dayjs/plugin/isoWeek'
dayjs.extend(isoWeek)
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { AvatarModal } from "../components/AvatarProfile";
import { FilterDays } from "../components/attendance/FilterDays";
import { DataTableAttendance } from "../components/attendance/DataTableAttendance";
import { cellComponent } from "../components/attendance/CellAttendanceDate";
import InfoItemButton from "../components/attendance/InfoItemButton";

type Attendances = Array<{
  id: string;
  attendanceIds: string[];
  dog_id: string,
  name: string
  dates: string[];
  typeDays: string[];
  paids: boolean[];
}>

export function Attendances() {

  const [attendances, setAttendances] = useState<any>([])
  const [columns, setColumns] = useState<any>([])
  const [dateStart, setDateStart] = useState(dayjs().startOf('isoWeek').toDate());
  const [dateEnd, setDateEnd] = useState(dayjs().endOf('isoWeek').toDate());
  const [marginTable, setMarginTable] = useState(0)
  const [openNameAvatar, setOpenNameAvatar] = useState('')
  const [openUrlAvatar, setOpenUrlAvatar] = useState('')
  const [openAvatar, setOpenAvatar] = useState(false)
  const [loading, setLoading] = useState(false)

  const [openIndex, setOpenIndex] = useState(-1)
  const [openListModal, setOpenListModal] = useState(false)

  useEffect(() => {
    clickSearchByDates()
  }, [dateStart, dateEnd])

  function onSubmitUpdatePage() {
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

  function setDates(newDateStart: Date, newDateEnd: Date) {
    setDateStart(newDateStart)
    setDateEnd(newDateEnd)
  }

  function handleOpenAvatar(row: any) {
    setOpenAvatar(true)
    setOpenNameAvatar(row?.original?.name)
    setOpenUrlAvatar(row?.original?.avatarUrl)
  }

  function clickSearchByDates(dateStartField?: Date, dateEndField?: Date) {
    setLoading(true)
    if (dateStartField == null) dateStartField = dateStart
    if (dateEndField == null) dateEndField = dateEnd
    api.get<Attendances>('attendance', {
      params: {
        dateStart: dayjs(dateStartField).toISOString(),
        dateEnd: dayjs(dateEndField).toISOString()
      }, headers: {
        Authorization: getToken()
      }
    }).then(response => {
      setDates(dateStartField, dateEndField)
      var att = response.data
      if (att.length != 0) {
        var rows: any[] = []
        const dates = new Set<string>();
        var marginDates = 0
        att.map((item, index) => {
          var listDates: any = {}
          listDates['total'] = 0
          listDates['paid'] = 0
          for (let i = 0; i < item.dates.length; i++) {
            listDates[item.dates[i]] = item.paids[i] ? (item.typeDays[i] != 'HD' ? 'DP' : 'D½P') : item.typeDays[i] != 'HD' ? 'D' : 'D½'
            dates.add(item.dates[i])
            listDates['total'] = listDates['total'] + 1
            listDates['paid'] = item.paids[i] ? listDates['paid'] + 1 : listDates['paid']
          }
          marginDates = listDates['total'] > marginDates ? listDates['total'] : marginDates

          var obj = Object.assign({}, item, listDates);
          rows.push(obj)
        })
        setMarginTable(marginDates)
        setAttendances(rows)
        if (rows.length != 0) {
          var base: MRT_ColumnDef<any>[] = [{
            accessorKey: 'name',
            header: 'Dog Name',
            size: 220,
            Cell: ({ renderedCellValue, row }) => (
              <>
                <InfoItemButton children={
                  <div className="flex flex-row justify-center align-baseline cursor-pointer" onClick={() => {
                    setOpenListModal(true)
                    setOpenIndex(row.original.owner_id)
                  }}>
                    {row?.original?.['dates'].length >= 5 ?
                      <div className=" bg-purple-300 rounded-full py-1 px-3">
                        <span className="font-medium">{renderedCellValue}</span>
                      </div>
                      : row?.original?.['owner_dogs'] >= 2 ?
                        <div className=" bg-lime-300 rounded-full py-1 px-3">
                          <span className="font-medium">{renderedCellValue}</span>
                        </div>
                        :
                        <div className=" bg-stone-200 rounded-full py-1 px-3">
                          <span className="font-medium">{renderedCellValue}</span>
                        </div>

                    }
                  </div>
                } id={row.original.owner_id} onClose={() => clickSearchByDates()}>
                </InfoItemButton>
              </>
            ),
            Footer: ({ }) => <div className="">Total: </div>
          }]
          for (const item of Array.from(dates)) {
            var totalSumDays = 0
            rows.map((row) => {
              item in row ? totalSumDays++ : null
            })

            base.push(cellComponent(item, () => onSubmitUpdatePage(), totalSumDays))
          }
          setColumns(base)
        }
      } else {
        setAttendances([])
        setMarginTable(0)
        setColumns([])
      }
      setLoading(false)
    }).catch(err => {
      setLoading(false)
    })
  }


  const handleCreateNewRow = (values: any) => {
    setLoading(true)
   
    api.post('attendance', values, {
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      toast.success(`Added!`, { position: "top-center", autoClose: 1000, })
      clickSearchByDates()
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      setLoading(false)
    })
  };


  const handleCreateNewWeekRow = (values: any) => {
    setLoading(true)


    api.post('attendance/week', values, {
      headers: {
        Authorization: getToken()
      }
    }).then(response => {
      toast.success(`Added!`, { position: "top-center", autoClose: 1000, })
      clickSearchByDates()
    }).catch((err: AxiosError) => {
      const data = err.response?.data as { message: string }
      toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
      throw new Error(`${data.message || err.response?.data || err.message}`);
      setLoading(false)
    })
  };

  const handleCreateNewOwnerDog = (values: any) => {
    try {
      setLoading(true)
      values.birthdayDate = dayjs(values.birthdayDate, 'DD/MM/YYYY').toISOString()
      if (values.secondDog)
        values.secondBirthdayDate = dayjs(values.secondBirthdayDate, 'DD/MM/YYYY').toISOString()

      api.post('owners/dogs', values, {
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        toast.success(`Created Owner and Dogs!`, { position: "top-center", autoClose: 1000, })
        clickSearchByDates()
      }).catch((err: AxiosError) => {
        const data = err.response?.data as { message: string }
        toast.error(`${data.message || err.response?.data || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
        throw new Error(`${data.message || err.response?.data || err.message}`);

      })
    } catch (e) {
      toast.error(`Unidentified error`, { position: "top-center", autoClose: 5000, })
    }

  };

  return (
    <div className="md:p-10 pt-4 h-full flex flex-col items-center">
      <h3 className="font-medium text-3xl md:text-4xl lg:text-5xl text-pinkBackground font-borsok">Daycare</h3>
      <h3 className="text-white font-borsok text-lg md:text-2xl lg:text-4xl">{dateStart.toLocaleString(undefined, { weekday: "short", day: "numeric", month: 'short', year: 'numeric' })} - {dateEnd.toLocaleString(undefined, { weekday: "short", day: "numeric", month: 'short', year: 'numeric' })}</h3>
      <FilterDays
        dateStart={dateStart}
        dateEnd={dateEnd}
        setDateStart={(date) => setDateStart(date)}
        setDateEnd={(date) => setDateEnd(date)}
        onSubmitSearch={() => clickSearchByDates()}
        loading={loading}
        onPreviousWeek={() => onNextPreviousWeek(-7)}
        onNextWeek={() => onNextPreviousWeek(+7)}
        onSubmitNewRow={(values) => handleCreateNewRow(values)}
        onSubmitNewWeek={(values) => handleCreateNewWeekRow(values)}
        onSubmitOwnerDog={(values => handleCreateNewOwnerDog(values))}
      />

      <DataTableAttendance
        title={"" + dateStart.toLocaleString(undefined, { weekday: "short" }) + " " + dayjs(dateStart).format('DD/MM/YYYY') + " - " + dateEnd.toLocaleString(undefined, { weekday: "short" }) + " " + dayjs(dateEnd).format('DD/MM/YYYY')}
        attendances={attendances}
        columns={columns}
        marginTable={marginTable}
        handleCreateNewRow={handleCreateNewRow}
        handleCreateNewWeekRow={handleCreateNewWeekRow}
        loading={loading}
      />

      {openAvatar ?
        <AvatarModal
          open={openAvatar}
          onClose={() => setOpenAvatar(false)}
          avatarUrl={openUrlAvatar}
          name={openNameAvatar}
        />
        : null}


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
