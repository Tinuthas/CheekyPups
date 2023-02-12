import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import App from './App'
import './index.css'
import { About } from './pages/About'
import { Attendance } from './pages/Attendance'
import { Dogs } from './pages/Dogs'
import { Home } from './pages/Home'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App/>}>
          <Route index element={<Home/>}/>
          <Route path="about" element={<About/>}/>
          <Route path="attendance" element={<Attendance/>}/>
          <Route path="dogs" element={<Dogs/>}/>
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
)
