import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { FaCamera } from 'react-icons/fa';
import '../../styles/style.css';
import Button from '../../Components/Button/Button';
import axiosInstance, { baseURL } from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { StateCitiesData } from '../../data/Indian_Cities_In_States';
import { HospitalityTypeData } from '../../data/hospitalityData';
import toast from 'react-hot-toast';

const HospitalityEditForm = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const token = localStorage.getItem('token');
  const [image, setImage] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const [hospitalityData, setHospitalityData] = useState({});
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  useEffect(() => {
    axiosInstance
      .get(`api/hospitality/id/${id}`)
      .then((response) => {
        console.log(response);
        const data = response.data.data;
        setHospitalityData(data);
        setSelectedState(data?.state);
        setSelectedCity(data?.city);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    if (hospitalityData?.images?.length) {
      setSelectedImages((prev) => [
        ...prev, // Spread the previous images
        ...hospitalityData?.images, // Spread the new images fetched from vehicleData
      ]);
    }
  }, [hospitalityData?.images]);

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
      .post(`api/hospitality/images/id/${id}`, formData, {
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
    e.preventDefault();
      setSubmitting(true);
      

    const data = e.target;
    const value = {};

    for (let i = 0; i < data.length; i++) {
        const { name, value: val } = data[i];
  
        if (name !== "" && name !== "type") {
          value[name] = val;
        }
    }
  
    const body = {
      ...value,
      type: hospitalityData?.type,
    };

    axiosInstance
      .put(
          `api/hospitality/id/${id}`,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success(response?.data?.message);
        setSubmitting(false);
        navigate(`/hospitalitydetails/${id}`);
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        toast.error(err?.response?.data?.message);
      });
  };
  const handleDeleteImage = (index) => {
    const newImages = [...image];
    const newSelectedImages = [...selectedImages];
    newImages.splice(index, 1);
    newSelectedImages.splice(index, 1);
    setImage(newImages);
    setSelectedImages(newSelectedImages);
  };
  const imageDeleteHandler = (image) => {
    const body = {
      images: image,
    };
    axiosInstance
      .delete(`api/hospitality/image/delete/id/${id}`, {
        data: body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('delete', response);
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };
  const handleEditForm = (e, fieldName) => {
    const value = e.target.value;
    setHospitalityData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };
  return (
    <>
      <section className="bg-white">
        <div>
          <p className="text-center py-4 font-semibold text-xl border-b-[1px] border-gray-300">
            POST YOUR AD
          </p>
        </div>
        <div className="flex justify-center p-8 gap-16">
          {/* <div className='flex flex-col gap-4 '>
                        <h3 className='mb-2 font-semibold text-xl'>Properties</h3>
                        <a href="">For Sale: Houses and Apartments</a>
                        <a href="">For Rent: Houses and Apartments</a>
                        <a href="">Lands & Plots</a>
                        <a href="">For Rent: Shops & Offices</a>
                        <a href="">For Sale: Shops & Offices</a>
                        <a href="">PG & Guest House</a>
                    </div> */}
          <div>
            <form
              action=""
              className="flex flex-col gap-8"
              onSubmit={formSubmitHandler}
            >
              <h3 className="mb-2 font-semibold text-xl">Add Some Details</h3>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Select Type*</p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  {HospitalityTypeData?.map((item,index)=>(
                  <div key={index} className="border-[1px] border-gray-400 rounded-sm">
                    <input
                      type="radio"
                      id={item.value}
                      name="type"
                      checked={hospitalityData?.type === item.value}
                      onChange={(e)=>handleEditForm(e,"type")}
                      value={item.value}
                      className="hidden"
                    />
                    <label for={item.value} className="px-4 py-[2px] cursor-pointer">
                    {item.label}
                    </label>
                  </div>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-2 font-semibold text-gray-700">Name*</p>
                <div className="flex gap-2">
                  <input
                    name="name"
                    type="text"
                    value={hospitalityData?.name}
                    onChange={(e) => handleEditForm(e, 'name')}
                    className="w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>

              <div>
                <p className="mb-2 font-semibold text-gray-700">Ad Title*</p>
                <div className="flex gap-2">
                  <input
                    name="title"
                    type="text"
                    value={hospitalityData?.title}
                    onChange={(e) => handleEditForm(e, 'title')}
                    className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Describe what you are selling*
                </p>
                <div className="flex gap-2">
                  <input
                    name="description"
                    title="description"
                    type="text"
                    value={hospitalityData?.description}
                    onChange={(e) => handleEditForm(e, 'description')}
                    className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Street*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="street"
                    value={hospitalityData?.street}
                    onChange={(e) => handleEditForm(e, 'street')}
                    className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Locality*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="locality"
                    value={hospitalityData?.locality}
                    onChange={(e) => handleEditForm(e, 'locality')}
                    className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div>
                  <p className="mb-2 font-semibold text-gray-700">State*</p>
                  <select
                    name="state"
                    id="state"
                    value={selectedState}
                    onChange={(e) => setSelectedState(e.target.value)}
                  >
                    {Object.keys(StateCitiesData)?.map((state, index) => (
                      <option key={index} value={state}>
                        {state}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">City*</p>
                  <select
                    name="city"
                    id="city"
                    value={selectedCity}
                    onChange={(e) => setSelectedCity(e.target.value)}
                  >
                    <option value="" defaultChecked>
                      Select City
                    </option>
                    {StateCitiesData[selectedState]?.map((city, index) => (
                      <option
                        key={index}
                        value={city}
                        className="cursor-pointer"
                      >
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Pincode*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="pincode"
                    value={hospitalityData?.pincode}
                    onChange={(e) => handleEditForm(e, 'pincode')}
                    className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold mt-4 mb-2 text-xl ">Set a price</h3>
                <p className="mb-2 font-semibold text-gray-700">Price</p>
                <div className="flex gap-2">
                  <input
                    name="price"
                    type="text"
                    value={hospitalityData?.price}
                    onChange={(e) => handleEditForm(e, 'price')}
                    className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                  />
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
              <div className="flex justify-end">
                <Button
                  category={'primarybtn'}
                  type={'submit'}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting' : 'Submit'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </section>
    </>
  );
};

export default HospitalityEditForm;
