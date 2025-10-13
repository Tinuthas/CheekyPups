import MenuItemCustomBooking from "./MenuItemCustomBooking"
import { ThemeProvider } from "@mui/material/styles";
import { theme, iconStyle, iconSmallStyle } from "../../lib/theme";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import { DeleteModal } from "../DeleteModal";
import { CancelModal } from "../CancelModal";
import { CreateConfirmedOffering } from "./CreateConfirmedOffering";
import { CreateFinish } from "./CreateFinish";



export interface ItemListFieldProps {
  id: number
  time: string
  status: string
  ownerName?: string
  phone?: string
  dogName?: string
  dogBread?: string
  loadingMenuItem: number
  listTimes: [{}]
  date:string
  deleteRow: (id: number) => void
  cancelBookingRow: (id: number) => void
  createRowOffered: (values: any) => void
  finishRowBooking: (values: any) => void
  setLoadingMenuItem: (loading: number) => void
}

export function ItemListField({ id, time, status, ownerName, phone, dogName, dogBread, loadingMenuItem, listTimes, createRowOffered, setLoadingMenuItem, deleteRow, cancelBookingRow, finishRowBooking, date }: ItemListFieldProps) {

  const [openDelete, setOpenDelete] = React.useState(false);
  const [createOfferedModalOpen, setCreateOfferedModalOpen] = React.useState(false);
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [finishModalOpen, setFinishModalOpen] = React.useState(false);


  const handleDeleteClose = (event: Event | React.SyntheticEvent) => {
    setOpenDelete(false)
    deleteRow(id)
  }

  const handleCreateOfferedCustomer = (values: any) => {
    setCreateOfferedModalOpen(false)
    createRowOffered(values)
  }

  const handleCancelClose = (event: Event | React.SyntheticEvent) => {
    setCancelModalOpen(false)
    cancelBookingRow(id)
  }

  const handleFinishBooking = (values: any) => {
    setFinishModalOpen(false)
    finishRowBooking(values)
  }

  return (
    <>
      <div key={String(id)} className="h-20 w-fit mt-4 border border-neutral-300 rounded-xl text-neutral-800 flex flex-row self-center hover:border-neutral-500 hover:border-2 sm::text-base md:text-base lg:text-lg transition delay-300 duration-300"
        onClick={() => setLoadingMenuItem(id)}>
        <span className="w-[16px] h-full ">
          {status === 'empty' ?
            <div className="bg-neutral-400 w-full h-full rounded-bl-xl rounded-tl-xl" />
            : status === 'confirmed' ?
              <div className="bg-green-500 w-full h-full rounded-bl-xl rounded-tl-xl" />
              : status.includes('cancelled') ?
                <div className="bg-red-600 w-full h-full rounded-bl-xl rounded-tl-xl " />
                : status.includes('offered') ?
                  <div className="bg-yellow-500 w-full h-full rounded-bl-xl rounded-tl-xl" />
                  : status.includes('done') ?
                    <div className="bg-cyan-500 w-full h-full rounded-bl-xl rounded-tl-xl" />
                    : null
          }
        </span>
        <div className="p-4 flex flex-row self-center">
          <div className="self-center w-[100px]">
            <h5>{time}</h5>
          </div>
          <div className="w-[120px] ml-2 md:ml-6 self-center text-center">
            <h5>{ownerName}</h5>
          </div>
          <div className="w-[120px] ml-2 md:ml-6 self-center text-center">
            <h5>{phone}</h5>
          </div>
          <div className="w-[120px] ml-2 md:ml-6 self-center text-center">
            <h5>{dogName}</h5>
          </div>
          <div className="w-[120px] ml-2 md:ml-6 self-center text-center">
            <h5>{dogBread}</h5>
          </div>
          <div className="w-[80px] ml-2 md:ml-6 self-center ">
            <ThemeProvider theme={theme} >
              {/**<MenuItemCustomBooking 
                children={
                  <MoreVertIcon />
                }
                handleDelete={(id) => {}}
                handleEdit={(id) => {}}
                id={id}
                getBooking={(id) => {}}
                editData={[]}
              />*/}

              <div className="flex flex-row justify-around">

                {status === 'empty' || status.includes('offered') ?
                  <button onClick={() => setOpenDelete(true)}>
                    <DeleteIcon sx={iconSmallStyle} />
                  </button>
                  : null}
                {status.includes('offered') ?
                  <button onClick={() => setCreateOfferedModalOpen(true)}>
                    <PersonSearchRoundedIcon sx={iconSmallStyle} />
                  </button>
                  : null}
                {status.includes('confirmed') ?
                  <button onClick={() => setCancelModalOpen(true)}>
                    <CancelOutlinedIcon sx={iconSmallStyle} />
                  </button>
                  : null}
                {status.includes('confirmed') ?
                  <button onClick={() => setFinishModalOpen(true)}>
                    <CheckCircleOutlinedIcon sx={iconSmallStyle} />
                  </button>
                  : null}
              </div>
              {createOfferedModalOpen ?
                <CreateConfirmedOffering
                  key={"NewOfferedCustomerKey"}
                  onClose={() => {
                    setCreateOfferedModalOpen(false);
                  }}
                  onSubmit={(values) => handleCreateOfferedCustomer(values)}
                  open={createOfferedModalOpen}
                  listTimes={listTimes}
                  ownerSearch={{
                    search: phone != null && phone != "" ? phone : ownerName != null && ownerName != "" ? ownerName : "",
                    owner: ownerName != null && ownerName != "" ? ownerName : "",
                    phone: phone != null && phone != "" ? phone : "",
                    time: time,
                    id: id,
                  }} /> : null
              }
              {openDelete ?
                <DeleteModal
                  open={openDelete}
                  onClose={() => setOpenDelete(false)}
                  onSubmit={handleDeleteClose}
                /> : null
              }
              {cancelModalOpen ?
                <CancelModal
                  open={cancelModalOpen}
                  onClose={() => setCancelModalOpen(false)}
                  onSubmit={handleCancelClose}
                /> : null}

              {finishModalOpen ?
                <CreateFinish
                  key={"BookingFinishKey"}
                  onClose={() => {
                    setFinishModalOpen(false);
                  }}
                  onSubmit={(values) => handleFinishBooking(values)}
                  open={finishModalOpen}
                  ownerDog={{
                    owner: ownerName != null && ownerName != "" ? ownerName : "",
                    phone: phone != null && phone != "" ? phone : "",
                    time: time,
                    id: id,
                    dogName: dogName != null && dogName != "" ? dogName : "",
                    breed: dogBread != null && dogBread != "" ? dogBread : "",
                    date: date,
                  }} /> : null
              }
            </ThemeProvider>
          </div>
        </div>


      </div>
    </>

  )
}