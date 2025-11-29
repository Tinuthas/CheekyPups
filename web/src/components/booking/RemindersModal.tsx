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
dayjs.extend(isTomorrow)


interface RemindersModalProps {
  onClose: (e: Event | React.SyntheticEvent<Element, Event>) => void;
  open: boolean;
  infoData: { ownerId: number, bookingId: number },
}

export const RemindersModal = ({
  open,
  onClose,
  infoData
}: RemindersModalProps) => {

  const [loading, setLoading] = useState(false)
  const [owner, setOwner] = useState<any>(null)
  const [reminder, setReminder] = useState("")

  useEffect(() => {
    callInit()
  }, [])

  function callInit() {
    setLoading(true)

    try {
      api.get('booking/reminders', {
        params: {
          id: infoData.ownerId,
          bookingId: infoData.bookingId,
        },
        headers: {
          Authorization: getToken()
        }
      }).then(response => {
        var listResponde = JSON.parse(JSON.stringify(response.data))
        console.log(listResponde)
        setOwner(listResponde.owner)

        try {
          var formatedReminder: string = listResponde.reminder
          formatedReminder = formatedReminder.replaceAll('\\n', '\n')
          formatedReminder = formatedReminder.replaceAll('[dog]', listResponde.dogsTime > 1 ? 'dogs are' : 'dog is')
          formatedReminder = formatedReminder.replaceAll('[time]', `${dayjs(listResponde.booking.time).isTomorrow() ? 'tomorrow ':''}on ${dayjs(listResponde.booking.time).format('dddd DD MMM')} at ${dayjs(listResponde.booking.time).format('hh:mm A')}`)

          setReminder(formatedReminder)
        } catch (e) {
          toast.error(`Error formatting reminder`, { position: "top-center", autoClose: 5000, })
          setLoading(false)
        }

        setLoading(false)
      }).catch((err: AxiosError) => {
        const data = err.response?.data as { message: string }
        toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
        setLoading(false)
      })
    } catch (e) {
      toast.error(`Error in getting reminder`, { position: "top-center", autoClose: 5000, })
    }


  }

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Dialog
          open={open}
          onClose={onClose}
          sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                margin: "auto",
                maxWidth: "1200px",  // Set your width here
              },
            },
          }}>
          <DialogTitle id="responsive-dialog-title">
            {`Reminders`}
          </DialogTitle>
          <DialogContent>
            {loading ? <div className="w-full flex justify-center"><Loading /> </div> :
              <>
                <div key='ReminderInfoList' className="w-full text-sm md:text-base text-neutral-700">
                  {owner != null ?
                    <div key='infoOwner' className="flex flex-col p-3 border-2 border-neutral-200 rounded-3xl">
                      <div className="flex flex-col mb-3 px-2">
                        <div className="flex flex-col md:flex-row">
                          <div className="md:w-80 md:mt-1">
                            <span className="font-semibold mt-1 ">Owner: </span>
                            <span>{owner.name}</span>
                          </div>
                          <div className="md:ml-5 md:w-80 mt-1 ">
                            <span className="font-semibold">Second Owner: </span>
                            <span>{owner.secondOwner}</span>
                          </div>
                        </div>
                        <div className="flex flex-col md:flex-row mt-1 ">
                          <div className="md:w-80">
                            <span className="font-semibold">Phone: </span>
                            <span>{owner.phoneOne}</span>
                          </div>
                          <div className="md:ml-5 md:w-80 mt-1 ">
                            <span className="font-semibold">Second Phone: </span>
                            <span>{owner.phoneTwo != null && owner.phoneTwo != undefined ? owner.phoneTwo : ""}</span>
                          </div>
                        </div>
                        <div className="mt-1">
                          <span className="font-semibold">Notes: </span>
                          <span>{owner.notes != null && owner.notes != undefined ? owner.notes : ""}</span>
                        </div>
                      </div>


                    </div>
                    : null}
                  {reminder != null && reminder != "" ?
                    <div key='infoReminder' className="flex flex-col mt-5 md:m-10 p-5 border-2 border-neutral-200 rounded-3xl">
                      <p className="whitespace-pre-wrap">
                        {reminder}
                      </p>
                    </div>
                    : null}
                </div>
              </>
            }
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={onClose}>
              Back
            </Button>
          </DialogActions>
        </Dialog>
      </LocalizationProvider>
    </ThemeProvider>
  )
}

function handlePayments(arg0: string) {
  throw new Error("Function not implemented.");
}
