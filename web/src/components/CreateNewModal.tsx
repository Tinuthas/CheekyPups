import { Button, Dialog, DialogActions, DialogContent, DialogTitle, fabClasses, Stack, TextField } from "@mui/material";
import dayjs from "dayjs";
import { useState } from "react";
import { toast } from "react-toastify";
import { InputLabel } from "./InputLabelDialog";

export interface ColumnHeader {
  label: string,
  name: string,
  accessorKey: string,
  type: string,
  value?: any,
  setValue?(value:any):void,
  required?: boolean,
  getDataSelect?: (inputValue: string) => Promise<any>,
  setLocalStatus?(status:boolean):void
}

interface CreateModalProps {
  columns: Array<ColumnHeader>;
  onClose: () => void;
  onSubmit: (values: any, valuesData: any) => void;
  open: boolean;
}

//example of creating a mui dialog modal for creating new rows
export const CreateNewModal = ({
  open,
  columns,
  onClose,
  onSubmit,
}: CreateModalProps) => {


  const emptyValues = () =>
  columns.reduce((acc, column) => {
    acc[column.accessorKey ?? ''] = column.value ?? '';
    return acc;
  }, {} as any)

  /*const initialValues = columns.reduce((acc, column) => {
    acc[column.accessorKey ?? ''] = column.value ?? '';
    return acc;
  }, {} as any)*/

  const [values, setValues] = useState<any>(emptyValues);
  
  const [selectInput, setSelectInput] = useState<any>({})

  const handleClose = () => {
    setValues(emptyValues)
    onClose()
  }

  const handleSubmit = () => {
    console.log('clicked')
    //put your validation logic here
    //console.log(Object.entries(values))
    var validationEmail = false
    var validationRequired = false
    var validationDate = false
    Object.entries(values).forEach((element:any, index) => {
      console.log(element[1])
      console.log(columns[index])
      if(columns[index] != null){
        if(columns[index].type.includes('checkbox')){
          if(values[element[1]] == undefined) 
            values[element[1]] = false
        }
        if(columns[index].required == true) {
          if(validateRequired(element[1]) == false)
            validationRequired = true
        }
        if(columns[index].type.includes('email')){
          if(validateEmail(element[1]) == null) 
          validationEmail = true
        }
        if(columns[index].value != undefined) {
          values[element[0]] = columns[index].value
        }
        if(columns[index].type.includes('date')){
          if(element[1].length == 0) {
            values[element[0]] = null
          }else{
            //values[element[0]] = element[1]
            values[element[0]] = dayjs(element[1]).format('DD/MM/YYYY')
          }
        }
        
      }
    });
    if(validationRequired) {
      toast.error(`You need to fill some fields`, {position: 'top-center', autoClose: 2000,});
      toast.error(`${JSON.stringify(values)}`, {position: 'top-center', autoClose: 10000,});
    }else if(validationEmail) {
      toast.error("Incorrect Email Field", {position: 'top-center', autoClose: 2000,});
    }else if(validationDate) {
      toast.error("Incorrect Date Field", {position: 'top-center', autoClose: 2000,});
    }else{

      const valuesData = { ...values };
      Object.entries(selectInput).forEach((element:any, index) => {
        values[element[0]] = element[1]
      })
      onSubmit(values, valuesData);
      handleClose();
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
      <DialogTitle textAlign="center">Add</DialogTitle>
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
                onSelect={(key, value) => setSelectInput({ ...selectInput, [key]: value })}
                onChangeValue={(key, value) => setValues({ ...values, [key]: value})}
                getData={column.getDataSelect}
                value={column.value}
                setValue={column.setValue}
                setLocalStatus={column.setLocalStatus}
              />
             
            ))}
          </Stack>
        </form>
      </DialogContent>
      <DialogActions sx={{ p: '1.25rem' }}>
        <Button onClick={handleClose}>Cancel</Button>
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

const validateDate = (date: string) => !/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(date)


//(e) => setValues({ ...values, [e.target.name]: e.target.value })