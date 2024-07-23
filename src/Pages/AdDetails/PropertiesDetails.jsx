import React, { useState, useEffect } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import Button from '../../Components/Button/Button';
import { MdVerified } from 'react-icons/md';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { MdLocationPin } from 'react-icons/md';
import { FaRegHeart } from 'react-icons/fa';
import axiosInstance from '../../api/axiosInstance';
import { baseURL } from '../../api/axiosInstance';
import dayjs from 'dayjs';
import { useLogin } from '../../hooks/useLogin';
import Contactseller from '../../Components/ContactSeller/Contactseller';
import ViewDetails from './View-Details';

const PropertiesDetails = () => {
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState({});
  const token = localStorage.getItem('token');
  const { isLoggedIn, setIsLoggedIn } = useLogin();
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [contactDetails, setContactDetails] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    axiosInstance
      .get(`api/property/id/${id}`)
      .then((response) => {
        console.log(response);
        const data = response.data.data;
        const updatedData = {
          ...data,
          images: data.images.map((image) => ({
            original: image,
            thumbnail: image,
          })),
        };
        setPropertyData(updatedData);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const postedDate = dayjs(propertyData?.created_at);
  const today = dayjs();
  let displayDate;
  if (postedDate.isSame(today, 'day')) {
    displayDate = 'Today';
  } else {
    displayDate = postedDate.format('DD MMM YY');
  }

  //  const handleContactSeller =(id)=>{
  //     if(isLoggedIn){
  //         axiosInstance.get(`api/users/id/${id}`,{
  //             headers:{
  //                 Authorization:`Bearer ${token}`
  //             },
  //         })
  //         .then(response=>{
  //             setContactDetails(response?.data?.data);
  //             setShowContactDetails(true);
  //         })
  //         .catch(error=>{
  //             console.error(error)
  //         })
  //     }else{
  //         navigate("/login");
  //     }
  //  }

  return (
    // <>
    //   {Object.keys(propertyData).length > 0 && (
    //     <div className="max-w-[1500px] m-auto">
    //       <div className="md:px-12 sm:px-4 px-2 py-8">
    //         <div className="flex gap-2 sm:mb-6 mb-4">
    //           <Link to="/" className="font-semibold">
    //             Home
    //           </Link>
    //           <p> {'>'}</p>
    //           <a href="" className="font-semibold">
    //             Properties
    //           </a>
    //         </div>
    //         <section className="flex xl:flex-row flex-col gap-4 ">
    //           <div className="xl:w-3/5">
    //             <ImageGallery items={propertyData?.images} lazyLoad={true} />
    //           </div>
    //           <div className="xl:w-2/5 border-[1px] border-slate-400 sm:px-6 py-6 px-2 h-[100%] rounded-md ">
    //             <div className="pb-4 border-b-[1px] border-slate-300 ">
    //               <div className="flex justify-between ">
    //                 <h3 className="font-bold sm:text-3xl text-2xl mb-2">
    //                   ₹ {propertyData?.price}
    //                 </h3>
    //                 {/* <button className='mt-[-20px] bg-red'>
    //                                         <FaRegHeart size={25}                                    />
    //                                     </button> */}
    //               </div>
    //               <p className="text-sm sm:text-base text-slate-700">
    //                 {propertyData?.title}
    //               </p>
    //               <div className="mt-4 mb-4 flex  flex-col justify-between">
    //                 <span className="text-sm sm:text-base flex items-center text-slate-700">
    //                   <MdLocationPin size={25} />
    //                   {`${propertyData?.house_no ? `House No: ${propertyData?.house_no}` : ""}, ${propertyData?.street}, ${propertyData?.city} - ${propertyData?.pincode}, ${propertyData?.state}`}
    //                 </span>
    //               </div>
    //               <div className="flex justify-between items-cnter">
    //                 <a href="" className="text-[#179CF0]">
    //                   Get Directions
    //                 </a>
    //                 <p className="font-bold text-sm">
    //                   <span className="font-semibold text-slate-600">
    //                     Posted:{' '}
    //                   </span>
    //                   {displayDate}
    //                 </p>
    //               </div>
    //             </div>
    //             {/* <div>
    //                                 <h3 className='my-4 font-bold'>Seller Details</h3>
    //                                 <div className='flex gap-4 items-center pb-2'>
    //                                     <div className='py-2 border-[1px] border-slate-400 flex justify-center items-center'>
    //                                         <img src={propertyData?.user?.profile_pic ? propertyData?.user?.profile_pic : "/assets/logos/logo1.svg"} className='w-[120px]' alt="" />
    //                                     </div>
    //                                     <div>
    //                                         <h4 className='font-bold'>{propertyData?.user?.fullname}</h4>
    //                                         <p className='text-sm sm:text-base text-slate-700'><span className='font-semibold capitalize'>{propertyData?.user?.doc_type}:</span>  {propertyData?.user?.doc_number}</p>
    //                                         <p className='text-sm sm:text-base text-slate-700'>Member since Jan 2016</p>
    //                                     </div>
    //                                 </div>
    //                                 <div className='flex items-center gap-[3px] text-[#179CF0]'>
    //                                     <MdVerified/>
    //                                     <p className='text-sm font-bold'>Verified</p>
    //                                 </div>
    //                                 <p className='py-2 text-sm sm:text-base text-slate-700'>{propertyData?.user?.about}</p>
    //                                 <Button clickHandler={()=>handleContactSeller(propertyData?.user?.id)} category={'primarybtn'}>Contact Seller</Button>
                                    
    //                                 {contactDetails?.mobile && <p className='py-4 font-medium text-lg'>Phone number: {contactDetails?.mobile} </p>}
    //                         </div> */}
    //             <Contactseller data={propertyData} route={location?.pathname} />
    //           </div>
    //         </section>
    //         <section className="xl:w-3/5 border-[1px] border-slate-400 sm:mt-8 mt-4 p-4 rounded-md overflow-x-scroll capitalize">
    //           <h2 className="font-bold mb-4">Details</h2>
    //           <div className="flex flex-col gap-2 min-w-[600px]">
    //             <div className="flex justify-between">
    //               <p className="w-1/4 text-slate-500 text-sm">Type</p>
    //               <p className="w-1/4 text-sm text-slate-700">
    //                 {propertyData?.type}
    //               </p>
    //               <p className="w-1/4 text-sm text-slate-500">Bedrooms</p>
    //               <p className="w-1/4 text-sm text-slate-700">
    //                 {propertyData?.bedrooms}
    //               </p>
    //             </div>
    //             <div className="flex justify-between">
    //               <p className="w-1/4 text-sm text-slate-500">Total Rooms</p>
    //               <p className="w-1/4 text-sm text-slate-700">
    //                 {propertyData?.total_rooms}
    //               </p>
    //               <p className="w-1/4 text-sm text-slate-500">Furnishing</p>
    //               <p className="w-1/4 text-sm text-slate-700">
    //                 {propertyData?.furnishing}
    //               </p>
    //             </div>
    //             <div className="flex justify-between">
    //               <p className="w-1/4 text-sm text-slate-500">
    //                 Construction Status
    //               </p>
    //               <p className="w-1/4 text-sm text-slate-700">
    //                 {propertyData?.construction_status}
    //               </p>
    //               <p className="w-1/4 text-sm text-slate-500">Listed by</p>
    //               <p className="w-1/4 text-sm text-slate-700">
    //                 {propertyData?.listed_by}
    //               </p>
    //             </div>
    //             <div className="flex justify-between">
    //               <p className="w-1/4 text-sm text-slate-500">
    //                 Super buildup area
    //               </p>
    //               <p className="w-1/4 text-sm text-slate-700">
    //                 {propertyData?.super_builtup_area}
    //               </p>
    //               <p className="w-1/4 text-sm text-slate-500">Carpet area</p>
    //               <p className="w-1/4 text-sm text-slate-700">
    //                 {propertyData?.carpet_area}
    //               </p>
    //             </div>
    //             <div className="flex justify-between">
    //               <p className="w-1/4 text-sm text-slate-500">Total floors</p>
    //               <p className="w-1/4 text-sm text-slate-700">
    //                 {propertyData?.total_floors}
    //               </p>
    //               <p className="w-1/4 text-sm text-slate-500">Floor No.</p>
    //               <p className="w-1/4 text-sm text-slate-700">
    //                 {propertyData?.floor_no}
    //               </p>
    //             </div>
    //             <div className="flex items-center gap-28">
    //               <p className="text-sm text-slate-500">Car parking</p>
    //               <p className="text-sm text-slate-700">
    //                 {propertyData?.car_parking}
    //               </p>
    //             </div>
    //           </div>
    //         </section>
    //         <section className="xl:w-3/5 border-[1px] border-slate-400 sm:mt-8 mt-4 p-4 rounded-md">
    //           <h2 className="font-bold mb-4">Overview</h2>
    //           <p className="text-sm">
    //             Step inside the grand foyer, where natural light dances through
    //             expansive windows, illuminating the open-concept living spaces.
    //             The seamless flow between the living room, dining area, and
    //             gourmet kitchen creates an inviting atmosphere for both
    //             entertaining and everyday living. The kitchen boasts
    //             top-of-the-line stainless steel appliances, sleek countertops,
    //             and ample storage, making it a chef’s dream come true.
    //           </p>
    //           <br />
    //           <p className="text-sm">
    //             The main floor of the property features a spacious master suite,
    //             providing a private sanctuary to unwind and rejuvenate. The
    //             en-suite bathroom offers a spa-like experience with a soaking
    //             tub, a walk-in shower, and exquisite finishes. Three additional
    //             well-appointed bedrooms, each with its own charm and character,
    //             await on the upper level, providing ample space for family
    //             members or guests.
    //           </p>
    //         </section>
    //       </div>
    //     </div>
    //   )}
    // </>
    <ViewDetails data={propertyData} route={location?.pathname} category={"properties"}/>
  );
};

export default PropertiesDetails;
