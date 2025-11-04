import MenuItemCustomBooking from "./MenuItemCustomBooking"
import { ThemeProvider } from "@mui/material/styles";
import { theme, iconStyle, iconSmallStyle } from "../../lib/theme";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';
import PhoneIcon from '@mui/icons-material/Phone';
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import { DeleteModal } from "../DeleteModal";
import { CancelModal } from "../CancelModal";
import { CreateConfirmedOffering } from "./CreateConfirmedOffering";
import { CreateFinish } from "./CreateFinish";
import { PaysInfoListModal } from "../payment/PaysInfoListModal";
import InfoItemButton from "../attendance/InfoItemButton";
import { EditOwnerNotes } from "./EditOwnerNotesModal";



export interface ItemListFieldProps {
  id: number
  time: string
  status: string
  ownerId?: number
  ownerName?: string
  phone?: string
  dogId?: number
  dogName?: string
  dogBread?: string
  notes?: string
  loadingMenuItem: number
  listTimes: [{}]
  date:string
  deleteRow: (id: number) => void
  cancelBookingRow: (id: number) => void
  createRowOffered: (values: any) => void
  finishRowBooking: (values: any) => void
  editNotesBooking: (values: any) => void
  setLoadingMenuItem: (loading: number) => void
}

export function ItemListField({ id, time, status, ownerId, dogId, ownerName, phone, dogName, dogBread, notes, loadingMenuItem, listTimes, createRowOffered, setLoadingMenuItem, deleteRow, cancelBookingRow, finishRowBooking, editNotesBooking, date }: ItemListFieldProps) {

  const [openDelete, setOpenDelete] = React.useState(false);
  const [createOfferedModalOpen, setCreateOfferedModalOpen] = React.useState(false);
  const [cancelModalOpen, setCancelModalOpen] = React.useState(false);
  const [finishModalOpen, setFinishModalOpen] = React.useState(false);
  const [editNotesModalOpen, setEditNotesModalOpen] = React.useState(false);

  const [openIndex, setOpenIndex] = React.useState(-1)
  const [openListModal, setOpenListModal] = React.useState(false)


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

  const handleEditNotes = (values: any) => {
    setEditNotesModalOpen(false)
    editNotesBooking(values)
  }

  return (
    <>
      <div key={String(id)} className={`group h-20 w-fit mt-4 shadow border border-neutral-300 rounded-xl text-neutral-800 flex flex-row self-center hover:border-neutral-400 sm::text-base md:text-base lg:text-base transition-all transition-discrete delay-150 duration-300 ease-in-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-xl ${!status.includes('empty') && notes!=null && notes!='' ? 'hover:h-32': ''}`}
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
                    <div className="bg-[#0047AB] w-full h-full rounded-bl-xl rounded-tl-xl" />
                    : null
          }
        </span>
        <div>

        
        <div className="p-4 h-20 flex flex-row self-center">
          <div className="self-center w-[100px]">
            <h5>{time}</h5>
          </div>
          <div className="w-[120px] ml-2 md:ml-6 self-center text-center">
            {ownerId!= null && ownerId != 0 ? 
              <InfoItemButton children={<h5 className="p-7">{ownerName}</h5>} id={Number(ownerId)} onClose={() => {}}/>
            : <h5 className="p-10">{ownerName}</h5>}
            
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
          <div className="w-[100px] ml-2 md:ml-6 self-center ">
            <ThemeProvider theme={theme} >
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
                  <button onClick={() => setEditNotesModalOpen(true)}>
                    <EditIcon sx={iconSmallStyle} />
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
                    notes: notes != null && notes != "" ? notes : "",
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
                    notes: notes != null && notes != "" ? notes : "",
                  }} /> : null
              }
              {editNotesModalOpen ?
                <EditOwnerNotes
                  key={"EditNotesModal"}
                  onClose={() => {
                    setEditNotesModalOpen(false);
                  }}
                  onSubmit={(values) => handleEditNotes(values)}
                  open={editNotesModalOpen}
                  ownerDog={{
                    owner: ownerName != null && ownerName != "" ? ownerName : "",
                    phone: phone != null && phone != "" ? phone : "",
                    id: Number(dogId),
                    bookingId: Number(id),
                    dogName: dogName != null && dogName != "" ? dogName : "",
                    breed: dogBread != null && dogBread != "" ? dogBread : "",
                    notes: "",
                  }} /> : null
              }
            </ThemeProvider>
          </div>
        </div>
        {status !== 'empty' && notes!=null && notes!='' ?
          <div className="px-4 flex flex-row self-center group-hover:transition-all group-hover:delay-300 ease-in invisible group-hover:visible">
            <div className="self-center mr-5">
              <h5 className="">Notes:</h5>
            </div>
            <div className="">
              <h5 className="">{notes}</h5>
            </div>
        </div>
        : null}
        
        </div>
      </div>
       
    </>

  )
}