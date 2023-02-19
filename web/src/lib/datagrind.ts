// When using TypeScript 4.x and above
import type {} from '@mui/x-data-grid/themeAugmentation';

const theme = createTheme({
  components: {
    // Use `MuiDataGrid` on DataGrid, DataGridPro and DataGridPremium
    MuiDataGrid: {
      styleOverrides: {
        root: {
          backgroundColor: 'red',
        },
      },
    },
  },
});
function createTheme(arg0: {
  components: {
    // Use `MuiDataGrid` on DataGrid, DataGridPro and DataGridPremium
    MuiDataGrid: { styleOverrides: { root: { backgroundColor: string; }; }; };
  };
}) {
  
}

