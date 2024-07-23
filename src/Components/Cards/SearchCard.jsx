import React from 'react'
import Button from '../Button/Button'
import { useNavigate } from 'react-router-dom'

const SearchCard = ({link,title, image}) => {
  const navigate = useNavigate()
  return (
    <div className='rounded-lg overflow-hidden '>
        <div>
            <img src={image} alt="" className=' h-[120px] md:h-[150px] w-[100%] object-cover' loading='lazy'/>
        </div>
        <div className='bg-[#0F77D6] pb-4 pt-2 px-2'>
            <h3 className='mb-4 text-white font-bold text-base sm:text-lg'>{title}</h3>
            <Button clickHandler={()=> navigate(link)} category={'thirdbtn'} >Explore</Button>
        </div>
    </div>
  )
}

export default SearchCard