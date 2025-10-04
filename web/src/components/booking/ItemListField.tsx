import MenuItemCustomBooking from "./MenuItemCustomBooking"
import { ThemeProvider } from "@mui/material/styles";
import { theme, iconStyle } from "../../lib/theme";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import React from "react";
import { DeleteModal } from "../DeleteModal";



export interface ItemListFieldProps {
  id: number
  time: String
  status: String
  ownerName?: String
  phone?: String
  dogName?: String
  dogBread?: String
  loadingMenuItem: number
  deleteRow: (id: number) => void
  setLoadingMenuItem: (loading: number) => void
}

export function ItemListField({ id, time, status, ownerName, phone, dogName, dogBread, loadingMenuItem, setLoadingMenuItem, deleteRow }: ItemListFieldProps) {

  const [openDelete, setOpenDelete] = React.useState(false);



  const handleDeleteClose = (event: Event | React.SyntheticEvent) => {
    setOpenDelete(false)
    deleteRow(id)
  }

  return (
    <>
      <div key={String(id)} className="h-20 w-fit mt-4 border border-neutral-300 rounded text-neutral-800 flex flex-row self-center hover:border-neutral-800 md:text-lg transition delay-300 duration-300"
        onClick={() => setLoadingMenuItem(id)}>
        <div className="w-[10px] h-full">
          {status === 'empty' ?
            <div className="bg-neutral-400 w-full h-full rounded-bl rounded-tl" />
            : status === 'confirmed' ?
              <div className="bg-green-500 w-full h-full rounded-bl rounded-tl" />
              : status === 'cancelled' ?
                <div className="bg-red-600 w-full h-full rounded-bl rounded-tl" />
                : status === 'offered' ?
                  <div className="bg-yellow-400 w-full h-full rounded-bl rounded-tl" />
                  : null
          }
        </div>
        <div className="p-4 flex flex-row self-center">
          <div className="self-center w-[100px]">
            <h5>{time}</h5>
          </div>
          <div className="w-[120px] ml-2 md:ml-6 self-center">
            <h5>{ownerName}</h5>
          </div>
          <div className="w-[120px] ml-2 md:ml-6 self-center">
            <h5>{phone}</h5>
          </div>
          <div className="w-[120px] ml-2 md:ml-6 self-center">
            <h5>{dogName}</h5>
          </div>
          <div className="w-[120px] ml-2 md:ml-6 self-center">
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
              {status === 'empty' ?
                <div className="flex flex-row justify-around">
                  <div>
                    <AddIcon fontSize="small" />
                  </div>
                  <button onClick={() => setOpenDelete(true)}>
                    <DeleteIcon fontSize="small" />
                  </button>
                </div>
                : null}
            </ThemeProvider>
          </div>
        </div>
        {openDelete ?
          <DeleteModal
            open={openDelete}
            onClose={() => setOpenDelete(false)}
            onSubmit={handleDeleteClose}
          /> : null
        }

      </div>
    </>

  )
}