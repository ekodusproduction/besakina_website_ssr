import React,{useEffect, useState} from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { FaCamera } from "react-icons/fa";
import Button from '../../Components/Button/Button';
import '../../styles/style.css'
import axiosInstance, { baseURL } from '../../api/axiosInstance'
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';

const BusinessEditForm = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [image, setImage] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem('token')
    const navigate = useNavigate();
    const { id } = useParams();
    const [businessData, setBusinessData] = useState({});

    useEffect(() => {
        axiosInstance.get(`api/property/id/${id}`)
            .then((response) => {
                console.log(response);
                const data = response.data.data.advertisement;
                setBusinessData(data);
            })
            .catch((error) => {
                console.error(error)
            })
    }, [id]);

    useEffect(() => {
        if (businessData?.images?.length) {
          setSelectedImages((prev) => [
            ...prev, // Spread the previous images
            ...businessData?.images, // Spread the new images fetched from vehicleData
          ]);
        }
      }, [businessData?.images]);

    const imageHandler = (e) => {
        if (selectedImages?.length >= 20) {
          Swal.fire({
            title: 'Error',
            text: 'You can upload photos upto 20',
            icon: 'error',
          });
          return;
        }
        const file = e.target.files[0];
    
        if (!file) {
          console.error('No file selected');
          return;
        }
        const formData = new FormData();
        formData.append('image', file);
    
        axiosInstance
          .post(`api/property/images/id/${id}`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            if (Array.isArray(response.data)) {
              setSelectedImages((prev) => [
                ...prev, // Spread the previous images
                ...response.data[0], // Spread the new images fetched from vehicleData
              ]);
            } else {
              // Handle non-array response data
              setSelectedImages((prev) => [
                ...prev,
                response?.data?.data[0], // Assuming response data is a single image object
              ]);
            }
          })
          .catch((error) => {
            console.error('Error uploading image:', error);
          });
      };
    const formSubmitHandler = (e) => {
        setSubmitting(true)
        e.preventDefault();
        const data = e.target;
        const value = {};

        for (let i = 0; i < data.length; i++) {
            const { name, value: val } = data[i];
            if (name !== "" && name !=="car_parking") {
                value[name] = val;
            }
        }
       
        const body = {
            ...value,
        }
        axiosInstance.put(`api/property/id/${id}`, body , {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
          }).then((response)=> {
            console.log(response)
            Swal.fire({
                title: "Success",
                text: "The form was successfully submitted",
                icon: "success"
              });
            setSubmitting(false);
            navigate("/");
          }).catch(err=> {
            console.log(err)
            setSubmitting(false)
            Swal.fire({
                title: "Error",
                text: "Something went wrong",
                icon: "error"
              });
          })
       
    }

    const imageDeleteHandler = (image) => {
        const body = {
            images:image,
        }

        axiosInstance.delete(`api/property/images/delete/id/${id}`, {
            data: body,
            headers: {
                Authorization : `Bearer ${token}`,
            }
        })
        .then((response) => {
            console.log("delete", response);
        })
        .catch((error) => {
            console.error("Error: ",error)
        })
    }
    const handleDeleteImage = (index) => {
        const newImages = [...image];
        const newSelectedImages = [...selectedImages]
        newImages.splice(index, 1);
        newSelectedImages.splice(index,1)
        setImage(newImages);
        setSelectedImages(newSelectedImages)
    };
    
    const handleEditForm = (e, fieldName) => {
        const value = e.target.value;
        setPropertyData((prevState) => ({
            ...prevState,
            [fieldName] : value,
        }))
    }

  return (
   <>
     
            <section className='bg-white'>
                <div >
                    <p className='text-center py-4 font-semibold text-xl border-b-[1px] border-gray-300'>POST YOUR AD</p>
                </div>
                <div className='flex justify-center p-8 gap-16'>
                    <div>
                        <form action="" className='flex flex-col gap-8' onSubmit={formSubmitHandler}>
                            <h3 className='mb-2 font-semibold text-xl'>Add Some Details</h3>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Product/Business name*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='super_builtup_area' value={businessData?.super_builtup_area} onChange={(e)=>handleEditForm(e,"super_builtup_area")} className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Ad title*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='carpet_area' value={businessData?.carpet_area} onChange={(e)=>handleEditForm(e,"carpet_area")} className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Description*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='maintainance' className='w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Street*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='street' value={businessData?.street} onChange={(e)=>handleEditForm(e,"street")} className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>City*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='city' value={businessData?.city} onChange={(e)=>handleEditForm(e,"city")} className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Landmark*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='landmark' value={businessData?.landmark} onChange={(e)=>handleEditForm(e,"landmark")} className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>State*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='state' value={businessData?.state} onChange={(e)=>handleEditForm(e,"state")} className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Pincode*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='pincode' value={businessData?.pincode} onChange={(e)=>handleEditForm(e,"pincode")} className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <h3 className='font-bold mt-4 mb-2 text-xl '>Set a price</h3>
                                <p className='mb-2 font-semibold text-gray-700'>Price</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='price' value={businessData?.price} onChange={(e)=>handleEditForm(e,"price")} className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 text-gray-700">
                      {selectedImages?.map((image, index) => (
                        <div
                          key={index}
                          className="border border-gray-400 rounded-md"
                        >
                          <div className="relative">
                            <img
                              src={`${image}`}
                              alt="photo"
                              className="h-24 rounded-md w-32"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                handleDeleteImage(index);
                                imageDeleteHandler(image);
                              }}
                              className="text-[#f58181] p-[2px] shadow-md rounded absolute top-[2px] right-[2px] text-sm font-bold"
                            >
                              X
                            </button>
                          </div>
                        </div>
                      ))}
                      <div className="border border-gray-400 rounded-md">
                        <label
                          htmlFor={`file-1`}
                          className="cursor-pointer h-24 w-32  flex justify-center items-center"
                        >
                          <FaCamera size={30} color="gray" />
                        </label>
                        <input
                          type="file"
                          id={`file-1`}
                          accept="image/*"
                          onChange={(e) => imageHandler(e)}
                          className="hidden"
                        />
                      </div>
                    </div>
                            <div className='flex justify-end'>
                            <Button category={'primarybtn'} type={'submit'} disabled={submitting}>{submitting? 'Submitting':'Submit'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            </section>
       
   </>
  )
}

export default BusinessEditForm