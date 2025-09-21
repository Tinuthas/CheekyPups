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
      <ButtonGroup aria-label="button group" sx={{ '--ButtonGroup-radius': '40px' }}>
        {
          listButtons.map((button)=> (
            <Button key={button.key} onClick={() => selectButton(button.key)} >{button.name}</Button>
          ))
        }
      </ButtonGroup>
    </ThemeProvider>
  )
}
