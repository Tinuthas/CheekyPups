import React, { useCallback, useMemo, useState } from 'react';
import MaterialReactTable, { MaterialReactTableProps, MRT_ColumnDef, MRT_Row } from 'material-react-table';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tooltip } from '@mui/material';
import colors from 'tailwindcss/colors';
import { Delete, Edit, Add } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { ColumnHeader, CreateNewModal } from './CreateNewModal';

const theme = createTheme({
  palette: {
    //mode: 'dark',
    primary: {
      light: colors.neutral[700],
      //main: colors.neutral[700],
      main:  '#FF499E',
      dark: colors.neutral[700],
      contrastText: colors.white,
    },
    secondary: {
      light: colors.white,
      main: '#FF499E',
      dark: colors.neutral[700],
      contrastText: colors.white,
    },
    contrastThreshold: 3,
    tonalOffset: 0.2,
  },
  typography: {
    fontFamily: [
      'Inter',
      //'Roboto',
      'Avenir',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif'
    ].join(','),
  }
});

interface DataTableProps {
  headers: object[],
  data: object[],
  title: string,
  createData: ColumnHeader[],
  hideColumns?: any,
  setData?: (data:object[]) => void,
  updateRow?:(data:object) => Promise<any>,
  createRow?:(data:object) => Promise<any>,
  deleteRow?:(id:number) => Promise<any>,
}

const DataTableCustom = ({headers, data, setData, createData, title, updateRow, createRow, deleteRow, hideColumns}: DataTableProps) => {

  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [open, setOpen] = React.useState(false);
  const [openIndex, setOpenIndex] = React.useState(-1);
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const handleCreateNewRow = (values: any) => {
    if(createRow != undefined)
    createRow(values).then(() => {
      data.push(values);
      if(setData != undefined)
        setData([...data]);
    })
  };

  const handleSaveRowEdits: MaterialReactTableProps['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        values.id = (data[row.index] as any).id
        data[row.index] = values;
        if(updateRow != undefined)
          updateRow(values).then(() => {
            if(setData != undefined)
              setData([...data]);
          })
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row: MRT_Row) => {
      console.log('Index '+row.index)
      console.log((data[row.index] as any).id)

      if(deleteRow != undefined)
        deleteRow((data[row.index] as any).id).then(() => {
          data.splice(row.index, 1);
          if(setData != undefined)
            setData([...data]);
        })
      setOpen(false);
    },
    [data],
  );

  return (
    <ThemeProvider theme={theme}>
      <div className='w-full'>
      <MaterialReactTable
        columns={headers as MRT_ColumnDef<(typeof data)[0]>[]}
        data={data}
        enableColumnResizing
        enableEditing
        onEditingRowSave={handleSaveRowEdits}
        onEditingRowCancel={handleCancelRowEdits}
        initialState={{ columnVisibility: hideColumns }}
        positionActionsColumn="last"
        displayColumnDefOptions={{
          'mrt-row-actions': {
            header: 'Actions', //change header text
            size: 120, //make actions column wider
          },
        }}
        renderRowActions={({ row, table }) => (
          <Box sx={{ display: 'flex', gap: '1rem', width: 100, maxWidth: 100, }}>
            <Tooltip arrow placement="left" title="Edit">
              <IconButton onClick={() => table.setEditingRow(row)}>
                <Edit />
              </IconButton>
            </Tooltip>
            <Tooltip arrow placement="right" title="Delete">
              <IconButton color="error" onClick={() => {
                setOpen(true)
                setOpenIndex(row.index)
              }}>
                <Delete />
              </IconButton>
            </Tooltip>
            {
              openIndex == row.index && open && (
                <Dialog
                  open={open}
                  onClose={() => setOpen(false)}
                  sx={{
                    "& .MuiDialog-container": {
                      "& .MuiPaper-root": {
                        width: "100%",
                        margin: "auto",
                        maxWidth: "500px",  // Set your width here
                      },
                    },
                  }}>
                  <DialogTitle id="responsive-dialog-title">
                    {"Are you absolutely sure?"}
                  </DialogTitle>
                  <DialogContent>
                    <DialogContentText>
                    This action cannot be undone. This will permanently delete 
                    and remove your data from our servers.
                    </DialogContentText>
                  </DialogContent>
                <DialogActions>
                  <Button autoFocus onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                  <Button onClick={() => handleDeleteRow(row)} autoFocus>
                    Delete
                  </Button>
                </DialogActions>
              </Dialog>
              )
            }
            
          </Box>
        )}
        renderTopToolbarCustomActions={() => (
          <>
            <Box sx={{ fontSize: 16, fontWeight: 'medium', paddingTop: 0, paddingLeft: 1 }}>
              {title}
              <IconButton onClick={() => setCreateModalOpen(true)}>
                <Add />
              </IconButton>
            </Box>
            
          </>
          
        )}
      />
      <CreateNewModal
        columns={createData}
        open={createModalOpen}
        onClose={() => setCreateModalOpen(false)}
        onSubmit={handleCreateNewRow}
      />
      </div>
      
    </ThemeProvider>
   
  );
};

export default DataTableCustom;