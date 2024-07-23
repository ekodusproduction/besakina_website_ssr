import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { FaCamera } from 'react-icons/fa';
import '../../styles/style.css';
import Button from '../../Components/Button/Button';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../Components/BackButton/BackButton';
import { StateCitiesData } from '../../data/Indian_Cities_In_States';
import { HospitalityTypeData } from '../../data/hospitalityData';
import toast from 'react-hot-toast';
import ReactSelect from 'react-select';
import AddNewField from '../../Components/Global/AddNewField';

const HospitalityAdForm = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const token = localStorage.getItem('token');
  const [image, setImage] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [fillData, setFillData] = useState('');
  const initialSelectedState = Object.keys(StateCitiesData)[0];
  const [selectedState, setSelectedState] = useState(initialSelectedState);
  const [hospitalityType, setHospitalityType] = useState([]);
  const [modalOpen, setModalOpen] = useState('');
  const [newExpertise, setNewExpertise] = useState('');

  const navigate = useNavigate();

  const imageHandler = (e, index) => {
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

          canvas.toBlob(
            (blob) => {
              const compressedFile = new File([blob], files[0].name, {
                type: 'image/jpeg',
                lastModified: Date.now(),
              });

              const newImages = [...image];
              newImages[index] = canvas.toDataURL('image/jpeg', 0.5); // Use canvas.toDataURL to get the compressed image
              setImage(newImages);

              setSelectedImages((prev) => {
                const newSelectedImages = [...prev];
                newSelectedImages[index] = compressedFile;
                return newSelectedImages;
              });
            },
            'image/jpeg',
            0.5
          );
        };
      };
      reader.readAsDataURL(files[0]);
    }
  };

  const handleEditForm = (e, fieldName) => {
    const value = e.target.value;
    setFillData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const getFieldDetails = async (field) => {
    axiosInstance
      .get(`api/hospitality/formdata/fieldname/${field}`)
      .then((response) => {
        const data = response?.data?.data?.[field];
        if (field === 'type') {
          setHospitalityType(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getFieldDetails('type');
  }, []);

  const addField = async (field) => {
    const payload = {
      label: newExpertise,
      value: newExpertise,
      fieldname: field,
    };
    await axiosInstance
      .post(`api/hospitality/formdata`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success(response?.data?.message);
        getFieldDetails(field);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    setFillData({
      ...fillData,
      state: initialSelectedState,
      city: StateCitiesData[initialSelectedState][0],
    });
  }, []);

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
    setFillData((prevData) => ({
      ...prevData,
      state: selectedState,
    }));
  };

  const formSubmitHandler = () => {
    setSubmitting(true);

    axiosInstance
      .post(
        'api/hospitality/add',
        { ...fillData, images: selectedImages },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        toast.success(response?.data?.message);
        setSubmitting(false);
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        toast.error(err?.response?.data?.message);
        if (err?.response?.data?.message == 'User Profile Incomplete') {
          navigate('/setup-profile');
        }
      });
  };

  const handleChange = (selectedOption, fieldName) => {
    if (selectedOption.value === 'add-new') {
      setModalOpen(fieldName);
    } else {
      setModalOpen('');
    }

    setFillData((prevData) => ({
      ...prevData,
      [fieldName]: selectedOption.value,
    }));
  };

  const handleDeleteImage = (index) => {
    const newImages = [...image];
    const newSelectedImages = [...selectedImages];
    newImages.splice(index, 1);
    newSelectedImages.splice(index, 1);
    setImage(newImages);
    setSelectedImages(newSelectedImages);
  };
  return (
    <>
      <section className="bg-white">
        <div>
          <BackButton path={-1} style={'absolute pt-3 pl-12'} />
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
            <div className="flex flex-col gap-4">
              <h3 className="mb-2 font-semibold text-xl">Add Some Details</h3>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Ad Title/Name*
                </p>
                <div className="flex gap-2">
                  <input
                    name="title"
                    value={fillData?.title}
                    onChange={(e) => handleEditForm(e, 'title')}
                    type="text"
                    className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Select Type*</p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  <ReactSelect
                    className="w-60"
                    onChange={(e) => handleChange(e, 'type')}
                    options={[
                      ...hospitalityType,
                      { value: 'add-new', label: 'Add new type' },
                    ]}
                  />
                  {modalOpen === 'type' && (
                    <AddNewField
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onClick={() => addField('type')}
                      placeholder={'Add new type'}
                    />
                  )}
                </div>
              </div>

              {/* <div>
                                <p className='mb-2 font-semibold text-gray-700'>Name*</p>
                                <div className='flex gap-2'>
                                    <input name='name' type="text" className='w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md' />
                                </div>
                            </div> */}

              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Describe what you are selling*
                </p>
                <div className="flex gap-2">
                  <textarea
                    name="description"
                    title="description"
                    value={fillData?.description}
                    onChange={(e) => handleEditForm(e, 'description')}
                    type="text"
                    rows={3}
                    className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md resize-none"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Street*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="street"
                    value={fillData?.street}
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
                    value={fillData?.locality}
                    onChange={(e) => handleEditForm(e, 'locality')}
                    className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div className="flex items-center gap-5">
                <div>
                  <p className="mb-2 font-semibold text-gray-700">State*</p>
                  {/* <div className="flex gap-2">
                  <input
                    type="text"
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div> */}
                  <select
                    name="state"
                    id="state"
                    value={fillData?.state}
                    onChange={(e) => handleStateChange(e)}
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
                    value={fillData?.city}
                    onChange={(e) => handleEditForm(e, 'city')}
                  >
                    <option value="" defaultChecked>
                      Select City
                    </option>
                    {StateCitiesData[selectedState]?.map((city, index) => (
                      <option key={index} value={city}>
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
                    value={fillData?.pincode}
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
                    value={fillData?.price}
                    onChange={(e) => handleEditForm(e, 'price')}
                    type="text"
                    className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold mt-4  mb-4 text-xl text-gray-700">
                  Upload upto 20 photos
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 text-gray-700">
                  {[...Array(20)].map((_, index) => (
                    <div
                      key={index}
                      className="border border-gray-400 rounded-md"
                    >
                      {selectedImages[index] ? (
                        <div className="relative">
                          <img
                            src={image[index]}
                            alt={`Image ${index}`}
                            className="h-24 w-24 rounded-md"
                          />
                          <button
                            type="button"
                            onClick={() => handleDeleteImage(index)}
                            className="text-[#f58181] p-[2px] shadow-md rounded absolute top-[2px] right-[2px] text-sm font-bold"
                          >
                            X
                          </button>
                        </div>
                      ) : (
                        <label
                          htmlFor={`file-${index}`}
                          className="cursor-pointer h-24 w-24 flex justify-center items-center"
                        >
                          <FaCamera size={30} color="gray" />
                        </label>
                      )}
                      <input
                        type="file"
                        id={`file-${index}`}
                        accept="image/*"
                        onChange={(e) => imageHandler(e, index)}
                        className="hidden"
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex justify-end">
                <Button
                  category={'primarybtn'}
                  clickHandler={formSubmitHandler}
                  type={'submit'}
                  disabled={submitting}
                >
                  {submitting ? 'Submitting' : 'Submit'}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default HospitalityAdForm;
