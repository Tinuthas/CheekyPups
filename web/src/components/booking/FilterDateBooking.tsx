
import { ThemeProvider } from "@mui/material/styles";
import { theme, iconStyle } from "../../lib/theme";
import NextIcon from '@mui/icons-material/SkipNextRounded';
import PreviousIcon from '@mui/icons-material/SkipPreviousRounded';
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';
import ManageAccountsRoundedIcon from '@mui/icons-material/ManageAccountsRounded';
import EditIcon from '@mui/icons-material/Edit';
import FormatAlignJustifyIcon from '@mui/icons-material/FormatAlignJustify';
import AccessAlarmRoundedIcon from '@mui/icons-material/AccessAlarmRounded';
import { ButtonLight } from "../ButtonLight";
import { ChooseDateButton } from "../ChooseDate";

interface FilterDateBookingProps {
  date: Date
  setDate: (value: Date) => void
  loading: boolean
  setLoading: (value: boolean) => void,
  onPreviousDate: () => void
  onNextDate: () => void
  addEventClick: () => void
  addBookClick: () => void
  addFillClick: () => void
  addExistedClick: () => void
  addOfferingClick: () => void
}

export function FilterDateBooking({ date, setDate, loading, setLoading, onPreviousDate, onNextDate, addEventClick, addBookClick, addFillClick, addExistedClick, addOfferingClick }: FilterDateBookingProps) {

  return (
    <div className="md:flex justify-center items-center md:mt-4">
      <ThemeProvider theme={theme}>
        <div className="flex justify-center items-center bg-white rounded-3xl">
          <div className="border-2 rounded-full border-neutral-500 mx-3 hover:border-pinkBackground" onClick={onPreviousDate}>
            <PreviousIcon sx={iconStyle} />
          </div>
          <ChooseDateButton label={"Choose Date"} date={date} setDate={date => setDate(new Date(date))} />
          <div className="border-2 rounded-full border-neutral-500 mx-3 hover:border-pinkBackground" onClick={onNextDate}>
            <NextIcon sx={iconStyle} />
          </div>
        </div>
        <div className="flex flex-row justify-around w-auto h-14 mt-4 md:mt-0 md:ml-8 bg-white rounded-3xl p-3">
          <div className="mx-3 " onClick={addEventClick}>
            <AccessAlarmRoundedIcon sx={iconStyle}/>
          </div>
          <div className="mx-3 " onClick={addFillClick}>
            <FormatAlignJustifyIcon sx={iconStyle}/>
          </div>
          <div className="mx-3 " onClick={addOfferingClick}>
            <LocalOfferIcon sx={iconStyle}/>
          </div>
          <div className="mx-3 ">
            <EditIcon sx={iconStyle}/>
          </div>
          <div className="mx-3 " onClick={addBookClick}>
            <AddCircleRoundedIcon sx={iconStyle}/>
          </div>
          <div className="mx-3 " onClick={addExistedClick}>
            <PersonSearchRoundedIcon sx={iconStyle}/>
          </div>
        </div>
      </ThemeProvider>



    </div>
  )
}

/**
 * 
 * <div className="flex flex-row justify-around">
        <ButtonLight text={"Space"} onClick={addEventClick} style={"w-[90px]"}/>
        <ButtonLight text={"Fill"} onClick={addFillClick} style={"w-[90px]"}/>
        <ButtonLight text={"New"} onClick={addBookClick} style={"w-[90px]"}/>
        <ButtonLight text={"Existed"} onClick={addExistedClick} style={"w-[90px]"}/>
      </div>
 */