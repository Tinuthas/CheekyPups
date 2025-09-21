import { Button, ButtonGroup } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles";
import { theme} from "../lib/theme";

interface ButtonProps{
  listButtons: Array<{key:string, name: string}>
  selectButton: (value:string) => void
}

export function ButtonGroupList({listButtons, selectButton} : ButtonProps) {
  
  return(
    <ThemeProvider theme={theme}>
      <ButtonGroup variant="outlined" aria-label="button group" sx={{background: "#f02a77", border: "1px solid #FFF"}} >
        {
          listButtons.map((button)=> (
            <Button key={button.key} onClick={() => selectButton(button.key)} sx={{width: '110px',color: '#FFF', "&:hover": { color: "#f02a77", background: "#FFF" }}}>{button.name}</Button>
          ))
        }
      </ButtonGroup>
    </ThemeProvider>
  )
}
