import logoImage from '../assets/roundedlogo.png'
import { List, X } from 'phosphor-react'
import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { SubNavBar } from './SubNavbar'
import { updateToken } from '../lib/axios'
import { ButtonDark } from './ButtonDark'

export function NavBar() {

  const navigate = useNavigate();
  const [open, setOpen] = useState(false)
  const [authenticated, setauthenticated] = useState(
    localStorage.getItem(localStorage.getItem("authenticated") || "")
  );

  let Links = [
    { name: "Services", 
      links: [
        {
          name: "Daycare", path: "Attendances",
        },
        {
          name: "Booking", path: "Booking",
        },
        {
          name: "Calendar", path: "Calendar",
        },
        
      ]},
    /*{ name: "Grooming", 
      links: [
        {
          name: "Booking", path: "Booking",
        },
      ]},*/
    { name: "Payments", 
      links: [
        {
          name: "Orders", path: "Payments",
        },
        {
          name: "Till Money", path: "TillMoney",
        },
        {
          name: "Summary", path: "Summary",
        }
      ]},
    { name: "Manager", 
      links: [
        {
          name: "Dogs", path: "Dogs",
        },
        {
          name: "Owners", path: "Owners",
        },
        {
          name: "Settings", path: "Users",
        },
        
      ]
    }
    /*,
        {
          name: "Vaccines", path: "Vaccines",
        }*/
    /*{
      name: "Manager", links: [
        {
          name: "Owners", path: "Owners",
        },
        {
          name: "Payments", path: "Payments",
        }
      ]
    }*/
  ]

  function handleLoginLogout() {
    localStorage.setItem("authenticated", "");
    updateToken()
    setauthenticated("")
    navigate("/app/login");
  }

  //<div className="text-pinkBackground font-bold flex items-center text-3xl drop-shadow-md cursor-pointer py-2">         

  return(
    <div className="shadow w-full top-0 left-0 ">
      <div className="md:flex items-center justify-between bg-white md:h-[68px] py-4 md:px-10 px-7">
        <div className="flex items-center cursor-pointer">         
          <img src={logoImage} alt="Cheeky Pubs Logo" className='h-9 mr-2'/>
          <h3 className='font-extrabold text-4xl text-pinkBackground font-borsok pt-2'>CHEEKY PUPS</h3>
        </div>
        <div className='text-3xl absolute right-8 top-5 cursor-pointer md:hidden transition-all duration-500' onClick={()=>setOpen(!open)}>
          {
            open ? <X className='text-neutral-800'/> : <List className='text-neutral-800'/>
          }
        </div>
        <div className={`transition-all duration-300 ease-in ${open ? 'opacity-100 mt-4':'top-[-500px] opacity-0 hidden'} md:opacity-100 md:flex`}>
          <ul className={`flex flex-col md:flex-row md:items-center md:pb-0 pb-7 md:static bg-white md:z-auto z-auto left-0 w-full md:w-auto md:pl-0`}>
            {
              Links.map((link) => (  
                <li key={link.name}  className='md:ml-8 text-xl md:my-0' >
                  {link.links ? 
                    <>
                      <SubNavBar name={link.name} list={link.links} dismissClick={()=>setOpen(false)}/>
                    </>
                  :
                    <Link to={link.name} onClick={()=>setOpen(false)} className='z-[1] text-neutral-600 hover:text-neutral-400 duration-300 font-medium inline-block h-12 pt-5 md:h-6 md:pt-0 w-full'>{link.name}</Link>
                  }
                </li>
              ))
            }
            <ButtonDark text={authenticated != "" ? "LOGOUT" : "LOGIN"}  onClick={handleLoginLogout}/>
           
          </ul>
        </div>
        
      </div>
     
    </div>
  )
}