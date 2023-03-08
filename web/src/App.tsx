import { NavBar } from './components/NavBar'
import { Outlet, useNavigate} from 'react-router-dom'
import './styles/global.css'
import './lib/datagrind'
import { useEffect, useState } from 'react'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

function App() {

  const [authenticated, setAuthenticated] = useState<boolean>(false)
  const navigate = useNavigate()
  useEffect(() => {
    const loggedInUser = localStorage.getItem("authenticated") || "";
    if(loggedInUser !== "") {
      setAuthenticated(true)
    }else{
      navigate("/login", { replace: true });
    }
  }, [])

    return (
      <div className='bg-pinkBackground w-full h-screen'>
        <header>
          <NavBar />
        </header>
        <main className='bg-pinkBackground'> 
          <Outlet /> 
          <ToastContainer />
        </main>
      </div>
    )
 
}

export default App
