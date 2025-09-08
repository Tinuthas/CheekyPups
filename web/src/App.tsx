import { useState } from 'react';
import { Route, Routes } from "react-router-dom";
import './App.css';

import { Header } from './pages/Header'
import { Home } from './pages/Home'
import { Login } from './pages/Login'
import { LandingPage } from './pages/LandingPage'
import { Attendances } from './pages/Attendances'

function App() {

  return (
    <div className="App">
      <Routes>
        <Route path="/" element= {<LandingPage/>} />
        <Route path="/app" element= {<Header/>}>
          <Route index path='home' element={<Home/>} />
          <Route path='attendance' element={<Attendances/>} />
          
        </Route>
        <Route path='app/login' element={<Login/>} />
        
      </Routes>
    </div>
  )
}

export default App