import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import Admin from './component/admin/admin.jsx'
import Managereport from './component/staff/managereport.jsx'
import ManageUpload from './component/staff/manageupload.jsx'
import Viewmat from './component/student/viewmat.jsx'
import Viewann from './component/student/viewann.jsx'
import Scholarship from './component/staff/scholarship.jsx' 
import Announcement from './component/staff/announcement.jsx' 
import Material from './component/staff/material.jsx' 
import Access from './component/staff/Access.jsx' 
import Report from './component/staff/report.jsx'
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
        path:"Admin",
        element:<Admin/>
      },
      {
        path:"Managereport",
        element:<Managereport/>
      },
      {
        path:"Record",
        element:<Record/>
      },
      {
        path:"Report",
        element:<Report/>
      },
      {
        path:"Material",
        element:<Material/>
      },
      {
        path:"Access",
        element:<Access/>
      },
      {
        path:"Viewann",
        element:<Viewann/>
      },
      {
        path:"Viewmat",
        element:<Viewmat/>
      },
      {
        path:"Scholarship",
        element:<Scholarship/>
      },
      {
        path:"Manageupload",
        element:<ManageUpload/>
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
