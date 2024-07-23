import React from 'react'
import { useNavigate } from 'react-router-dom'
import { IoArrowBackCircleOutline } from "react-icons/io5";

const BackButton = ({path,IconclassName, style}) => {
const navigate = useNavigate();

  return (
    <button className={`${style}`} onClick={()=>navigate(path)}><IoArrowBackCircleOutline className={`w-9 h-9 ${IconclassName}`}/></button>
  )
}

export default BackButton