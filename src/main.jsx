import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Scholarship from './component/staff/scholarship.jsx' 
import Announcement from './component/staff/announcement.jsx' 
import Material from './component/staff/material.jsx' 
import Attendance from './component/staff/attendance.jsx' 
import Mail from './component/staff/mail.jsx' 
import Record from './component/staff/record.jsx' 
import Hero from './component/hero/hero.jsx'
import Student from './component/student/student.jsx'
import Staff from './component/staff/staff.jsx'
import Acc from './component/acc/acc.jsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'

const router = createBrowserRouter([
      {
        path: "",
        element: <Hero/>
      },
      {
        path:"Staff",
        element:<Staff/>
      },
      {
        path:"Acc",
        element:<Acc/>
      },
      {
        path:"Student",
        element:<Student/>
      },
      {
        path:"Record",
        element:<Record/>
      },
      {
        path:"Mail",
        element:<Mail/>
      },
      {
        path:"Material",
        element:<Material/>
      },
      {
        path:"Attendance",
        element:<Attendance/>
      },
      {
        path:"Scholarship",
        element:<Scholarship/>
      },
      {
        path:"Announcement",
        element:<Announcement/>
      }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
