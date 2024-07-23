import React, { useEffect, useState } from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Categories from '../Components/Categories/Categories'
import Footer from '../Components/Footer/Footer'
import { Link, useNavigate } from 'react-router-dom'
import BackButton from '../Components/BackButton/BackButton'
import { MdOutlineAddBusiness } from "react-icons/md";
import axiosInstance, { baseURL } from '../api/axiosInstance';
import toast from 'react-hot-toast'




const PostAd = () => {
  const token = localStorage.getItem('token');
  const [userData,setUserData] = useState([]);
  const [profileCompleted,setProfileCompleted] = useState(true);
  const navigate = useNavigate();

    useEffect(() => {
        axiosInstance
          .get('api/users/profile/status', {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            const userData = response.data.message;
            console.log(userData);
            if(userData == "User profile complete"){
                setProfileCompleted(true);
            }
          })
          .catch((error) => {
            console.log(error?.response?.data?.message);
            if(error?.response?.data?.message == "User Profile Incomplete"){
                setProfileCompleted(false);
                toast('You need to complete your profile first!', {
                    icon: '⚠️',
                  });
            }
          });
      }, []);
      

  return (
    <>
     
        <section>
            <div className=''>
            <BackButton path={(-1)} style={"absolute pt-3 pl-12"}/>
                <p className='text-center py-4 font-semibold text-xl border-b-[1px] border-gray-300'>POST YOUR AD</p>
            </div>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 py-16 px-4 sm:px-36 md:px-56 gap-6'>
                <div onClick={()=>navigate(profileCompleted ? '/propertiesadform' : '/setup-profile',{state:{route:"/postad"}})} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white cursor-pointer'>
                    <img src="/assets/icons/properties.png" className='w-[60px]' alt="" />
                    <p className='font-semibold'>Properties</p>
                </div>

                <div onClick={()=>navigate(profileCompleted ? '/vehicleadform' : '/setup-profile',{state:{route:"/postad"}})} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white cursor-pointer'>
                    <img src="/assets/icons/vehical-07.svg" className='w-[60px]' alt="" />
                    <p className='font-semibold'>Vehicles</p>
                </div>
        
                <div onClick={()=>navigate(profileCompleted ? '/hospitalityadform' : '/setup-profile',{state:{route:"/postad"}})} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white cursor-pointer'>
                    <img src="/assets/icons/travel-07.svg" className='w-[60px]' alt="" />
                    <p className='font-semibold'>Hospitalitiy</p>
                </div>
                
                <div onClick={()=>navigate(profileCompleted ? '/healthadform' : '/setup-profile',{state:{route:"/postad"}})} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white cursor-pointer'>
                    <img src="/assets/icons/health-07.svg" className='w-[60px]' alt="" />
                    <p className='font-semibold'>Health</p>
                </div>
            
                <div onClick={()=>navigate(profileCompleted ? '/educationadform' : '/setup-profile',{state:{route:"/postad"}})} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white cursor-pointer'>
                    <img src="/assets/icons/learinng-07.svg" className='w-[60px]' alt="" />
                    <p className='font-semibold'>Education</p>
                </div>
                {/* <Link to={'/businessadform'} className='flex flex-col gap-2 justify-center items-center border-[1px] border-gray-400 p-4 rounded-lg bg-white'>
                    <img src="/assets/icons/briefcase.png" className='w-[55px]' alt="" />
                    <p className='font-semibold'>Business Listing</p>
                </Link> */}
    
            </div>
        </section>
      
    
    </>
  )
}

export default PostAd