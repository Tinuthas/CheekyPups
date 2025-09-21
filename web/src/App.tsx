import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';


import { Header } from './pages/Header'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { LandingPage } from './pages/LandingPage'
import { Attendances } from './pages/Attendances'
import { Dogs } from './pages/Dogs'
import { Owners } from './pages/Owners'
import { Payments } from './pages/Payments'
import { Booking } from './pages/Booking'
import dayjs from 'dayjs';
import { Users } from './pages/Users';

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element= {<LandingPage/>} />
        <Route path="/app" element= {<Header/>}>
          <Route index element={<Home/>} />
          <Route path='attendances' element={<Attendances/>} />
          <Route path="dogs" element={<Dogs/>}/>
          <Route path="owners" element={<Owners/>}/>
          <Route path="payments" element={<Payments/>}/>
          <Route path="booking" element={<Booking/>}/>
          <Route path="users" element={<Users/>}/>
        </Route>
        <Route path='app/login' element={<Login/>} />
        
      </Routes>
    </div>
  )
}

export default App