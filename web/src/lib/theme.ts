import { createTheme } from "@mui/material";
import colors from "tailwindcss/colors";

export const theme = createTheme({
  palette: {
    //mode: 'dark',
    primary: {
      light: colors.neutral[500],
      //main: colors.neutral[700],
      main:  '#f02a77',
      dark: '#7dcce9',
      contrastText: colors.white,
    },
    secondary: {
      light: colors.white,
      main: '#f02a77',
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
  },
});

export const iconStyle =
{
    "fontSize": "35px",
    "color": "#737373",
    "&:hover": { "color": "#f02a77" }
}