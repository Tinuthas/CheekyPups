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
import { Presentation } from './pages/Presentation'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <HashRouter>
      <Routes>
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
        <Route path='/' element={<Presentation/>}/>
      </Routes>
    </HashRouter>
  </React.StrictMode>
)

// <Route path="owners/new" element={<NewOwnerDog/>}/>
