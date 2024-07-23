import React,{useState,useEffect} from 'react'
import Navbar from '../Components/Navbar/Navbar'
import Footer from '../Components/Footer/Footer'
import Categories from '../Components/Categories/Categories'
import { Link } from 'react-router-dom'
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/skyblue';
import Button from '../Components/Button/Button'
import LatestAds from '../Components/LatestAds/LatestAds'
import ProductCard from '../Components/Cards/ProductCard'
import axiosInstance from '../api/axiosInstance'
import { IoFilterOutline } from "react-icons/io5";


const Hospitality = () => {
  const [priceRange, setPriceRange] = useState({min_price:'', max_price:''});
  const token = localStorage.getItem('token');
  const [hospitalityList, setHospitalityList] = useState([])
  const [notFound, setNotFound] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  useEffect(()=> {
    axiosInstance.get('api/hospitality/list')
    .then(response => {
      console.log(response);
      setHospitalityList(response.data.data.hospitality);
    })
    .catch(error => {
      console.error(error);
    });
  },[]);

  const filterHandler = () => {
    console.log(priceRange)
    axiosInstance.get(`api/hospitality/filter?minPrice=${priceRange.min_price}&maxPrice=${priceRange.max_price}`)
    .then(response=> {
      console.log(response);
      setHospitalityList(response.data.data.advertisements)
    })
    .catch(err=> {
      console.log(err)
      if(err.response.http_status_code=404){
        setNotFound(true);
      }
    })
  }

  return (
    <>
       
        <Categories/>
        <div className='md:px-12 sm:px-4 px-2 py-2 max-w-[1450px] m-auto '>
            <div className='flex gap-2 sm:mb-6'>
                <Link to="/" className='font-semibold'>Home</Link>
                <p> {'>'} </p>
                <Link className='font-semibold'>Hospitality</Link>
            </div>
            <div>
                <Splide aria-label="Banner" >
                    <SplideSlide>
                        <img src="/assets/Post/hospitality (3).jpg" className='w-[100%] rounded-xl' alt="Image 1"/>
                    </SplideSlide>
                    {/* <SplideSlide>
                        <img src="/assets/Banner/properties_banner.png" className='w-[100%]'    alt="Image 1"/>
                    </SplideSlide> */}
                </Splide>
            </div>
            <div className='py-4 flex flex-col gap-4'>
              <div className='flex flex-col gap-2'> 
                  <div className='w-full max-w-[300px] bg-white'>
                    <div className='bg-[#3484A1] px-2 py-[3px] rounded text-white shadow flex flex-row items-center gap-2 cursor-pointer w-fit' onClick={()=> setShowFilter(!showFilter)}>
                      <h3 className='font-semibold'>Filter</h3>
                      <IoFilterOutline/>
                    </div>
                    {showFilter && <>
                      <p className='block text-sm text-gray-500 mt-2'>Choose Budget range</p>
                    <div className='my-2 flex flex-row items-center gap-2'>
                      <input required className='border border-gray-200 rounded w-[35vw]' type="number" placeholder='Minimum price' name='min_price' onChange={(e) => setPriceRange((prev) => ({ ...prev, [e.target.name]: e.target.value }))} />
                      <p className='font-bold'>To</p>
                      <input required className='border border-gray-200 rounded w-[35vw] ' type="number" placeholder='Maximum price' name='max_price' onChange={(e) => setPriceRange((prev) => ({ ...prev, [e.target.name]: e.target.value }))} />
                      <Button category={'primarybtn'} clickHandler={filterHandler}>Search</Button>
                  </div>
                  {notFound && <p className='text-[red] text-sm'>*Property Not Found! Please select a valid range</p>}

                    </>}
                    
                   
                  </div>
              </div>
              <div className='grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 md:gap-4 '>
                {hospitalityList?.map(item => (
                  <ProductCard data={item} key={item.id} link={'/hospitalitydetails'}/>
                ))}
            
              </div>
              
            </div>
        </div>  
        
    </>
  )
}

export default Hospitality
