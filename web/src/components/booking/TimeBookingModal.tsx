import { BoxProps, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import DataTableCustom from "../DataTableCustom";
import { Loading } from "../../components/Loading";
import { api, getToken } from "../../lib/axios"
import { AxiosError } from "axios"
import { toast } from "react-toastify"
import { MRT_ColumnDef } from "material-react-table";
import dayjs from "dayjs";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { ThemeProvider } from "@mui/material";
import { theme, iconStyle, iconSmallStyle } from "../../lib/theme";
import isTomorrow from 'dayjs/plugin/isTomorrow'
import { CreateNewModal } from "../CreateNewModal";
dayjs.extend(isTomorrow)


interface TimeBookingModalProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  bookingId: number;
  time: string;
}

export const TimeBookingModal = ({
  open,
  onClose,
  bookingId,
  time,
  onSubmit
}: TimeBookingModalProps) => {

  const [loading, setLoading] = useState(false)
  const [newTime, setNewTime] = useState(time)

  useEffect(() => {
    //callInit()
  }, [])

  return (
    <>
      <ThemeProvider theme={theme}>
        <CreateNewModal
          key={"TimeBookingModal"}
          title="Edit Time"
          columns={[

            {
              accessorKey: 'id',
              label: '',
              name: '',
              type: "number",
              value: bookingId,
              noEdit: true,
              noShow: true,
              gridXS: 12, gridMS: 12,
            },
            {
              accessorKey: 'date',
              label: 'Date',
              name: '',
              type: "date",
              value: newTime,
              setValue: (value) => setNewTime(value),
            },
            {
              accessorKey: 'time',
              label: 'Time',
              name: '',
              type: "time",
              value: newTime,
              setValue: (value) => setNewTime(value),
            }
          ]}
          open={open}
          onClose={() => onClose()}
          onSubmit={() => onSubmit({id: bookingId, date: newTime})}
          //grid={true}
        />
      </ThemeProvider>
    </>
  )
}

function handlePayments(arg0: string) {
  throw new Error("Function not implemented.");
}
