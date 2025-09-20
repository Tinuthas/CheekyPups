import { ThemeProvider } from "@mui/material/styles";
import { theme } from "../lib/theme";
import clsx from 'clsx'
import { useState } from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import Box from '@mui/material/Box';
import { Add } from '@mui/icons-material';
import { IconButton } from "@mui/material";
import { CreateNewModal } from "../components/CreateNewModal";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import {api, getToken} from "../lib/axios";
import dayjs from "dayjs";
import {Loading} from "./Loading";

const HALFDAY = import.meta.env.VITE_HALFDAY
const FULLDAY = import.meta.env.VITE_FULLDAY
const FULLWEEK = import.meta.env.VITE_FULLWEEK
const SECONDDOG = import.meta.env.VITE_SECONDDOG

interface AttendanceTableProps {
  attendances: any[],
  columns: any[],
  marginTable: number,
  loading: boolean,
  handleCreateNewRow: (values:any) => void
}

export function DataTableAttendance({attendances, columns, marginTable, handleCreateNewRow, loading}:AttendanceTableProps) {

  const [createModalOpen, setCreateModalOpen] = useState(false);

  const [valueField, setValueField] = useState(FULLDAY)
  const [dateValueField, setDateValueField] = useState(new Date());
  const [descriptionField, setDescriptionField] = useState(`DAYCARE - ${dayjs(dateValueField).format('DD/MM/YYYY')}`)

  function setDateAndDescription(newDate: Date) {
    const newDescription = descriptionField.replace(dayjs(dateValueField).format('DD/MM/YYYY'), dayjs(newDate).format('DD/MM/YYYY'))
    setDescriptionField(newDescription)
    setDateValueField(newDate)
  }

  function selectRadioTypeValue(value: any) {
    switch (value) {
      case 'FD': 
        setValueField(FULLDAY)
        break;
      case 'HD': 
        setValueField(HALFDAY)
        break;
      case 'FW': 
        setValueField(FULLWEEK)
        break;
      case 'SD': 
        setValueField(SECONDDOG)
        break;
    }
  }

  return (
    <ThemeProvider theme={theme}>
        <div className={clsx('w-full mt-9 transition-all ', {
          'md:px-28 lg:px-56 xl:flex xl:justify-center': marginTable == 0,
          'md:px-16 lg:px-48 xl:flex xl:justify-center': marginTable == 1,
          'md:px-20 lg:px-36 xl:flex xl:justify-center': marginTable == 2,
          'md:px-16 lg:px-44 xl:flex xl:justify-center': marginTable == 3,
          'md:px-12 lg:px-40 xl:px-16': marginTable == 4,
          'md:px-8 lg:px-24 xl:px-0 desktop:px-8': marginTable == 5,
          'px-0' : marginTable >= 5,
        })}>
          { loading ? <div className="w-full flex justify-center"><Loading /> </div> :
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
            muiTableFooterCellProps={{
              sx: {
                flex: '0 0 auto',
              },
            }}
            initialState={{ pagination: { pageSize: 50, pageIndex: 0 } }}
            muiTablePaginationProps={{
              rowsPerPageOptions: [50, 100, 150],
              showFirstButton: false,
              showLastButton: false,
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
                        listData.push({value: element.id, label: `${element.name} ${element.nickname != null ?'- '+ element.nickname : ''}`})
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
                  setValue: (value) => setDateAndDescription(value),
                },
                {
                  accessorKey: 'typeDay',
                  label: 'Type Day',
                  name: 'Type Day',
                  type: "radio",
                  value: "FD",
                  radioListValues: [
                    {key: "fullDay", value: "FD", label: "Full Day"},
                    {key: "halfDay", value: "HD", label: "Half Day"},
                    {key: "fullWeek", value: "FW", label: "Full Week"},
                    {key: "secondDog", value: "SD", label: "Second Dog"}
                  ],
                  setValue: (value) => selectRadioTypeValue(value),
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
                  value: descriptionField,
                  setValue: (value) => setDescriptionField(value),
                }]}
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={handleCreateNewRow}
          />: null
          }
        </div>
        } 
        </div>
      
      </ThemeProvider>
  )
}