import { BoxProps, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
import DataTableCustom from "./DataTableCustom";
import {Loading} from "../components/Loading";

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
  infoData: {owner:string, dogs:string},
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
  infoData
}: ListModalProps) => {

  useEffect(() => {
    callInit()
  }, [])

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
          <div className="w-full">
            <p>{`Owner ${infoData.owner}`}</p>
            <p>{`Dog ${infoData.dogs}`}</p>
          </div>
          <div className="md:flex bg-white w-full mt-4 rounded">
            <DataTableCustom 
            headers={headers} 
            data={data} 
            setData={(data) => setData(data)} 
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