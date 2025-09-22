import MenuItemCustomBooking from "./MenuItemCustomBooking"
import { ThemeProvider } from "@mui/material/styles";
import { theme, iconStyle } from "../../lib/theme";

export interface ItemListFieldProps {
  id: number
  time: String
  ownerName?: String
  phone?: String
  dogName?: String
  dogBread?: String
  loadingMenuItem: number
  setLoadingMenuItem: (loading: number) => void
}

export function ItemListField({id, time, ownerName, phone, dogName, dogBread, loadingMenuItem, setLoadingMenuItem}:ItemListFieldProps) {

  

  return(
    <>
      <div key={String(id)} className="h-20 w-[400px] md:w-full mt-4 border border-neutral-300 rounded text-neutral-800 flex flex-row self-center p-4 hover:border-neutral-800 md:text-lg" 
        onClick={() => setLoadingMenuItem(id)}>
        <div className="self-center w-[100px]">
          <ThemeProvider theme={theme}>
            <MenuItemCustomBooking 
              children={
                <h5>{time}</h5>
              }
              handleDelete={(id) => {}}
              handleEdit={(id) => {}}
              id={id}
              getBooking={(id) => {}}
              editData={[]}
            />
          </ThemeProvider>
          
        </div>
        <div className="w-[120px] ml-2 md:ml-6 self-center">
          <h5>{ownerName}</h5>
        </div>
        <div className="w-[120px] ml-2 md:ml-6 self-center">
          <h5>{phone}</h5>
        </div>
        <div className="w-[120px] ml-2 md:ml-6 self-center">
          <h5>{dogName}</h5>
        </div>
        <div className="w-[120px] ml-2 md:ml-6 self-center">
          <h5>{dogBread}</h5>
        </div>
        <div className="w-[80px] ml-2 md:ml-6 self-center">
          
        </div>
      </div>
    </>
    
  )
}