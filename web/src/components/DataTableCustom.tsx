import React, { useCallback, useMemo, useState } from 'react';
import MaterialReactTable, { MaterialReactTableProps, MRT_ColumnDef, MRT_Row } from 'material-react-table';
import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, IconButton, Tooltip } from '@mui/material';
import colors from 'tailwindcss/colors';
import { Delete, Edit } from '@mui/icons-material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { createTheme, ThemeProvider } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    //mode: 'dark',
    primary: {
      light: '#FF499E',
      main: colors.neutral[700],
      dark: colors.pink[600],
      contrastText: colors.yellow[400],
    },
    secondary: {
      light: colors.white,
      main: '#FF499E',
      dark: colors.pink[700],
      contrastText: colors.yellow[400],
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
  setData?: (data:object[]) => void,
  updateRow?:(data:object) => void,
}

const DataTableCustom = ({headers, data, setData, title, updateRow}: DataTableProps) => {

  const [open, setOpen] = React.useState(false);
  const [openIndex, setOpenIndex] = React.useState(-1);
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));
  const [validationErrors, setValidationErrors] = useState<{
    [cellId: string]: string;
  }>({});

  const handleSaveRowEdits: MaterialReactTableProps['onEditingRowSave'] =
    async ({ exitEditingMode, row, values }) => {
      if (!Object.keys(validationErrors).length) {
        values.id = (data[row.index] as any).id
        data[row.index] = values;
        if(updateRow != undefined)
          updateRow(values)
        //send/receive api updates here, then refetch or update local table data for re-render
        if(setData != undefined)
          setData([...data]);
        exitEditingMode(); //required to exit editing mode and close modal
      }
    };

  const handleCancelRowEdits = () => {
    setValidationErrors({});
  };

  const handleDeleteRow = useCallback(
    (row: MRT_Row) => {
      console.log('Index '+row.index)
      //send api delete request here, then refetch or update local table data for re-render
      data.splice(row.index, 1);
      if(setData != undefined)
        setData([...data]);
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
              fullScreen={fullScreen}
              open={open}
              onClose={() => setOpen(false)}
              aria-labelledby="responsive-dialog-title"
            >
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
          <Box>
            {title}
          </Box>
        )}
      />
      </div>
      
    </ThemeProvider>
   
  );
};

export default DataTableCustom;