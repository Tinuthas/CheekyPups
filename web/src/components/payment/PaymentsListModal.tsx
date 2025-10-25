import { BoxProps, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import DataTableCustom from "../DataTableCustom";
import {Loading} from "../../components/Loading";

interface ListModalProps {
  onClose: () => void;
  onSubmit: (value: any) => void;
  open: boolean;
  name: string;
  callInit: () => any;
  data: any[];
  setData: (data:object[]) => void,
  headers: object[],
  loading: boolean,
  deleteRow?:(id:number) => Promise<any>,
  updateRow?:(data:object) => Promise<any>,
  ownerObj: any,
}

export const DialogListModal = ({
  open,
  onClose,
  onSubmit,
  name,
  callInit,
  data, 
  setData,
  headers,
  loading,
  deleteRow,
  updateRow,
  ownerObj
}: ListModalProps) => {

  useEffect(() => {
    callInit()
  }, [])

  const [owner, setOwner] = useState<any>(ownerObj)

  return (
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
        {`Info ${name}`}
      </DialogTitle>
      <DialogContent>
      { loading ? <div className="w-full flex justify-center"><Loading /> </div> :
        <>
          <div className="w-full text-base">
              {owner != null ? 
                <div className="flex flex-col mt-3 mb-3">
                  <div className="flex flex-col mb-3">
                    <div className="flex flex-row">
                      <div className="w-60 md:w-80">
                        <span className="font-semibold">Owner: </span>
                        <span>{owner.name}</span>
                      </div>
                      <div className="ml-5 w-60 md:w-80">
                        <span className="font-semibold">Second Owner: </span>
                        <span>{owner.secondOwner}</span>
                      </div>
                    </div>
                    <div className="flex flex-row mt-2">
                      <div className="w-60 md:w-80">
                        <span className="font-semibold">Phone: </span>
                        <span>{owner.phoneOne}</span>
                      </div>
                      <div className="ml-5 w-60 md:w-80">
                        <span className="font-semibold">Second Phone: </span>
                        <span>{owner.phoneTwo != null && owner.phoneTwo != undefined ? owner.phoneTwo : ""}</span>
                      </div>
                    </div>
                    <div className="flex flex-row mt-2">
                      <div className="w-60 md:w-80">
                        <span className="font-semibold">Email: </span>
                        <span>{owner.email != null && owner.email != undefined ? owner.email : ""}</span>
                      </div>
                      <div className="ml-5 w-60 md:w-80">
                        <span className="font-semibold">Address: </span>
                        <span>{owner.address != null && owner.address != undefined ? owner.address : ""}</span>
                      </div>
                    </div>
                    <div className="mt-2">
                      <span className="font-semibold">Notes: </span>
                      <span>{owner.notes != null && owner.notes != undefined ? owner.notes : ""}</span>
                    </div>
                  </div>
                  {owner.dogs.map((dog:any) => (
                    <>
                      <div className="flex flex-col mt-4">
                        <div className="flex flex-row">
                          <div className="w-40 md:w-60">
                            <span className="font-semibold">Dog: </span>
                            <span>{dog.name}</span>
                          </div>
                          <div className="ml-5 w-40 md:w-60">
                            <span className="font-semibold">Breed: </span>
                            <span>{dog.breed}</span>
                          </div>
                        </div>  
                         <div className="flex flex-row mt-2">
                          <div className="w-40 md:w-60">
                            <span className="font-semibold">Nickname: </span>
                            <span>{dog.nickname != null && dog.nickname != undefined ? dog.nickname : ""}</span>
                          </div>
                          <div className="ml-5 w-40 md:w-60">
                            <span className="font-semibold">Gender: </span>
                            <span>{dog.gender != null && dog.gender != undefined ? dog.gender : ""}</span>
                          </div>
                          <div className="ml-5 w-40 md:w-60">
                            <span className="font-semibold">Colour: </span>
                            <span>{dog.colour != null && dog.colour != undefined ? dog.colour : ""}</span>
                          </div>
                        </div>
                      </div>
                    </>
                  ))}
                  
                </div>
              : null}
              
            </div>
          <div className="md:flex bg-white w-full mt-4 rounded">
            <DataTableCustom 
            headers={headers} 
            titleCreate=""
            disableActions={true}
            data={data} 
            setData={(data: any) => setData(data)} 
            title={name}
            deleteRow={deleteRow}
            updateRow={updateRow} />
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
  )
}