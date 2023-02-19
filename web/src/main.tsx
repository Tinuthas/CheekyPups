import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import './index.css'
import { About } from './pages/About'
import { Attendance } from './pages/Attendance'
import { Dogs } from './pages/Dogs'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { NewOwnerDog } from './pages/NewOwnerDog'
import { Owners } from './pages/Owners'
import { Payments } from './pages/Payments'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route index element={<Home/>}/>
          <Route path="about" element={<About/>}/>
          <Route path="attendance" element={<Attendance/>}/>
          <Route path="dogs" element={<Dogs/>}/>
          <Route path="owners" element={<Owners/>}/>
          <Route path="payments" element={<Payments/>}/>
          <Route path="owners/new" element={<NewOwnerDog/>}/>
        </Route>
        <Route path='login' element={<Login/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
