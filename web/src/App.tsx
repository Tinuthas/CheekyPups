import { NavBar } from './components/NavBar'
import { Outlet} from 'react-router-dom'
import './styles/global.css'
//import './App.css'



function App() {

  return (
    <>
    <header>
      <NavBar />
    </header>
    <main className='bg-pinkBackground w-full h-screen mt-[68px]'> 
      <Outlet />
    </main>
    </>
   
  )
}

export default App
