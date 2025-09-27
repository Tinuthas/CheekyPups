import { Button, ButtonGroup } from "@mui/material"
import { ThemeProvider } from "@mui/material/styles";
import { theme} from "../lib/theme";
import { useState } from "react";

interface ButtonProps{
  listButtons: Array<{key:string, name: string}>
  selectedButton: string
  selectButton: (value:string) => void
}

export function ButtonGroupList({listButtons, selectedButton ,selectButton} : ButtonProps) {
  
  function onClickedButton(button: {key:string, name: string}) {
    selectButton(button.key)
  }

  return(
    <ThemeProvider theme={theme}>
      <ButtonGroup variant="outlined" aria-label="button group" sx={{background: "#f02a77", border: "1px solid #FFF", animation: "glow 1s infinite alternate"}} >
        {
          listButtons.map((button)=> (
            button.key === selectedButton ? 
              <Button key={button.key} onClick={() => onClickedButton(button)} sx={{width: '110px',color: '#f02a77', background: '#FFF', "&:hover": { color: "#f02a77", background: "#FFF" }}}>{button.name}</Button>
              :<Button key={button.key} onClick={() => onClickedButton(button)} sx={{width: '110px',color: '#FFF', "&:hover": { color: "#f02a77", background: "#FFF" }}}>{button.name}</Button> 
          ))
        }
      </ButtonGroup>
    </ThemeProvider>
  )
}
