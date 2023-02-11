import logoImage from '../assets/logo.svg'
import { Button } from './Button'
import { List, X } from 'phosphor-react'
import { useState } from 'react'

export function NavBar() {

  let Links = [
    { name: "HOME", link: "/" },
    { name: "CONTACT", link: "/" },
    { name: "ABOUT", link: "/" }
  ]

  const [open, setOpen] = useState(false)

  return(
    <div className="shadow-md w-full fixed top-0 left-0">
      <div className="md:flex items-center justify-between bg-white py-4 md:px-10 px-7">
        <div className="text-neutral-700 font-bold flex items-center text-2xl cursor-pointer">         
          <img src={logoImage} alt="Cheeky Pubs Logo" className='h-9'/>
          Cheeky Pubs
        </div>
        <div className='text-3xl absolute right-8 top-6 cursor-pointer md:hidden transition-all duration-500' onClick={()=>setOpen(!open)}>
          {
            open ? <X className='text-neutral-700'/> : <List className='text-neutral-700'/>
          }
        </div>
        <div className={`transition-all duration-300 ease-in ${open ? 'opacity-100':'top-[-500px] opacity-0'} md:opacity-100`}>
          <ul className={`md:flex md:items-center md:pb-0 pb-12 absolute md:static bg-white md:z-auto z-[-1] left-0 w-full md:w-auto md:pl-0 pl-9`}>
            {
              Links.map((link) => (  
                <li key={link.name} className='md:ml-8 text-xl md:my-0 my-7'>
                  <a href={link.link} className='text-neutral-800 hover:text-neutral-400 duration-300'>{link.name}</a>
                </li>
              ))
            }
            <Button text='LOGIN' />
          </ul>
        </div>
        
      </div>
     
    </div>
  )
}