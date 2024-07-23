import React from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Categories from '../Components/Categories/Categories'
import Footer from '../Components/Footer/Footer'
import { Link } from 'react-router-dom'
import BackButton from '../Components/BackButton/BackButton'
import { MdOutlineAddBusiness } from "react-icons/md";


const ListingCategories = () => {
    
  return (
    <>
     
        <section>
            <div className=''>
            <BackButton path={(-1)} style={"absolute pt-3 pl-12"}/>
                <p className='text-center py-4 font-semibold text-xl border-b-[1px] border-gray-300 uppercase'>Listing Categories</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-16 px-4 sm:px-36 md:px-56 gap-6'>
                <Link to={'/properties'} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white'>
                    <img src="/assets/icons/properties.png" className='w-[60px]' alt="" />
                    <p className='font-semibold'>Properties</p>
                </Link>

                <Link to={'/vehicles'} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white'>
                    <img src="/assets/icons/vehical-07.svg" className='w-[60px]' alt="" />
                    <p className='font-semibold'>Vehicles</p>
                </Link>
        
                <Link to={'/hospitality'} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white'>
                    <img src="/assets/icons/travel-07.svg" className='w-[60px]' alt="" />
                    <p className='font-semibold'>Hospitalitiy</p>
                </Link>
                
                <Link to={'/healthcare'} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white'>
                    <img src="/assets/icons/health-07.svg" className='w-[60px]' alt="" />
                    <p className='font-semibold'>Healthcare</p>
                </Link>
            
                <Link to={'/education'} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white'>
                    <img src="/assets/icons/learinng-07.svg" className='w-[60px]' alt="" />
                    <p className='font-semibold'>Education</p>
                </Link>
                {/* <Link to={'/businessadform'} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white'>
                    <img src="/assets/icons/briefcase.png" className='w-[55px]' alt="" />
                    <p className='font-semibold'>Business Listing</p>
                </Link> */}
    
            </div>
        </section>
      
    
    </>
  )
}

export default ListingCategories