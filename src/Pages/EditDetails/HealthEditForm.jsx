import React, { useState, useEffect } from 'react';
import { FaCamera } from 'react-icons/fa';
import '../../styles/style.css';
import axiosInstance, { baseURL } from '../../api/axiosInstance';
import Button from '../../Components/Button/Button';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { StateCitiesData } from '../../data/Indian_Cities_In_States';
import { ExpertiseData, HospitalData } from '../../data/heathFormData';
import toast from 'react-hot-toast';

const HealthEditForm = () => {
  const location = useLocation();
  const category = location.state?.category;
  const [selectedForm, setSelectedForm] = useState(category);
  const openForm = (form) => {
    setSelectedForm(form);
  };
  const [selectedDoctorsImages, setSelectedDoctorsImages] = useState([]);
  const [selectedHospitalImages, setSelectedHospitalImages] = useState([]);
  const [doctorsDetails, setDoctorDetails] = useState({});
  const [hospitalDetails, setHospitalDetails] = useState({});
  const [doctorsImage, setDoctorsImage] = useState([]);
  const [hospitalsImage, setHospitalsImage] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const navigate = useNavigate();
  const { id } = useParams();

  const token = localStorage.getItem('token');

  const getDoctorDetails = async () => {
    await axiosInstance
      .get(`api/doctor/id/${id}`)
      .then((response) => {
        console.log('doctors', response);
        const data = response.data.data;
        setDoctorDetails(data);
        setSelectedState(data?.state);
        setSelectedCity(data?.city);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const getHospitalDetals = async () => {
    await axiosInstance
      .get(`api/hospital/id/${id}`)
      .then((response) => {
        console.log('hospitals', response);
        const data = response.data.data;
        setHospitalDetails(data);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    if (selectedForm === 'Doctor') {
      getDoctorDetails();
    } else {
      getHospitalDetals();
    }
  }, [id]);

  useEffect(() => {
    if (doctorsDetails?.images?.length) {
      setDoctorsImage((prev) => [
        ...prev, // Spread the previous images
        ...doctorsDetails?.images, // Spread the new images fetched from vehicleData
      ]);
    }
  }, [doctorsDetails?.images]);

  useEffect(() => {
    if (hospitalDetails?.images?.length) {
      setHospitalsImage((prev) => [
        ...prev, // Spread the previous images
        ...hospitalDetails?.images, // Spread the new images fetched from vehicleData
      ]);
    }
  }, [hospitalDetails?.images]);

  const doctorImageHandler = (e) => {
    if (doctorsImage?.length >= 20) {
      toast.error('You can upload photos upto 20');
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
      .post(`api/doctor/images/id/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setDoctorsImage((prev) => [
            ...prev, // Spread the previous images
            ...response.data[0], // Spread the new images fetched from vehicleData
          ]);
        } else {
          // Handle non-array response data
          setDoctorsImage((prev) => [
            ...prev,
            response?.data?.data[0], // Assuming response data is a single image object
          ]);
        }
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };
  const hospitalImageHandler = (e) => {
    if (hospitalsImage?.length >= 20) {
      toast.error('You can upload photos upto 20');
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
      .post(`api/hospital/images/id/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (Array.isArray(response.data)) {
          setHospitalsImage((prev) => [
            ...prev, // Spread the previous images
            ...response.data[0], // Spread the new images fetched from vehicleData
          ]);
        } else {
          // Handle non-array response data
          setHospitalsImage((prev) => [
            ...prev,
            response?.data?.data[0], // Assuming response data is a single image object
          ]);
        }
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };

  const doctorFormSubmitHandler = (e) => {
    setSubmitting(true);
    e.preventDefault();
    const data = e.target;
    const value = {};

    for (let i = 0; i < data.length; i++) {
      const { name, value: val } = data[i];
      if (name !== '' && name != 'expertise' && name != 'type') {
        value[name] = val;
      }
    }

    const body = {
      ...value,
      expertise: doctorsDetails?.expertise,
    };
    axiosInstance
      .put(`api/doctor/id/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success(response?.data?.message);
        setSubmitting(false);
        navigate(`/hospitaldetails/${id}`);
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        toast.error('Something went wrong');
      });
  };

  const hospitalFormSubmitHandler = (e) => {
    setSubmitting(true);
    e.preventDefault();
    const data = e.target;
    const value = {};

    for (let i = 0; i < data.length; i++) {
      const { name, value: val } = data[i];
      if (name !== '' && name !== 'expertise') {
        value[name] = val;
      }
    }

    const body = {
      ...value,
    };

    axiosInstance
      .put(`api/hospital/id/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
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
        toast.error('Something went wrong');
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

  const handleDeleteDoctorImageHandler = (image) => {
    const body = {
      images: image,
    };
    axiosInstance
      .delete(`api/doctor/image/delete/id/${id}`, {
        data: body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('delete', response);
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };
  const handleDeleteHospitalImageHandler = (image) => {
    const body = {
      images: image,
    };
    axiosInstance
      .delete(`api/hospital/image/delete/id/${id}`, {
        data: body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log('delete', response);
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
      });
  };

  const handleDeleteHopitalsImage = (index) => {
    const newImages = [...hospitalsImage];
    const newSelectedImages = [...selectedHospitalImages];
    newImages.splice(index, 1);
    newSelectedImages.splice(index, 1);
    setHospitalsImage(newImages);
    setSelectedHospitalImages(newSelectedImages);
  };

  const handleEditForm = (e, fieldName) => {
    const value = e.target.value;
    if (selectedForm == 'doctors') {
      setDoctorDetails((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    } else {
      setHospitalDetails((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    }
  };

  return (
    <>
      <section className="bg-white">
        <div>
          <p className="text-center py-4 font-semibold text-xl border-b-[1px] border-gray-300">
            POST YOUR AD
          </p>
        </div>

        <div className="flex flex-col md:flex-row justify-center p-8 gap-8 md:gap-16">
          {/* <div className="tab flex justify-center md:justify-normal md:flex-col items-start gap-4 whitespace-nowrap">
            <button
              className={`tablinks ${
                selectedForm === 'doctors'
                  ? ` bg-[#1A5C96] text-white rounded`
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
          </div> */}
          <div>
            {selectedForm == 'Doctor' && (
              <form
                action=""
                onSubmit={doctorFormSubmitHandler}
                className="flex flex-col gap-8"
              >
                <h3 className="mb-2 font-semibold text-xl">Add Some Details</h3>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Select Expertise*
                  </p>
                  <div className="flex flex-wrap gap-2 text-gray-700">
                    {ExpertiseData?.map((item, index) => (
                      <div
                        key={index}
                        className="border-[1px] border-gray-400 rounded-sm"
                      >
                        <input
                          type="radio"
                          id={item.value}
                          name="type"
                          value={item.value}
                          className="hidden"
                          checked={doctorsDetails?.expertise == item.value}
                          onChange={(e) => handleEditForm(e, 'expertise')}
                        />
                        <label
                          for={item.value}
                          className="px-4 py-[2px] cursor-pointer"
                        >
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
                      className="w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                      value={doctorsDetails?.name}
                      onChange={(e) => handleEditForm(e, 'name')}
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
                      value={doctorsDetails?.total_experience}
                      onChange={(e) => handleEditForm(e, 'total_experience')}
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">Title*</p>
                  <div className="flex gap-2">
                    <input
                      name="title"
                      type="text"
                      value={doctorsDetails?.title}
                      onChange={(e) => handleEditForm(e, 'title')}
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Describe about yourself*
                  </p>
                  <div className="flex gap-2">
                    <input
                      name="description"
                      type="text"
                      value={doctorsDetails?.description}
                      onChange={(e) => handleEditForm(e, 'description')}
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
                      type="text"
                      value={doctorsDetails?.price_per_visit}
                      onChange={(e) => handleEditForm(e, 'price_per_visit')}
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
                      value={doctorsDetails?.street}
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
                      value={doctorsDetails?.locality}
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
                      type="number"
                      name="pincode"
                      value={doctorsDetails?.pincode}
                      onChange={(e) => handleEditForm(e, 'pincode')}
                      className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mt-4  mb-4 text-xl text-gray-700">
                    Upload upto 20 photos
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 text-gray-700">
                    {doctorsImage?.map((image, index) => (
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
                              handleDeleteDoctorsImage(index);
                              handleDeleteDoctorImageHandler(image);
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
                        onChange={(e) => doctorImageHandler(e)}
                        className="hidden"
                      />
                    </div>
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
            )}

            {selectedForm == 'Hospital' && (
              <form
                action=""
                className="flex flex-col gap-8"
                onSubmit={hospitalFormSubmitHandler}
              >
                <h3 className="mb-2 font-semibold text-xl">Add Some Details</h3>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Select Type*
                  </p>
                  <div className="flex flex-wrap gap-2 text-gray-700">
                    {HospitalData?.map((item, index) => (
                      <div
                        key={index}
                        className="border-[1px] border-gray-400 rounded-sm"
                      >
                        <input
                          type="radio"
                          id={item.value}
                          name="type"
                          checked={hospitalDetails?.type == item.value}
                          onChange={(e) => handleEditForm(e, 'type')}
                          value={item.value}
                          className="hidden"
                        />
                        <label
                          for={item.value}
                          className="px-4 py-[2px] cursor-pointer"
                        >
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
                      value={hospitalDetails?.name}
                      onChange={(e) => handleEditForm(e, 'name')}
                      className="w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-semibold text-gray-700">Title*</p>
                  <div className="flex gap-2">
                    <input
                      name="title"
                      type="text"
                      value={hospitalDetails?.title}
                      onChange={(e) => handleEditForm(e, 'title')}
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Write some description
                  </p>
                  <div className="flex gap-2">
                    <input
                      name="description"
                      type="text"
                      value={hospitalDetails?.description}
                      onChange={(e) => handleEditForm(e, 'description')}
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Registration Fee*
                  </p>
                  <div className="flex gap-2">
                    <input
                      name="price_registration"
                      type="text"
                      value={hospitalDetails?.price_registration}
                      onChange={(e) => handleEditForm(e, 'price_registration')}
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
                      type="text"
                      value={hospitalDetails?.price_per_visit}
                      onChange={(e) => handleEditForm(e, 'price_per_visit')}
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
                      value={hospitalDetails?.street}
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
                      value={hospitalDetails?.locality}
                      onChange={(e) => handleEditForm(e, 'locality')}
                      className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">City*</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="city"
                      value={hospitalDetails?.city}
                      onChange={(e) => handleEditForm(e, 'city')}
                      className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-semibold text-gray-700">State*</p>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      name="state"
                      value={hospitalDetails?.state}
                      onChange={(e) => handleEditForm(e, 'state')}
                      className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">Pincode*</p>
                  <div className="flex gap-2">
                    <input
                      type="number"
                      name="pincode"
                      value={hospitalDetails?.pincode}
                      onChange={(e) => handleEditForm(e, 'pincode')}
                      className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mt-4  mb-4 text-xl text-gray-700">
                    Upload upto 20 photos
                  </h3>
                  <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 text-gray-700">
                    {hospitalsImage?.map((image, index) => (
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
                              handleDeleteHopitalsImage(index);
                              handleDeleteHospitalImageHandler(image);
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
                        onChange={(e) => hospitalImageHandler(e)}
                        className="hidden"
                      />
                    </div>
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
            )}
          </div>
        </div>
      </section>
    </>
  );
};

export default HealthEditForm;
