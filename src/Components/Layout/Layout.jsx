import React,{useState,createContext, useRef } from 'react'
import { Outlet } from 'react-router-dom'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../Footer/Footer'



const Layout = () => {

  return (
    
    <div className='flex'>
   
      <div className='w-full h-screen overflow-y-scroll'>
        <Navbar/>
        <Outlet/>
        <Footer/>
      </div>
    </div>
  
    
  )
}

export default Layout