// import React,{useState,useEffect} from 'react'
// import Navbar from '../Components/Navbar/Navbar'
// import Footer from '../Components/Footer/Footer'
// import Categories from '../Components/Categories/Categories'
// import { Link } from 'react-router-dom'
// import { Splide, SplideSlide } from '@splidejs/react-splide';
// import '@splidejs/react-splide/css/skyblue';
// import Button from '../Components/Button/Button'
// import LatestAds from '../Components/LatestAds/LatestAds'
// import ProductCard from '../Components/Cards/ProductCard'
// import axiosInstance from '../api/axiosInstance'

// const Doctors = () => {
//   const token = localStorage.getItem('token');
//   const [doctorsList, setDoctorsList] = useState([])
//   const [expertise, setExpertise] = useState('');
//   const [notFound, setNotFound] = useState(false)

//   useEffect(()=> {
//     axiosInstance.get('api/doctors/list')
//     .then(response => {
//       console.log(response);
//       setDoctorsList(response.data.data.advertisements);
//     })
//     .catch(error => {
//       console.error(error);
//     });
//   },[]);

//   const filterHandler = () => {
//     axiosInstance.get(`api/doctors/filter?expertise=${expertise}`)
//     .then(response=> {
//       console.log(response);
//       setDoctorsList(response.data.data.advertisements)
//     })
//     .catch(err=> {
//       console.log(err)
//       if(err.response.http_status_code=404){
//         setNotFound(true);
//       }
//     })
//   }

//   return (
//     <>
//         <Categories/>
//         <div className='md:px-12 sm:px-4 px-2 py-2'>
//             <div className='flex gap-2 sm:mb-6'>
//                 <Link to="/" className='font-semibold'>Home</Link>
//                 <p> {'>'} </p>
//                 <a href="" className='font-semibold'>Properties</a>
//             </div>
//             <div>
//                 <Splide aria-label="Banner" >
//                     <SplideSlide>
//                         <img src="/assets/Banner/properties_banner.png" className='w-[100%]'    alt="Image 1"/>
//                     </SplideSlide>
//                     <SplideSlide>
//                         <img src="/assets/Banner/properties_banner.png" className='w-[100%]'    alt="Image 1"/>
//                     </SplideSlide>
//                 </Splide>
//             </div>
//             <div className='py-8 flex gap-8'>
//               <div className='flex flex-col gap-2'>
//                   <div className='w-[20vw] shadow border-gray-300 border-[1px] rounded-md p-4 bg-white'>
//                     <h3 className='font-bold text-lg mb-4'>Filter</h3>
//                     <p>Choose Expertise</p>
//                     <div className='my-2 flex flex-col gap-2'>
//                         <select name="expertise" onChange={(e)=> setExpertise(e.target.value)}>
//                             <option value="Diabetese">Diabetes</option>
//                             <option value="Gynacology">Gynaecology</option>
//                             <option value="general physician">General Physician</option>
//                         </select>
//                         <Button category={'primarybtn'} clickHandler={filterHandler}>Search</Button>
//                         {notFound && <p className='text-[red] text-sm'>*Property Not Found! Please select a valid range</p>}
//                     </div>
//                   </div>
//               </div>
//               <div className=' w-[80%] grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-2 md:gap-4 m-auto'>
//                 {doctorsList.map(item => (
//                   <ProductCard data={item} key={item.id} link={'/hospitalitydetails'}/>
//                 ))}

//               </div>

//             </div>
//         </div>

//     </>
//   )
// }

// export default Doctors

import React, { useState, useEffect } from "react";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";
import Categories from "../Components/Categories/Categories";
import { Link } from "react-router-dom";
import { Splide, SplideSlide } from "@splidejs/react-splide";
import "@splidejs/react-splide/css/skyblue";
import Button from "../Components/Button/Button";
import LatestAds from "../Components/LatestAds/LatestAds";
import ProductCard from "../Components/Cards/ProductCard";
import axiosInstance from "../api/axiosInstance";
import { IoFilterOutline } from "react-icons/io5";
import Hospitals from "./Hospitals";
import HospitalCard from "../Components/Cards/HospitalCard";
import { hospitalTypeList } from "../data/constains";

const Doctors = () => {
  const token = localStorage.getItem("token");
  const [doctorsList, setDoctorsList] = useState([]);
  const [hospitalityList, setHospitalityList] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [expertise, setExpertise] = useState("");
  const [notFound, setNotFound] = useState(false);
  const [showFilter, setShowFilter] = useState("");
  const [filterVisible,setFilterVisible]= useState(false);
  const [selectedHospitalType,setSelectedHospitalType]= useState("");
  const [priceRange, setPriceRange] = useState({
    min_price: "",
    max_price: "",
  });
  useEffect(() => {
    axiosInstance
      .get("api/doctor/list")
      .then((response) => {
        console.log(response);
        setDoctorsList(response.data.data.doctors);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filterHandlerDoctors = () => {
    axiosInstance
      .get(`api/doctor/filter?expertise=${expertise}`)
      .then((response) => {
        console.log(response);
        setDoctorsList(response.data.data.doctors);
      })
      .catch((err) => {
        console.log(err);
        if ((err.response.http_status_code = 404)) {
          setNotFound(true);
        }
      });
  };

  useEffect(() => {
    axiosInstance
      .get("api/hospital/list")
      .then((response) => {
        console.log(response);
        setHospitalityList(response.data.data.hospital);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filterHandlerHospitals = () => {
    console.log(priceRange);
    axiosInstance
      .get(
        `api/hospital/filter?type=${selectedHospitalType}`
      )
      .then((response) => {
        console.log(response);
        setHospitalityList(response.data.data.hospitals);
      })
      .catch((err) => {
        console.log(err);
        if ((err.response.http_status_code = 404)) {
          setNotFound(true);
        }
      });
  };

  const handleActiveTab = (tab) => {
    setActiveTab(tab);
    setShowFilter(tab);
  };

  return (
    <>
      <Categories />
      <div className="md:px-12 sm:px-4 px-2 py-2 max-w-[1450px] m-auto ">
        <div className="flex gap-2 sm:mb-6">
          <Link to="/" className="font-semibold">
            Home
          </Link>
          <p> {">"} </p>
          <Link className="font-semibold">
            Healthcare
          </Link>
        </div>
        <div>
          <Splide aria-label="Banner">
            <SplideSlide>
              <img
                src="/assets/Post/healthcare (2).jpg"
                className="w-[100%] rounded-xl"
                alt="Image 1"
              />
            </SplideSlide>
            {/* <SplideSlide>
              <img
                src="/assets/Banner/properties_banner.png"
                className="w-[100%]"
                alt="Image 1"
              />
            </SplideSlide> */}
          </Splide>
        </div>
        <div className="py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-full max-w-[300px] bg-white">
              <div className="flex items-center gap-5">
                <div onClick={()=>setFilterVisible(!filterVisible)} className="bg-[#3484A1] px-2 py-[3px] rounded text-white shadow flex flex-row items-center gap-2 cursor-pointer w-fit">
                  <h3 className="font-semibold">Filter</h3>
                  <IoFilterOutline />
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleActiveTab("all")}
                    className={`${
                      activeTab === "all" && "bg-gray-200"
                    } border-[1px] border-slate-400 px-2 py-[2px] rounded-md`}
                  >
                    All
                  </button>
                  <button
                    onClick={() => handleActiveTab("doctors")}
                    className={`${
                      activeTab === "doctors" && "bg-gray-300"
                    } border-[1px] border-slate-400 px-2 py-[2px] rounded-md`}
                  >
                    Doctors
                  </button>
                  <button
                    onClick={() => handleActiveTab("hospitals")}
                    className={`${
                      activeTab === "hospitals" && "bg-gray-200"
                    } border-[1px] border-slate-400 px-2 py-[2px] rounded-md`}
                  >
                    Hospitals
                  </button>
                </div>
              </div>

              {showFilter === "doctors" && filterVisible ? (
                <>
                  <p className="block text-sm text-gray-500 mt-2">
                    Choose Expertise
                  </p>
                  <div className="my-2 flex flex-row items-center gap-2">
                    <select
                      name="expertise"
                      className="border-gray-400 text-gray-600 py-[3px]"
                      onChange={(e) => setExpertise(e.target.value)}
                    >
                      <option value="Diabetese">Diabetes</option>
                      <option value="Gynacology">Gynaecology</option>
                      <option value="general physician">
                        General Physician
                      </option>
                    </select>
                    <Button
                      category={"primarybtn"}
                      clickHandler={filterHandlerDoctors}
                    >
                      Search
                    </Button>
                  </div>
                  {notFound && (
                    <p className="text-[red] text-sm">
                      *Property Not Found! Please select a valid range
                    </p>
                  )}
                </>
              ) : (
                showFilter === "hospitals" && filterVisible && (
                  <div>
                    <div className="flex items-center">
                    <div className="">
                      <p className="font-medium py-2">Type</p>
                      <select name="" onChange={(e)=>setSelectedHospitalType(e.target.value)} id="">
                        {hospitalTypeList?.map((item,index)=>(
                          <option key={index} value={item}>{item}</option>
                        ))}
                      </select>
                    </div>
                    <div className="mx-2 mt-10">
                      <Button
                        category={"primarybtn"}
                        clickHandler={filterHandlerHospitals}
                      >
                        Search
                      </Button>
                      </div>
                      </div>
                    {notFound && (
                      <p className="text-[red] text-sm">
                        *Property Not Found! Please select a valid range
                      </p>
                    )}
                  </div>
                )
              )}
            </div>
          </div>
          {(activeTab === "doctors" || activeTab === "all") && (
            <>
              {" "}
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 md:gap-4 ">
                {doctorsList?.map((item) => (
                  <ProductCard
                    data={item}
                    key={item.id}
                    link={"/doctordetails"}
                  />
                ))}
              </div>
            </>
          )}
          {(activeTab === "hospitals" || activeTab === "all") && (
            <>
              {/* <p className="text-2xl text-center font-bold">Hospitals</p> */}
              <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 md:gap-4 ">
                {hospitalityList?.map((item) => (
                  <HospitalCard
                    data={item}
                    key={item.id}
                    link={"/hospitaldetails"}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default Doctors;
