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
import { propertyType } from '../data/constains'


const Properties = () => {
  const [priceRange, setPriceRange] = useState({min_price:0, max_price:''});
  const token = localStorage.getItem('token');
  const [propertiesList, setPropertiesList] = useState([]);
  const [selectedPropertyType,setSelectedPropertyType] = useState("");
  const [notFound, setNotFound] = useState(false)
  const [showFilter, setShowFilter] = useState(false)

  useEffect(()=> {
    axiosInstance.get('api/property/list')
    .then(response => {
      console.log(response);
      setPropertiesList(response.data.data.property);
    })
    .catch(error => {
      console.error(error);
    });
  },[]);

  
  const filterHandler = () => {
    let url = `api/property/filter?minPrice=${priceRange.min_price}`;
    if (selectedPropertyType) url += `&type=${selectedPropertyType}`;
    if (priceRange.max_price) url += `&maxPrice=${priceRange.max_price}`;
    console.log(priceRange)
    axiosInstance.get(url)
    .then(response=> {
      console.log(response);
      setPropertiesList(response.data.data.property)
    })
    .catch(err=> {
      console.log(err)
      if(err.response.http_status_code=404){
        setNotFound(true);
      }
    })
  }

  const handleFilterPropertyType=(event)=>{
    setSelectedPropertyType(event.target.value)
  }
  const options = {
    type         : 'loop',
    autoplay     : true,
    interval: 2000,
    pauseOnHover : false,
    resetProgress: false,
  };
  return (
    <>
       
        <Categories/>
        <div className='md:px-12 sm:px-4 px-2 py-2 max-w-[1450px] m-auto '>
            <div className='flex gap-2 sm:mb-6'>
                <Link to="/" className='font-semibold'>Home</Link>
                <p> {'>'} </p>
                <Link className='font-semibold'>Properties</Link>
            </div>
            <div>
                <Splide aria-label="Banner" options={options}>
                    <SplideSlide>
                        <img src="/assets/Post/real-estate-banner (2).jpg" className='w-[100%] rounded-xl' alt="Image 1"/>
                    </SplideSlide>
                    {/* <SplideSlide>
                        <img src="/assets/Banner/properties_banner.png" className='w-[100%]' alt="Image 1"/>
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
                    {showFilter && <div className='flex items-center gap-5'>
                      <div>
                    <p className='text-sm font-medium pb-2'>Type</p>
                    <select onChange={handleFilterPropertyType}>
                      {propertyType?.map((item,index)=>(
                        <option key={index} value={item.value}>{item.label}</option>
                      ))}
                    </select>
                    </div>
                    <div>
                      <p className='block text-sm text-gray-500 mt-2'>Choose Budget range</p>
                    <div className='my-2 flex flex-row items-center gap-2'>
                      <input required className='border border-gray-200 rounded w-[10vw]' type="number" placeholder='Minimum price' name='min_price' onChange={(e) => setPriceRange((prev) => ({ ...prev, [e.target.name]: e.target.value }))} />
                      <p className='font-bold'>To</p>
                      <input required className='border border-gray-200 rounded w-[10vw] ' type="number" placeholder='Maximum price' name='max_price' onChange={(e) => setPriceRange((prev) => ({ ...prev, [e.target.name]: e.target.value }))} />
                      <Button category={'primarybtn'} clickHandler={filterHandler}>Search</Button>
                  </div>
                  </div>
                  {notFound && <p className='text-[red] text-sm'>*Property Not Found! Please select a valid range</p>}

                    </div>}
                    
                   
                  </div>
              </div>
              <div className='grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 md:gap-4 '>
                {propertiesList?.map(item => (
                  <ProductCard data={item} key={item.id} link={'/propertiesdetails'}/>
                ))}
            
              </div>
              
            </div>
        </div>  
        
    </>
  )
}

export default Properties