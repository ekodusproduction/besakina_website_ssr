import React,{useState,useEffect} from 'react'
import ImageGallery from "react-image-gallery";
import "react-image-gallery/styles/css/image-gallery.css";
import Button from '../../Components/Button/Button';
import { MdVerified } from "react-icons/md";
import { Link, useLocation, useParams } from 'react-router-dom';
import { MdLocationPin } from "react-icons/md";
import { FaRegHeart } from "react-icons/fa";
import axiosInstance from '../../api/axiosInstance'
import { baseURL } from '../../api/axiosInstance';
import dayjs from 'dayjs';
import Contactseller from '../../Components/ContactSeller/Contactseller';
import ViewDetails from './View-Details';


const images = [
    {
      original: "https://picsum.photos/id/1018/1000/600/",
      thumbnail: "https://picsum.photos/id/1018/250/150/",
    },
    {
      original: "https://picsum.photos/id/1015/1000/600/",
      thumbnail: "https://picsum.photos/id/1015/250/150/",
    },
    {
      original: "https://picsum.photos/id/1019/1000/600/",
      thumbnail: "https://picsum.photos/id/1019/250/150/",
    },
  ];

const VehicleDetails = () => {
    const {id} = useParams();
    const [vehicleData, setVehicleData] = useState({});
  const [selectedState, setSelectedState] = useState('');
    const location = useLocation();

    useEffect(()=> {
        axiosInstance.get(`api/vehicle/id/${id}`)
        .then(response => {
            const data = response.data.data;
            console.log(data)
            const updatedData = {
                ...data,
                images: data.images.map(image => ({
                    
                    original: image,
                    thumbnail: image,
                }))
            };
            setVehicleData(updatedData);
        
        })
        .catch(error => {
          console.error(error);
        });
      },[id])

     const postedDate = dayjs(vehicleData?.created_at);
     const today = dayjs();
     let displayDate;
     if(postedDate.isSame(today,"day")){
        displayDate ="Today";
     } else{
        displayDate = postedDate.format("DD MMM YY")
     }


  return (
    // <>
    // {Object.keys(vehicleData).length>0 && 
    // <div className='max-w-[1500px] m-auto'>
      
    //     <div className='md:px-12 sm:px-4 px-2 py-8'>
    //         <div className='flex gap-2 sm:mb-6 mb-4'>
    //             <Link to="/" className='font-semibold'>Home</Link>
    //             <p> {'>'}</p>
    //             <a href="" className='font-semibold'>Vehicle</a>
    //         </div>
    //         <section className='flex xl:flex-row flex-col gap-4 '>
    //                 <div className='xl:w-3/5'>
    //                     <ImageGallery items={vehicleData?.images} lazyLoad={true}/>
    //                 </div>
    //                 <div className='xl:w-2/5 border-[1px] border-slate-400 sm:px-6 py-6 px-2 h-[100%] rounded-md '>
    //                         <div className='pb-4 border-b-[1px] border-slate-300 '>
    //                               <div className='flex justify-between '>
    //                                 <h3 className='font-bold sm:text-xl text-2xl mb-2'>{vehicleData?.title}</h3>
    //                                     {/* <button className='mt-[-20px] bg-red'>
    //                                         <FaRegHeart size={25}/>
    //                                     </button> */}
    //                               </div>
    //                                 <p className='text-xl font-bold'>₹ {vehicleData?.price}</p>
    //                                 <div className='mt-4 mb-4 flex  flex-col justify-between'>
    //                                     <span className='text-sm sm:text-base flex items-center text-slate-700'><MdLocationPin size={25}/>{`${vehicleData?.street}, ${vehicleData?.city}, ${vehicleData?.state}, ${vehicleData?.pincode}  `}</span>
    //                                 </div>
    //                                 <div className='flex justify-between items-cnter'>
    //                                     <a href="" className='text-[#179CF0]'>Get Directions</a>
    //                                     <p className='font-bold text-sm'><span className='font-semibold text-slate-600'>Posted: </span>{displayDate}</p>
    //                                 </div>
    //                         </div>
    //                         <Contactseller data={vehicleData} route={location?.pathname}/>
    //                 </div>
    //         </section>
    //         <section className='xl:w-3/5 border-[1px] border-slate-400 sm:mt-8 mt-4 p-4 rounded-md overflow-x-scroll'>
    //             <h2 className='font-bold mb-4'>Details</h2>
    //             <div className='flex flex-col gap-2 min-w-[600px]'>
    //                 <div className='flex justify-between'>
    //                     <p className='w-1/4 text-slate-500 text-sm'>Type</p>
    //                     <p className='w-1/4 text-sm text-slate-700'>{vehicleData?.type}</p>
    //                     <p className='w-1/4 text-sm text-slate-500'>Brand</p>
    //                     <p className='w-1/4 text-sm text-slate-700'>{vehicleData?.brand}</p>
    //                 </div>
    //                 <div className='flex justify-between'>
    //                     <p className='w-1/4 text-sm text-slate-500'>Kilometer Driven</p>
    //                     <p className='w-1/4 text-sm text-slate-700'>{vehicleData?.kilometer_driven}</p>
    //                     <p className='w-1/4 text-sm text-slate-500'>Registration Year</p>
    //                     <p className='w-1/4 text-sm text-slate-700'>{vehicleData?.registration_year}</p>
    //                 </div>
                  
    //             </div>
    //         </section>
    //         <section className='xl:w-3/5 border-[1px] border-slate-400 sm:mt-8 mt-4 p-4 rounded-md'>
    //         <h2 className='font-bold mb-4'>Overview</h2>
    //         <p className='text-sm'>{vehicleData?.description}</p>
         
           
    //         </section>
    //     </div>
        
    // </div>
    // }
    // </>
    <ViewDetails data={vehicleData} route={location?.pathname} category={"vehicle"}/>

  )
}

export default VehicleDetails