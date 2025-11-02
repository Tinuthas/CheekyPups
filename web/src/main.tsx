import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from "react-router-dom"
import { HashRouter, Route, Routes } from 'react-router-dom'

import './index.css'
import App from './App.jsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
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
