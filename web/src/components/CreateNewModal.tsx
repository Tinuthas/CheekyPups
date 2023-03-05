import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { toast } from "react-toastify";
import { InputLabel } from "./InputLabelDialog";

export interface ColumnHeader {
  label: string,
  name: string,
  accessorKey: string,
  type: string,
  required?: boolean,
  getDataSelect?: Promise<any>,
}

interface CreateModalProps {
  columns: Array<ColumnHeader>;
  onClose: () => void;
  onSubmit: (values: any) => void;
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewModal = ({
  open,
  columns,
  onClose,
  onSubmit,
}: CreateModalProps) => {
  const [values, setValues] = useState<any>(() =>
    columns.reduce((acc, column) => {
      acc[column.accessorKey ?? ''] = '';
      return acc;
    }, {} as any),
  );

  const handleSubmit = () => {
    //put your validation logic here
    console.log(Object.entries(values))
    var validationEmail = false
    var validationRequired = false

    Object.entries(values).forEach((element:any, index) => {
      console.log(element)
      if(columns[index].required == true) {
        if(validateRequired(element[1]) == false)
          validationRequired = true
      }
      if(columns[index].type.includes('email')){
        if(validateEmail(element[1]) == null) 
        validationEmail = true
      }
    });
    if(validationRequired) {
      toast.error("You need to fill some fields", {position: 'top-center', autoClose: 2000,});
    }else if(validationEmail) {
      toast.error("Incorrect Email Field", {position: 'top-center', autoClose: 2000,});
    }else{
      onSubmit(values);
      onClose();
    }
  };

  return (
    <Dialog open={open} sx={{
      "& .MuiDialog-container": {
        "& .MuiPaper-root": {
          width: "100%",
          margin: "auto",
          maxWidth: "500px",  // Set your width here
        },
      },
    }}>
      <DialogTitle textAlign="center">Add New</DialogTitle>
      <DialogContent>
        <form onSubmit={(e) => e.preventDefault()}>
          <Stack
            sx={{
              width: '100%',
              minWidth: { xs: '300px', sm: '360px', md: '400px' },
              gap: '1.5rem',
            }}
          >
            {columns.map((column) => (
              <InputLabel 
                key={column.accessorKey}
                onChange={(e) => setValues({ ...values, [e.target.name]: e.target.value })} 
                placeholder={column.name} 
                type={column.type} 
                labelName={column.label} 
                accessorKey={column.accessorKey}
                getData={column.getDataSelect}
                />
             
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={onClose}>Cancel</Button>
        <Button color="secondary" onClick={handleSubmit} variant="contained">
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
};

const validateRequired = (value: string) => !!value.length;
const validateEmail = (email: string) =>
  !!email.length &&
  email
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    );
const validateAge = (age: number) => age >= 18 && age <= 50;

//(e) => setValues({ ...values, [e.target.name]: e.target.value })