import { useState } from "react";
import { CreateNewModal } from "../CreateNewModal";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import { api, getToken } from "../../lib/axios";
import { AxiosError } from "axios";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, fabClasses, Grid, Stack, TextField } from "@mui/material";
import { SelectInput } from "../SelectInput";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { CreateNewCustomer } from "./CreateNewCustomer";
import { CreateExistedCustomer } from "./CreateExistedCustomer";
import { CreateNewOffering } from "./CreateNewOffering";
import { theme, iconStyle } from "../../lib/theme";
import AddCircleRoundedIcon from '@mui/icons-material/AddCircleRounded';
import PersonSearchRoundedIcon from '@mui/icons-material/PersonSearchRounded';
import LocalOfferIcon from '@mui/icons-material/LocalOffer';


interface SearchAddBookingProps {
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
  listTimes: [{}];
  handleOffer: (values: any) => void;
  handleNewCustomer: (values: any) => void;
  handleExistedCustomer: (values: any) => void;
}

export const SearchAddBooking = ({
  open,
  onClose,
  onSubmit,
  listTimes,
  handleOffer,
  handleExistedCustomer,
  handleNewCustomer
}: SearchAddBookingProps) => {

  const [owner, setOwner] = useState<{ id: number, name: string, phone: string, dogName: string, breed: string }>()
  const [createBookModalOpen, setCreateBookModalOpen] = useState(false);
  const [createExistedModalOpen, setCreateExistedModalOpen] = useState(false);
  const [createOfferingModalOpen, setCreateOfferingModalOpen] = useState(false);

  return (
    <>
      <Dialog open={open} scroll="paper" sx={{
        "& .MuiDialog-container": {
          "& .MuiPaper-root": {
            width: "100%",
            margin: "auto",
            maxWidth: { md: '550px', lg: '700px' },
          },
        },
      }}>
        <DialogTitle textAlign="center">Search or Add Customer</DialogTitle>
        <DialogContent>

          <div>
            <SelectInput getData={(inputValue: string) => new Promise<any[]>((resolve, reject) => {
              api.get('booking/select', { params: { name: inputValue }, headers: { Authorization: getToken() } }).then(response => {
                var data = response.data
                var listData: any[] = []
                data.forEach((element: any) => {
                  listData.push({ element: element, value: element.id, label: `${element.Owner.name} - ${element.Owner.phoneOne} - ${element.name} - ${element.breed}` })
                });
                resolve(listData)
              }).catch((err: AxiosError) => {
                const data = err.response?.data as { message: string }
                toast.error(`${data.message || err.message}`, { position: "top-center", autoClose: 5000, })
                throw new Error(`${data.message || err.response?.data || err.message}`);
              })
            })} onChangeSelect={(value) => {
              console.log(value)
              setOwner({
                id: value.element.Owner.id,
                name: value.element.Owner.name,
                phone: value.element.Owner.phoneOne,
                dogName: value.element.name,
                breed: value.element.breed
              })
            }} />
          </div>
          <div className="flex flex-row h-10">
            {
              owner == null ? null :
                <div className="mt-5">
                  <span className="mr-2"><CheckCircleIcon color="success" /></span>
                  <span className="mr-4 font-medium">Info:</span>
                  <span className="mr-4">{owner.name}</span>
                  <span className="mr-4">{owner.phone}</span>
                  <span className="mr-4">{owner.dogName}</span>
                  <span className="">{owner.breed}</span>
                </div>
            }
          </div>
          <div className="mt-8 flex flex-row justify-around text-center align-middle font-medium">
            <div className="flex flex-row mx-3 cursor-pointer" onClick={() => setCreateOfferingModalOpen(true)}>
              <LocalOfferIcon sx={iconStyle} />
              <div className="ml-2 mt-2">Offer</div>
            </div>
            {/*<div className="mx-3 ">
                        <EditIcon sx={iconStyle}/>
                      </div>*/}
            <div className="flex flex-row mx-3 cursor-pointer" onClick={() => setCreateBookModalOpen(true)}>
              <AddCircleRoundedIcon sx={iconStyle} />
               <div className="ml-2 mt-2">New</div>
            </div>
            <div className="flex flex-row mx-3 cursor-pointer" onClick={() => setCreateExistedModalOpen(true)}>
              <PersonSearchRoundedIcon sx={iconStyle} />
              <div className="ml-2 mt-2">Listed</div>
            </div>
          </div>
          {createBookModalOpen ?
            <CreateNewCustomer
              key={"NewCustomerKey"}
              onClose={() => {
                setCreateBookModalOpen(false)
                onClose()
              }}
              onSubmit={(values) => handleNewCustomer(values)}
              open={createBookModalOpen}
              listTimes={listTimes} /> : null
          }
          {createExistedModalOpen ?
            <CreateExistedCustomer
              key={"ExistedCustomerKey"}
              onClose={() => {
                setCreateExistedModalOpen(false)
                onClose()
              }}
              onSubmit={(values) => handleExistedCustomer(values)}
              open={createExistedModalOpen}
              inputValue={owner != null ? owner?.phone : null}
              listTimes={listTimes} /> : null
          }
          {createOfferingModalOpen ?
            <CreateNewOffering
              key={"OfferingCustomerKey"}
              onClose={() => {
                setCreateOfferingModalOpen(false)
                onClose()
              }}
              onSubmit={(values) => handleOffer(values)}
              open={createOfferingModalOpen}
              inputValue={owner != null ? owner?.phone : null}
              listTimes={listTimes}
            /> : null
          }
        </DialogContent>
        <DialogActions sx={{ p: '1.25rem' }}>
          <Button onClick={() => onClose()} >Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}