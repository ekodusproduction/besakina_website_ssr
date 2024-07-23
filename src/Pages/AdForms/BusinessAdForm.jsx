import React,{useState} from 'react'
import Navbar from '../../Components/Navbar/Navbar'
import Footer from '../../Components/Footer/Footer'
import { FaCamera } from "react-icons/fa";
import Button from '../../Components/Button/Button';
import '../../styles/style.css'
import axiosInstance from '../../api/axiosInstance'
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../Components/BackButton/BackButton';

const BusinessAdForm = () => {
    const [selectedImages, setSelectedImages] = useState([]);
    const [image, setImage] = useState([]);
    const [submitting, setSubmitting] = useState(false);

    const token = localStorage.getItem('token')
    const navigate = useNavigate();

    const imageHandler = (e,index) => {
        const files = e.target.files;
    
          if (files.length > 0) {
            const reader = new FileReader();
            reader.onloadend = () => {
              const img = new Image();
              img.src = reader.result;
              img.onload = () => {
                const canvas = document.createElement('canvas');
                const maxWidth = 800; // Set your desired max width
                const maxHeight = 600; // Set your desired max height
                let width = img.width;
                let height = img.height;
          
                if (width > height) {
                  if (width > maxWidth) {
                    height *= maxWidth / width;
                    width = maxWidth;
                  }
                } else {
                  if (height > maxHeight) {
                    width *= maxHeight / height;
                    height = maxHeight;
                  }
                }
          
                canvas.width = width;
                canvas.height = height;
          
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, width, height);
          
                canvas.toBlob((blob) => {
                  const compressedFile = new File([blob], files[0].name, { type: 'image/jpeg', lastModified: Date.now() });
          
                  const newImages = [...image];
                  newImages[index] = canvas.toDataURL('image/jpeg', 0.5); // Use canvas.toDataURL to get the compressed image
                  setImage(newImages);

                  setSelectedImages(prev => {
                    const newSelectedImages = [...prev];
                    newSelectedImages[index] = compressedFile;
                    return newSelectedImages;
                  });
                }, 'image/jpeg', 0.5); 
              };
            };
            reader.readAsDataURL(files[0]);
          }
       
    }

    const formSubmitHandler = (e) => {
        setSubmitting(true)
        e.preventDefault();
        const data = new FormData(e.target);
        const value = Object.fromEntries(data.entries());
       
        console.log({...value,images:selectedImages})
        axiosInstance.post('api/property/add', {...value, images:selectedImages} , {
            headers: {
                'Content-Type': 'multipart/form-data',
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
            console.log("hiiiii",err?.response?.data?.message)
            setSubmitting(false)
            Swal.fire({
                title: err?.response?.data?.message,
                // text: err?.response?.data?.message,
                icon: "warning"
            });
              if (err?.response?.data?.message === "User Profile Incomplete") {
                  navigate("/setup-profile");
              }
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

  return (
   <>
     
            <section className='bg-white'>
                <div>
                    <BackButton path={(-1)} style={"absolute pt-3 pl-12"}/>
                    <p className='text-center py-4 font-semibold text-xl border-b-[1px] border-gray-300'>POST YOUR AD</p>
                </div>
                <div className='flex justify-center p-8 gap-16'>
                    <form action="" className='flex flex-col gap-8' onSubmit={formSubmitHandler}>
                            <h3 className='mb-2 font-semibold text-xl'>Add Some Details</h3>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Product/Bussiness name*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='name' className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Ad title*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='title' className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                          <div>
                              <p className='mb-2 font-semibold text-gray-700'>Description*</p>
                              <div>
                                  <textarea type="text" name='description' className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md resize-none' />
                              </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Street*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='street' className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>City*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='city' className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Landmark*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='landmark' className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>State*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='state' className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <p className='mb-2 font-semibold text-gray-700'>Pincode*</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='pincode' className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <h3 className='font-bold mt-4 mb-2 text-xl '>Set a price</h3>
                                <p className='mb-2 font-semibold text-gray-700'>Price</p>
                                <div className='flex gap-2'>
                                    <input type="text" name='price' className='w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div>
                            <div>
                                <h3 className='font-bold mt-4  mb-4 text-xl text-gray-700'>Upload upto 20 photos</h3>
                                <div className='grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 text-gray-700'>
                                {[...Array(20)].map((_, index) => (
                                    <div key={index} className='border border-gray-400 rounded-md'>
                                        {selectedImages[index] ? (
                                            <div className='relative'>
                                                <img src={image[index]} alt={`Image ${index}`} className='h-24 w-32 rounded-md' />
                                                <button type='button' onClick={() => handleDeleteImage(index)} className='text-[#f58181] p-[2px] shadow-md rounded absolute top-[2px] right-[2px] text-sm font-bold'>X</button>
                                            </div>
                                        ) : (
                                            <label htmlFor={`file-${index}`} className='cursor-pointer h-24 w-32 flex justify-center items-center'>
                                            <FaCamera size={30} color='gray'/>
                                            </label>
                                        )}
                                        <input type="file" id={`file-${index}`} accept="image/*" onChange={(e) => imageHandler(e, index)} className='hidden' />
                                    </div>
                                    ))} 
                                </div>
                            </div>
                            <div className='flex justify-end'>
                            <Button category={'primarybtn'} type={'submit'} disabled={submitting}>{submitting? 'Submitting':'Submit'}</Button>
                            </div>
                    </form>
                </div>
            </section>
       
   </>
  )
}

export default BusinessAdForm