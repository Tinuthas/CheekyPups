import { ThemeProvider } from "@mui/material/styles";
import { theme, iconSmallStyle } from "../../lib/theme";
import clsx from 'clsx'
import { useState } from "react";
import MaterialReactTable, { MRT_ColumnDef } from "material-react-table";
import Box from '@mui/material/Box';
import { Add } from '@mui/icons-material';
import { IconButton } from "@mui/material";
import ViewWeekIcon from '@mui/icons-material/ViewWeek';
import { CreateNewModal } from "../../components/CreateNewModal";
import { AxiosError } from "axios";
import { toast } from "react-toastify";
import { api, getToken } from "../../lib/axios";
import dayjs from "dayjs";
import { Loading } from "../Loading";
import { CreateNewAttendance } from "./CreateNewAttendance";
import { CreateWeekRow } from "./CreateWeekRow";


interface AttendanceTableProps {
  title: string,
  attendances: any[],
  columns: any[],
  marginTable: number,
  loading: boolean,
  handleCreateNewRow: (values: any) => void
  handleCreateNewWeekRow: (values: any) => void
}

export function DataTableAttendance({ title, attendances, columns, marginTable, handleCreateNewRow, loading, handleCreateNewWeekRow }: AttendanceTableProps) {

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [createWeekModalOpen, setCreateWeekModalOpen] = useState(false)

  return (
    <ThemeProvider theme={theme}>
      <div className={clsx('w-full mt-9 transition-all ', {
        'md:px-28 lg:px-56 xl:flex xl:justify-center': marginTable == 0,
        'md:px-16 lg:px-48 xl:flex xl:justify-center': marginTable == 1,
        'md:px-20 lg:px-36 xl:flex xl:justify-center': marginTable == 2,
        'md:px-16 lg:px-44 xl:flex xl:justify-center': marginTable == 3,
        'md:px-12 lg:px-40 xl:px-16': marginTable == 4,
        'md:px-8 lg:px-24 xl:px-0 desktop:px-8': marginTable == 5,
        'px-0': marginTable >= 5,
      })}>
        {loading ? <div className="w-full flex justify-center"><Loading /> </div> :
          <div className="bg-white rounded">

            <MaterialReactTable
              columns={columns as MRT_ColumnDef<(typeof attendances)[0]>[]}
              data={attendances}
              renderTopToolbarCustomActions={() => (
                <Box sx={{ fontSize: 16, fontWeight: 'medium', paddingTop: 0, paddingLeft: 1 }}>
                 
                  <div className="flex flex-row">
                     <span className="mt-1">{title}</span>
                    <div className="ml-6 mt-[2px]" onClick={() => {
                      setCreateWeekModalOpen(true)
                    }}>
                      <ViewWeekIcon sx={iconSmallStyle} />
                    </div>
                    <div className="ml-4 mt-[2px]" onClick={() => {
                      setCreateModalOpen(true)
                    }}>
                      <Add sx={iconSmallStyle} />
                    </div>
                  </div>

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



          </div>
        }
        {createModalOpen ?
          <CreateNewAttendance
            open={createModalOpen}
            onClose={() => setCreateModalOpen(false)}
            onSubmit={(values) => handleCreateNewRow(values)}
          />
          : null}
        {createWeekModalOpen ?
          <CreateWeekRow
            open={createWeekModalOpen}
            onClose={() => setCreateWeekModalOpen(false)}
            onSubmit={(values) => handleCreateNewWeekRow(values)}
          />
          : null}
      </div>

    </ThemeProvider>
  )
}