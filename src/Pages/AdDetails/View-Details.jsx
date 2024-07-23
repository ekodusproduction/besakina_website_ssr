import React, { useState } from 'react';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { MdLocationPin } from 'react-icons/md';
import dayjs from 'dayjs';
import { useLogin } from '../../hooks/useLogin';
import Contactseller from '../../Components/ContactSeller/Contactseller';

const ViewDetails = ({ data, route, category }) => {
  const { id } = useParams();
  const token = localStorage.getItem('token');
  const { isLoggedIn, setIsLoggedIn } = useLogin();
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [contactDetails, setContactDetails] = useState([]);
  const navigate = useNavigate();
  // useEffect(()=> {
  //     axiosInstance.get(`api/property/id/${id}`)
  //     .then(response => {
  //         console.log(response)
  //         const data = response.data.data;
  //         const updatedData = {
  //             ...data,
  //             images: data.images.map(image => ({

  //                 original: image,
  //                 thumbnail: image,
  //             }))
  //         };
  //         setPropertyData(updatedData);

  //     })
  //     .catch(error => {
  //       console.error(error);
  //     });
  //   },[id])

  function convertString(str) {
    // Replace underscores with spaces
    return String(str).replace(/_/g, ' ');
  }

  const postedDate = dayjs(data?.created_at);
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
    <>
      {Object.keys(data).length > 0 && (
        <div className="max-w-[1500px] m-auto">
          <div className="md:px-12 sm:px-4 px-2 py-8">
            <div className="flex gap-2 sm:mb-6 mb-4">
              <Link to="/" className="font-semibold">
                Home
              </Link>
              <p> {'>'}</p>
              <Link to={-1} className="font-semibold capitalize">
                {category}
              </Link>
            </div>
            <section className="flex xl:flex-row flex-col gap-4 ">
              <div className="xl:w-3/5">
                <ImageGallery items={data?.images} lazyLoad={true} />
              </div>
              <div className="xl:w-2/5 border-[1px] border-slate-400 sm:px-6 py-6 px-2 h-[100%] rounded-md ">
                <div className="pb-4 border-b-[1px] border-slate-300 ">
                  <div className="flex justify-between ">
                    <h3 className="font-bold sm:text-3xl text-2xl mb-2 capitalize">
                      {data?.title}
                    </h3>

                    {/* <button className='mt-[-20px] bg-red'>
                                            <FaRegHeart size={25} />
                                        </button> */}
                  </div>
                  <p className="text-sm font-semibold mb-2 capitalize">
                    {data?.type ? convertString(data?.type) : ''}
                  </p>

                  <div className="mt-4 mb-4 flex  flex-col justify-between">
                    <span className="text-sm sm:text-base flex items-center text-slate-700">
                      <MdLocationPin size={25} />
                      {`${
                        data?.house_no && data?.house_no !== '0'
                          ? `House No: ${data?.house_no},`
                          : ''
                      } ${data?.street}, ${data?.city} - ${data?.pincode}, ${
                        data?.state
                      }`}
                    </span>
                  </div>
                  <div className="flex justify-between items-cnter">
                    <a href="" className="text-[#179CF0]">
                      Get Directions
                    </a>
                    <p className="font-bold text-sm">
                      <span className="font-semibold text-slate-600">
                        Posted:{' '}
                      </span>
                      {displayDate}
                    </p>
                  </div>
                </div>
                <Contactseller data={data} route={route} />
              </div>
            </section>

            {/* property */}
            {category == 'properties' && (
              <section className="xl:w-3/5 border-[1px] border-slate-400 sm:mt-8 mt-4 p-4 rounded-md overflow-x-scroll capitalize">
                <h2 className="font-bold mb-4">Details</h2>
                <div className="flex flex-col gap-2 min-w-[600px]">
                  <div className="flex justify-between">
                    <p className="w-1/4 text-slate-500 text-sm">Category:</p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {data?.advType}
                    </p>
                    <p className="w-1/4 text-sm text-slate-500">Bedrooms:</p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {data?.bedrooms}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    {/* <p className='w-1/4 text-sm text-slate-500'>Bathrooms</p>
                        <p className='w-1/4 text-sm text-slate-700'>{data?.bathrooms}</p> */}
                    <>
                      <p className="w-1/4 text-sm text-slate-500">
                        Total Rooms:
                      </p>
                      <p className="w-1/4 text-sm text-slate-700">
                        {data?.total_rooms != 0 ? data?.total_rooms : 'N/A'}
                      </p>
                    </>
                    <p className="w-1/4 text-sm text-slate-500">Furnishing:</p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {data?.furnishing}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p className="w-1/4 text-sm text-slate-500">
                      Construction Status
                    </p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {convertString(data?.construction_status)}
                    </p>
                    <p className="w-1/4 text-sm text-slate-500">Listed by:</p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {data?.listed_by}
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <>
                      <p className="w-1/4 text-sm text-slate-500">
                        Super buildup area:
                      </p>
                      <p className="w-1/4 text-sm text-slate-700">
                        {data?.super_builtup_area != 0
                          ? data?.super_builtup_area
                          : 'N/A'}
                      </p>
                    </>
                    <>
                      <p className="w-1/4 text-sm text-slate-500">
                        Carpet area:
                      </p>
                      <p className="w-1/4 text-sm text-slate-700">
                        {data?.carpet_area != 0 ? data?.carpet_area : 'N/A'}
                      </p>
                    </>
                  </div>
                  <div className="flex justify-between">
                    <>
                      <p className="w-1/4 text-sm text-slate-500">
                        Total floors:
                      </p>
                      <p className="w-1/4 text-sm text-slate-700">
                        {data?.total_floors != 0 ? data?.total_floors : 'N/A'}
                      </p>
                    </>
                    <>
                      <p className="w-1/4 text-sm text-slate-500">Floor No.</p>
                      <p className="w-1/4 text-sm text-slate-700">
                        {data?.floor_no != 0 ? data?.floor_no : 'N/A'}
                      </p>
                    </>
                  </div>
                  <div className="flex items-center gap-4">
                    <p className="w-[23%] text-sm text-slate-500">
                      Car parking
                    </p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {data?.car_parking}
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* vehicle */}
            {category == 'vehicle' && (
              <section className="xl:w-3/5 border-[1px] border-slate-400 sm:mt-8 mt-4 p-4 rounded-md overflow-x-scroll capitalize">
                <h2 className="font-bold mb-4">Details</h2>
                <div className="flex flex-col gap-2 min-w-[600px]">
                  <div className="flex justify-between pr-12">
                    {data?.advType && (
                      <div className="flex items-center gap-2">
                        <p className="text-slate-500 text-sm"> Category:</p>
                        <p className="text-sm text-slate-700">
                          {data?.advType}
                        </p>
                      </div>
                    )}
                    {data?.brand && (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-500">Brand:</p>
                        <p className="text-sm text-slate-700">{data?.brand}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-96">
                    {/* {data?.kilometer_driven && (
                      <div className='flex items-center gap-2'>
                        <p className="text-sm text-slate-500">
                          Kilometer Driven:
                        </p>
                        <p className="text-sm text-slate-700">
                          {data?.kilometer_driven}
                        </p>
                      </div>
                    )} */}
                    {data?.registration_year && (
                      <div className="flex items-center gap-4">
                        <p className="text-sm text-slate-500">
                          Registration Year:
                        </p>
                        <p className="text-sm text-slate-700">
                          {data?.registration_year}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </section>
            )}

            {/* education */}
            {category == 'education' && (
              <section className="xl:w-3/5 border-[1px] border-slate-400 sm:mt-8 mt-4 p-4 rounded-md overflow-x-scroll capitalize">
                <h2 className="font-bold mb-4">Details</h2>
                <div className="flex flex-col gap-2 min-w-[600px]">
                  <div className="flex justify-between">
                    <p className="w-1/4 text-slate-500 text-sm">Category:</p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {data?.advType}
                    </p>
                    <p className="w-1/4 text-sm text-slate-500">Domain:</p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {data?.domain
                        ? convertString(data?.domain)
                        : data?.domain}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="w-1/4 text-sm text-slate-500">
                      Institution Name:
                    </p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {data?.institution_name}
                    </p>
                    <p className="w-1/4 text-sm text-slate-500">
                      Course Duration:
                    </p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {data?.course_duration} {'months'}
                    </p>
                  </div>
                  <div className="flex">
                    <p className="w-1/4 text-sm text-slate-500">
                      Fees of the course:
                    </p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {'₹ ' + data?.price}
                    </p>
                  </div>
                </div>
              </section>
            )}
            {category == 'hospitality' && (
              <section className="xl:w-3/5 border-[1px] border-slate-400 sm:mt-8 mt-4 p-4 rounded-md overflow-x-scroll capitalize">
                <h2 className="font-bold mb-4">Details</h2>
                <div className="flex flex-col gap-2 min-w-[600px]">
                  <div className="flex items-center gap-56">
                    <div className="flex items-center gap-2">
                      <p className="text-slate-500 text-sm">Category:</p>
                      <p className="text-sm text-slate-700">{data?.advType}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm text-slate-500">City:</p>
                      <p className="text-sm text-slate-700">{data?.city}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-slate-500">Locality:</p>
                    <p className="text-sm text-slate-700">{data?.locality}</p>
                  </div>
                </div>
              </section>
            )}
            {/* doctor */}
            {category == 'doctor' && (
              <section className="xl:w-3/5 border-[1px] border-slate-400 sm:mt-8 mt-4 p-4 rounded-md overflow-x-scroll capitalize">
                <h2 className="font-bold mb-4">Details</h2>
                <div className="flex flex-col gap-2 min-w-[600px]">
                  <div className="flex justify-between">
                    <p className="w-1/4 text-slate-500 text-sm">Expertise:</p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {data?.expertise}
                    </p>
                    {data?.price_per_visit && (
                      <>
                        <p className="w-1/4 text-sm text-slate-500">
                          Fees per visit:
                        </p>
                        <p className="w-1/4 text-sm text-slate-700">
                          {data?.price_per_visit}
                        </p>
                      </>
                    )}
                  </div>
                  <div className="flex justify-between">
                    <p className="w-1/4 text-sm text-slate-500">
                      Total Experience:
                    </p>
                    <p className="w-1/4 text-sm text-slate-700">
                      {data?.total_experience} years
                    </p>
                  </div>
                </div>
              </section>
            )}

            {/* hospital */}
            {category == 'hospital' && (
              <section className="xl:w-3/5 border-[1px] border-slate-400 sm:mt-8 mt-4 p-4 rounded-md overflow-x-scroll capitalize">
                <h2 className="font-bold mb-4">Details</h2>
                <div className="flex flex-col gap-2 min-w-[500px]">
                  <div className="flex items-center justify-between pr-28">
                    {data?.advType && (
                      <div className="flex items-center gap-2">
                        <p className="text-sm text-slate-500">Category:</p>
                        <p className="text-sm text-slate-700">
                          {data?.advType == 'Hospital' && 'Healthcare'}
                        </p>
                      </div>
                    )}
                    {data?.name && (
                      <div className="flex items-center gap-2">
                        <p className="text-slate-500 text-sm">Name:</p>
                        <p className="text-sm text-slate-700">{data?.name}</p>
                      </div>
                    )}
                  </div>
                  {/* <div className='flex justify-between'>
                        {data?.price_registration &&
                        <>
                        <p className='w-1/4 text-sm text-slate-500'>Price per registration</p>
                        <p className='w-1/4 text-sm text-slate-700'>₹ {data?.price_registration} </p>
                        </>
}
                        {data?.price_per_visit &&
                        <>
                        <p className='w-1/4 text-sm text-slate-500'>Price per visit</p>
                        <p className='w-1/4 text-sm text-slate-700'>₹ {data?.price_per_visit} </p>
                        </>
}
                    </div> */}
                </div>
              </section>
            )}
            <section className="xl:w-3/5 border-[1px] border-slate-400 sm:mt-8 mt-4 p-4 rounded-md">
              <h2 className="font-bold mb-4">Overview</h2>
              <p className="text-sm">{data?.description}</p>
            </section>
          </div>
        </div>
      )}
    </>
  );
};

export default ViewDetails;
