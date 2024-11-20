import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import Hero from './component/hero/hero.jsx'
import Student from './component/student/student.jsx'
import Staff from './component/staff/staff.jsx'
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
        path:"Student",
        element:<Student/>
      }
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
