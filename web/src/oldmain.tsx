import React from 'react'
import ReactDOM from 'react-dom/client'
import { HashRouter, Route, Routes } from 'react-router-dom'

import App from './App'
import './index.css'
import { About } from './pages/About'
import { Attendances } from './pages/Attendances'
import { Dogs } from './pages/Dogs'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { Owners } from './pages/Owners'
import { Payments } from './pages/Payments'
import { Vaccines } from './pages/Vaccines'
import { LandingPage } from './pages/LandingPage'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
        <Route path='/' element={<LandingPage/>}/>
        <Route path="app" element={<App/>}>
          <Route index element={<Home/>}/>
        </Route>
        <Route path='login' element={<Login/>}/>
      </Routes>
    </HashRouter>
  </React.StrictMode>
)

/*
 <Route path="app" element={<App/>}>
          <Route index element={<Home/>}/>
          <Route path="about" element={<About/>}/>
          <Route path="attendances" element={<Attendances/>}/>
          <Route path="dogs" element={<Dogs/>}/>
          <Route path="owners" element={<Owners/>}/>
          <Route path="payments" element={<Payments/>}/>
          <Route path="vaccines" element={<Vaccines/>}/>
        </Route>
        <Route path='login' element={<Login/>}/>
*/
// <Route path="owners/new" element={<NewOwnerDog/>}/>
