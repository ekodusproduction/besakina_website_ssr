import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import '../../styles/style.css';
import axiosInstance from '../../api/axiosInstance';
import Button from '../../Components/Button/Button';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../Components/BackButton/BackButton';
import { StateCitiesData } from '../../data/Indian_Cities_In_States';
import { ExpertiseData, HospitalData } from '../../data/heathFormData';
import toast from 'react-hot-toast';
import Select from 'react-select';
import AddNewField from '../../Components/Global/AddNewField';

const HealthAdForm = () => {
  const [selectedForm, setSelectedForm] = useState('doctors');
  const openForm = (form) => {
    setSelectedForm(form);
  };
  const [selectedDoctorsImages, setSelectedDoctorsImages] = useState([]);
  const [selectedHospitalImages, setSelectedHospitalImages] = useState([]);
  const [doctorsImage, setDoctorsImage] = useState([]);
  const [hospitalsImage, setHospitalsImage] = useState([]);
  const [doctorsFormData, setDoctorsFormData] = useState({
    expertise: '',
    name: '',
    total_experience: '',
    designation: '',
    description: '',
    price_per_visit: '',
    street: '',
    locality: '',
    state: '',
    city: '',
    pincode: '',
    images: [],
  });
  const [submitting, setSubmitting] = useState(false);
  const initialSelectedState = Object.keys(StateCitiesData)[0];
  const [selectedState, setSelectedState] = useState(initialSelectedState);
  const [expertiseData, setExpertiseData] = useState([]);
  const [hospitalType, setHospitalType] = useState([]);
  const [hospitalFormData, setHospitalFormData] = useState([]);
  const [newExpertise, setNewExpertise] = useState();
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

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

              const newImages = [...doctorsImage];
              newImages[index] = canvas.toDataURL('image/jpeg', 0.5); // Use canvas.toDataURL to get the compressed image
              setDoctorsImage(newImages);

              setSelectedDoctorsImages((prev) => {
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

  const hospitalImageHandler = (e, index) => {
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

              const newImages = [...hospitalsImage];
              newImages[index] = canvas.toDataURL('image/jpeg', 0.5); // Use canvas.toDataURL to get the compressed image
              setHospitalsImage(newImages);

              setSelectedHospitalImages((prev) => {
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

  const handleDoctorFormChange = (e) => {
    const { name, value } = e.target;
    setDoctorsFormData({ ...doctorsFormData, [name]: value });
  };

  const hospitalFormChange = (e) => {
    const { name, value } = e.target;
    setHospitalFormData({ ...hospitalFormData, [name]: value });
  };

  const doctorFormSubmitHandler = () => {
    if (doctorsFormData.state == null) {
      toast.error('Please select state.');
      return;
    }
    if (doctorsFormData.city == null) {
      toast.error('Please select city.');
      return;
    }
    setSubmitting(true);
    const payload = {
      expertise: doctorsFormData.expertise,
      name: doctorsFormData.name,
      total_experience: doctorsFormData.total_experience,
      designation: doctorsFormData.designation,
      description: doctorsFormData.description,
      price_per_visit: doctorsFormData.price_per_visit,
      street: doctorsFormData.street,
      locality: doctorsFormData.locality,
      state: doctorsFormData.state,
      city: doctorsFormData.city,
      pincode: doctorsFormData.pincode,
      images: selectedDoctorsImages,
    };
    axiosInstance
      .post('api/doctor/add', payload, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
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

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
  };

  useEffect(() => {
    setHospitalFormData({
      ...hospitalFormData,
      state: initialSelectedState,
      city: StateCitiesData[initialSelectedState][0],
    });
    setDoctorsFormData({
      ...doctorsFormData,
      state: initialSelectedState,
      city: StateCitiesData[initialSelectedState][0],
    });
  }, []);

  const getExpertise = async () => {
    axiosInstance
      .get(`api/doctor/expertise`)
      .then((response) => {
        setExpertiseData(response?.data?.data?.expertise);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getExpertise();
  }, []);

  const getFieldDetails = async (field) => {
    axiosInstance
      .get(`api/hospital/formdata/fieldname/${field}`)
      .then((response) => {
        const data = response?.data?.data?.[field];
        if (field === 'type') {
          setHospitalType(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };
  useEffect(() => {
    getFieldDetails('type');
  }, []);

  const hospitalFormSubmitHandler = (e) => {
    setSubmitting(true);

    axiosInstance
      .post(
        'api/hospital/add',
        { ...hospitalFormData, images: selectedHospitalImages },
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      )
      .then((response) => {
        console.log(response);
        toast.success(response?.data?.message);
        setSubmitting(false);
        navigate('/');
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        toast.error(err?.response?.data?.message);
        if (err?.response?.message == 'User Profile Incomplete') {
          navigate('/setup-profile');
        }
      });
  };

  const handleDeleteDoctorsImage = (index) => {
    const newImages = [...doctorsImage];
    const newSelectedImages = [...selectedDoctorsImages];
    newImages.splice(index, 1);
    newSelectedImages.splice(index, 1);
    setDoctorsImage(newImages);
    setSelectedDoctorsImages(newSelectedImages);
  };
  const handleDeleteHopitalsImage = (index) => {
    const newImages = [...hospitalsImage];
    const newSelectedImages = [...selectedHospitalImages];
    newImages.splice(index, 1);
    newSelectedImages.splice(index, 1);
    setHospitalsImage(newImages);
    setSelectedHospitalImages(newSelectedImages);
  };

  const handleChange = (selectedOption, type) => {
    if (selectedOption.value === 'add-new') {
      setModalOpen(true);
    }
    if (type === 'hospital') {
      setHospitalFormData({
        ...hospitalFormData,
        type: selectedOption.value,
      });
    } else {
      setDoctorsFormData({
        ...doctorsFormData,
        expertise: selectedOption.value,
      });
    }
  };

  const handleAddExpertise = (e) => {
    setNewExpertise(e.target.value);
    console.log(e.target.value);
  };

  const addExpertise = async () => {
    const payload = {
      label: newExpertise,
      value: newExpertise,
    };
    axiosInstance
      .post(`api/doctor/expertise`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('post', response);
        toast.success(response?.data?.message);
        getExpertise();
        setModalOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  const addHospitalType = async () => {
    const payload = {
      label: newExpertise,
      value: newExpertise,
      fieldname: 'type',
    };
    axiosInstance
      .post(`api/hospital/formdata`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success(response?.data?.message);
        getFieldDetails('type');
        setModalOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const customStyles = {
    control: (provided) => ({
      ...provided,
      minWidth: 240,
      borderColor: '#ccc', // Customize the border color if needed
      boxShadow: 'none',
      '&:hover': {
        borderColor: '#aaa', // Customize the border color on hover
      },
      '&:focus': {
        borderColor: '#aaa', // Customize the border color on focus
      },
    }),
    input: (provided) => ({
      ...provided,
      boxShadow: 'none !important',
      '&:focus': {
        boxShadow: 'none !important',
      },
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
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

        <div className="flex flex-col md:flex-row justify-center p-8 gap-8 md:gap-16">
          <div className="tab flex justify-center md:justify-normal md:flex-col items-start gap-4 whitespace-nowrap">
            <button
              className={`tablinks ${
                selectedForm === 'doctors'
                  ? ` bg-[#1A5C96] text-white  rounded`
                  : ''
              }  text-lg p-2`}
              onClick={() => openForm('doctors')}
            >
              Doctors
            </button>
            <button
              className={`tablinks ${
                selectedForm === 'hospitals'
                  ? ` bg-[#1A5C96] text-white rounded`
                  : ''
              }  text-lg p-2`}
              onClick={() => openForm('hospitals')}
            >
              Hospital & Clinics
            </button>
          </div>
          <div>
            {selectedForm == 'doctors' && (
              <div
                // onSubmit={doctorFormSubmitHandler}
                className="flex flex-col gap-8"
              >
                <h3 className="mb-2 font-semibold text-xl">Add Some Details</h3>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Select Expertise*
                  </p>
                  <div className="flex flex-wrap gap-2 text-gray-700">
                    {/* {ExpertiseData?.map((item, index) => (
                      <div
                        key={index}
                        className="border-[1px] border-gray-400 rounded-sm"
                      >
                        <input
                          type="radio"
                          id={item.value}
                          name="expertise"
                          value={item.value}
                          className="hidden"
                        />
                        <label for={item.value} className="px-4 py-2">
                          {item.label}
                        </label>
                      </div>
                    ))} */}
                    <Select
                      name="expertise"
                      styles={customStyles}
                      onChange={(e) => handleChange(e, 'doctor')}
                      options={[
                        ...expertiseData,
                        { value: 'add-new', label: 'Add new expertise' },
                      ]}
                      placeholder="Search or select expertise..."
                    />

                    {isModalOpen && (
                      <AddNewField
                        onClick={addExpertise}
                        onChange={handleAddExpertise}
                        placeholder={'Add new expertise'}
                        setOpen={false}
                      />
                    )}
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-semibold text-gray-700">Name*</p>
                  <div className="flex gap-2">
                    <input
                      name="name"
                      onChange={handleDoctorFormChange}
                      type="text"
                      className="w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Total Experience (in years)*
                  </p>
                  <div className="flex gap-2">
                    <input
                      name="total_experience"
                      type="text"
                      onChange={handleDoctorFormChange}
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Designation*
                  </p>
                  <div className="flex gap-2">
                    <input
                      name="designation"
                      onChange={handleDoctorFormChange}
                      type="text"
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Describe about yourself*
                  </p>
                  <div className="flex gap-2">
                    <textarea
                      name="description"
                      onChange={handleDoctorFormChange}
                      type="text"
                      rows={3}
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md resize-none"
                    />
                  </div>
                </div>
                {/* <div>
                               
                                <p className='mb-2 font-semibold text-gray-700'>Registration Price</p>
                                <div className='flex gap-2'>
                                    <input name='price_registration' type="text" className='w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md' />
                                </div>
                            </div> */}
                <div>
                  <h3 className="font-bold mt-4 mb-2 text-xl ">Set a price</h3>
                  <p className="mb-2 font-semibold text-gray-700">
                    Price (per visit)
                  </p>
                  <div className="flex gap-2">
                    <input
                      name="price_per_visit"
                      onChange={handleDoctorFormChange}
                      type="text"
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">Street*</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      onChange={handleDoctorFormChange}
                      name="street"
                      className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">Locality*</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      onChange={handleDoctorFormChange}
                      name="locality"
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
                      value={doctorsFormData?.state}
                      onChange={(e) => {
                        handleStateChange(e), handleDoctorFormChange(e);
                      }}
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
                      value={doctorsFormData?.city}
                      onChange={handleDoctorFormChange}
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
                      type="number"
                      onChange={handleDoctorFormChange}
                      name="pincode"
                      className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
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
                        className="flex items-center justify-center border border-gray-400 rounded-md"
                      >
                        {selectedDoctorsImages[index] ? (
                          <div className="relative">
                            <img
                              src={doctorsImage[index]}
                              alt={`Image ${index}`}
                              className="h-24 w-full rounded-md object-cover"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteDoctorsImage(index)}
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
                    clickHandler={doctorFormSubmitHandler}
                    category={'primarybtn'}
                    type={'submit'}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting' : 'Submit'}
                  </Button>
                </div>
              </div>
            )}
            {/* hospital ad form */}
            {selectedForm == 'hospitals' && (
              <div className="flex flex-col gap-8">
                <h3 className="mb-2 font-semibold text-xl">Add Some Details</h3>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Title/Name*
                  </p>
                  <div className="flex gap-2">
                    <input
                      name="title"
                      type="text"
                      value={hospitalFormData?.title}
                      onChange={hospitalFormChange}
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div className="w-[62rem]">
                  <p className="mb-2 font-semibold text-gray-700">
                    Select Type*
                  </p>
                  <div className="flex flex-wrap gap-2 text-gray-700">
                    <Select
                      name="type"
                      styles={customStyles}
                      onChange={(e) => handleChange(e, 'hospital')}
                      options={[
                        ...hospitalType,
                        { value: 'add-new', label: 'Add new expertise' },
                      ]}
                      placeholder="Search or select expertise..."
                    />

                    {isModalOpen && (
                      <AddNewField
                        onClick={addHospitalType}
                        onChange={handleAddExpertise}
                        placeholder={'Add new expertise'}
                        setOpen={false}
                      />
                    )}
                  </div>
                </div>

                {/* <div>
                  <p className="mb-2 font-semibold text-gray-700">Name*</p>
                  <div className="flex gap-2">
                    <input
                      name="name"
                      type="text"
                      className="w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div> */}

                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Write some description
                  </p>
                  <div className="flex gap-2">
                    <textarea
                      name="description"
                      type="text"
                      value={hospitalFormData?.description}
                      onChange={hospitalFormChange}
                      rows={3}
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md resize-none"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Registration Fee
                  </p>
                  <div className="flex gap-2">
                    <input
                      name="price_registration"
                      value={hospitalFormData?.price_registration}
                      onChange={hospitalFormChange}
                      type="text"
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <h3 className="font-bold mt-4 mb-2 text-xl ">Set a price</h3>
                  <p className="mb-2 font-semibold text-gray-700">
                    Price (per visit)
                  </p>
                  <div className="flex gap-2">
                    <input
                      name="price_per_visit"
                      value={hospitalFormData?.price_per_visit}
                      onChange={hospitalFormChange}
                      type="text"
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
                      value={hospitalFormData?.street}
                      onChange={hospitalFormChange}
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
                      onChange={hospitalFormChange}
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
                      value={hospitalFormData?.state}
                      onChange={(e) => {
                        handleStateChange(e), hospitalFormChange(e);
                      }}
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
                      value={hospitalFormData?.city}
                      onChange={(e) => {
                        hospitalFormChange(e), hospitalFormChange;
                      }}
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
                      type="number"
                      name="pincode"
                      onChange={hospitalFormChange}
                      className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
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
                        className="flex items-center justify-center border border-gray-400 rounded-md"
                      >
                        {selectedHospitalImages[index] ? (
                          <div className="relative">
                            <img
                              src={hospitalsImage[index]}
                              alt={`Image ${index}`}
                              className="h-24 w-24 rounded-md"
                            />
                            <button
                              type="button"
                              onClick={() => handleDeleteHopitalsImage(index)}
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
                          onChange={(e) => hospitalImageHandler(e, index)}
                          className="hidden"
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button
                    category={'primarybtn'}
                    clickHandler={hospitalFormSubmitHandler}
                    type={'submit'}
                    disabled={submitting}
                  >
                    {submitting ? 'Submitting' : 'Submit'}
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HealthAdForm;
