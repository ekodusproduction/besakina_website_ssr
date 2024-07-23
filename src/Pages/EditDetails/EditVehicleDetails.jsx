import React, { useState, useEffect } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { FaCamera } from 'react-icons/fa';
import '../../styles/style.css';
import Button from '../../Components/Button/Button';
import axiosInstance, { baseURL } from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { Fueldata, VehicleData, Vehicletype } from '../../data/VehicleData';
import { StateCitiesData } from '../../data/Indian_Cities_In_States';
import toast from 'react-hot-toast';

const EditVehicleDetails = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [image, setImage] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const token = localStorage.getItem('token');
  const [selectedBrand, setSelectedBrand] = useState('');
  const [otherBrand, setOtherBrand] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [second_hand, setSecondHand] = useState(0);
  const navigate = useNavigate();
  const { id } = useParams();
  const [vehicleData, setVehicleData] = useState({});
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const location = useLocation();
  const category = location?.state?.category;

  const getVehicleDetails = () => {
    axiosInstance
      .get(`api/${category}/id/${id}`)
      .then((response) => {
        const data = response?.data?.data;
        setVehicleData(data);
        setSelectedState(data?.state);
        setSelectedCity(data?.city);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getVehicleDetails();
    if (vehicleData?.second_hand === 1) {
      setSecondHand(1);
    }
  }, [id]);

  useEffect(() => {
    if (vehicleData?.images?.length) {
      setSelectedImages((prev) => [
        ...prev, // Spread the previous images
        ...vehicleData?.images, // Spread the new images fetched from vehicleData
      ]);
    }
  }, [vehicleData?.images]);

  const imageHandler = (e) => {
    if (selectedImages?.length >= 20) {
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
      .post(`api/${category}/images/id/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success('Image added succesfully');
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

  const imageDeleteHandler = (image) => {
    const body = {
      images: image,
    };

    axiosInstance
      .delete(`api/${category}/image/delete/id/${id}`, {
        data: body,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success(response?.data?.message);
      })
      .catch((error) => {
        console.error('Error uploading image:', error);
        toast.error(error?.response?.data?.message);
      });
  };

  const formSubmitHandler = (e) => {
    e.preventDefault();
    setSubmitting(true);

    const data = e.target;
    const value = {};

    for (let i = 0; i < data.length; i++) {
      const { name, value: val } = data[i];

      if (name !== '') {
        value[name] = val;
      }
    }

    const body = {
      ...value,
      type: vehicleData?.type,
      second_hand,
    };

    axiosInstance
      .put(`api/${category}/id/${id}`, body, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        toast.success(response?.data?.message);
        setSubmitting(false);
        navigate(`/vehicledetails/${id}`);
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
  const handleBrandChange = (event) => {
    setVehicleData((prevData) => ({
      ...prevData,
      brand: event.target.value,
    }));
  };

  const handleOtherBrandChange = (event) => {
    setOtherBrand(event.target.value);
  };

  const handleBrand = (event) => {
    const selectedValue = event.target.value;
    setSelectedBrand(selectedBrand);
    if (selectedValue === 'Other') {
      setOtherBrand('');
    }
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
    setSelectedBrand('');
  };

  const handleVehicleTypeChange = (event) => {
    setVehicleData((prevData) => ({
      ...prevData,
      type: event.target.value,
    }));
  };

  const handleEditForm = (e, fieldName) => {
    const value = e.target.value;
    setVehicleData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  return (
    <>
      <section className="bg-white">
        <div>
          <p className="text-center py-4 font-semibold text-xl border-b-[1px] border-gray-300">
            EDIT YOUR AD
          </p>
        </div>
        <div className="flex flex-col md:flex-row justify-center p-8 gap-8 md:gap-16">
          <div>
            {second_hand == 0 && (
              <>
                <h3 className="mb-2 text-center md:text-left font-semibold text-xl">
                  Add Some Details
                </h3>
                <div>
                  <p className="mb-2 font-semibold text-gray-700 ">
                    Vehicle Type*
                  </p>
                  <div className="flex flex-wrap gap-2 text-gray-700">
                    {Vehicletype?.map((item, index) => (
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
                          checked={vehicleData?.type === item.value}
                          onChange={(e) => {
                            handleVehicleTypeChange(e), handleTypeChange(e);
                          }}
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

                <form
                  action=""
                  className="flex flex-col gap-8"
                  onSubmit={formSubmitHandler}
                >
                  <div>
                    <p className="mb-2 font-semibold text-gray-700 pt-3">
                      Select Brand*
                    </p>
                    <div className="flex gap-2 text-gray-700">
                      <select
                        name="brand"
                        id=""
                        required
                        disabled={selectedType?.length === 0}
                        value={vehicleData?.brand}
                        onChange={handleBrandChange}
                        className="border-[1px]  border-gray-400 rounded-sm w-[150px]"
                      >
                        {selectedType &&
                          VehicleData?.find(
                            (vehicle) =>
                              vehicle?.label?.toLocaleLowerCase() ==
                              selectedType?.toLocaleLowerCase()
                          )?.models?.map((model, index) => (
                            <option key={index} value={model}>
                              {model}
                            </option>
                          ))}
                        <option value="Other">Other</option>
                      </select>
                      {selectedBrand === 'Other' && (
                        <input
                          type="text"
                          value={otherBrand}
                          onChange={handleOtherBrandChange}
                          placeholder="Enter brand"
                        />
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-gray-700">Model</p>
                    <div className="">
                      <input
                        name="model"
                        required
                        type="text"
                        value={vehicleData?.model}
                        onChange={(e) => handleEditForm(e, 'model')}
                        className="w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-gray-700">Variant</p>
                    <div className="flex gap-2">
                      <input
                        name="variant"
                        required
                        value={vehicleData?.variant}
                        onChange={(e) => handleEditForm(e, 'variant')}
                        type="text"
                        className="w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-gray-700">
                      Transmission (auto/manual)
                    </p>
                    <div className="flex gap-2 text-gray-700">
                      <select
                        name="transmission"
                        id=""
                        value={vehicleData?.transmission}
                        onChange={(e) => handleEditForm(e, 'transmission')}
                        required
                        className="border-[1px]  border-gray-400 rounded-sm w-[150px]"
                      >
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-gray-700">Fuel</p>
                    <div className="flex gap-2 text-gray-700">
                      <select
                        name="fuel"
                        id=""
                        required
                        value={vehicleData?.fuel}
                        onChange={(e) => handleEditForm(e, 'fuel')}
                        className="border-[1px]  border-gray-400 rounded-sm w-[150px]"
                      >
                        {Fueldata?.map((item, index) => (
                          <option key={index} value={item.value}>
                            {item.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 font-semibold text-gray-700">
                      Manufacture Year
                    </p>
                    <div className="flex gap-2">
                      <input
                        name="registration_year"
                        value={vehicleData?.registration_year}
                        onChange={(e) => handleEditForm(e, 'registration_year')}
                        type="text"
                        className="w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                      />
                    </div>
                  </div>

                  <div>
                    <p className="mb-2 font-semibold text-gray-700">
                      Ad Title*
                    </p>
                    <div className="flex gap-2">
                      <input
                        name="title"
                        type="text"
                        required
                        value={vehicleData?.title}
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
                        type="text"
                        required
                        value={vehicleData?.description}
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
                        required
                        value={vehicleData?.street}
                        onChange={(e) => handleEditForm(e, 'street')}
                        className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <p className="mb-2 font-semibold text-gray-700">
                      Locality*
                    </p>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        name="locality"
                        required
                        value={vehicleData?.locality}
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
                        required
                        value={vehicleData?.pincode}
                        onChange={(e) => handleEditForm(e, 'pincode')}
                        className="w-[85vw] md:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold mt-4 mb-2 text-xl ">
                      Set a price
                    </h3>
                    <p className="mb-2 font-semibold text-gray-700">Price</p>
                    <div className="flex gap-2">
                      <input
                        name="price"
                        type="text"
                        required
                        value={vehicleData?.price}
                        onChange={(e) => handleEditForm(e, 'price')}
                        className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                      />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-bold mt-4  mb-4 text-xl text-gray-700">
                      Upload upto 20 photos
                    </h3>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 text-gray-700">
                      {selectedImages?.map((image, index) => (
                        <div
                          key={index}
                          className="border border-gray-400 rounded-md"
                        >
                          {image && (
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
                          )}
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

                    {/* <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 text-gray-700">
                    {vehicleData?.images?.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="border border-gray-400 rounded-md relative"
                      >
                        <img
                          src={imageUrl?.original}
                          alt={imageUrl?.original}
                          className="h-24 rounded-md w-32"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                          className="text-[#f58181] p-[2px] shadow-md rounded absolute top-[2px] right-[2px] text-sm font-bold"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div> */}
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
              </>
            )}
            {second_hand == 1 && (
              <form
                action=""
                className="flex flex-col gap-8"
                onSubmit={formSubmitHandler}
              >
                <h3 className="mb-2 text-center md:text-left font-semibold text-xl">
                  Add Some Details
                </h3>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Vehicle Type*
                  </p>
                  <div className="flex flex-wrap gap-2 text-gray-700">
                    {Vehicletype?.map((item, index) => (
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
                          checked={vehicleData?.type === item.value}
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
                  <p className="mb-2 font-semibold text-gray-700">
                    Select Brand*
                  </p>
                  <div className="flex gap-2 text-gray-700">
                    <select
                      name="brand"
                      id=""
                      disabled={selectedType?.length === 0}
                      value={selectedBrand}
                      onChange={handleBrandChange}
                      required
                      className="border-[1px]  border-gray-400 rounded-sm w-[150px]"
                    >
                      {selectedType &&
                        VehicleData?.find(
                          (vehicle) =>
                            vehicle.label.toLowerCase() ==
                            selectedType.toLowerCase()
                        )?.models?.map((model, index) => (
                          <option key={index} value={model}>
                            {model}
                          </option>
                        ))}
                      <option value="Other">Other</option>
                    </select>
                    {selectedBrand === 'Other' && (
                      <input
                        type="text"
                        value={otherBrand}
                        onChange={handleOtherBrandChange}
                        placeholder="Enter brand"
                      />
                    )}
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">Model</p>
                  <div className="flex gap-2">
                    <input
                      name="model"
                      required
                      value={vehicleData?.model}
                      onChange={(e) => handleEditForm(e, 'model')}
                      type="text"
                      className="w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">Variant</p>
                  <div className="flex gap-2">
                    <input
                      name="variant"
                      required
                      value={vehicleData?.variant}
                      onChange={(e) => handleEditForm(e, 'variant')}
                      type="text"
                      className="w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Transmission (auto/manual)
                  </p>
                  <div>
                    <div className="flex gap-2 text-gray-700">
                      <select
                        name="transmission"
                        id=""
                        value={vehicleData?.transmission}
                        required
                        className="border-[1px]  border-gray-400 rounded-sm w-[150px]"
                      >
                        <option value="automatic">Automatic</option>
                        <option value="manual">Manual</option>
                      </select>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">Fuel</p>
                  <div className="flex gap-2 text-gray-700">
                    <select
                      name="fuel"
                      id=""
                      value={vehicleData?.fuel}
                      onChange={(e) => handleEditForm(e, 'fuel')}
                      required
                      className="border-[1px]  border-gray-400 rounded-sm w-[150px]"
                    >
                      {Fueldata?.map((item, index) => (
                        <option key={index} value={item.value}>
                          {item.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Registration Year
                  </p>
                  <div className="flex gap-2">
                    <input
                      name="registration_year"
                      value={vehicleData?.registration_year}
                      onChange={(e) => handleEditForm(e, 'registration_year')}
                      type="text"
                      required
                      className="w-[85vw] md:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Kilometer Driven
                  </p>
                  <div className="flex gap-2">
                    <input
                      name="kilometer_driven"
                      value={vehicleData?.kilometer_driven}
                      onChange={(e) => handleEditForm(e, 'kilometer_driven')}
                      type="text"
                      required
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>

                <div>
                  <p className="mb-2 font-semibold text-gray-700">Ad Title*</p>
                  <div className="flex gap-2">
                    <input
                      name="title"
                      type="text"
                      value={vehicleData?.title}
                      onChange={(e) => handleEditForm(e, 'title')}
                      required
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
                      type="text"
                      value={vehicleData?.description}
                      onChange={(e) => handleEditForm(e, 'description')}
                      required
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
                      value={vehicleData?.street}
                      onChange={(e) => handleEditForm(e, 'street')}
                      required
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
                      value={vehicleData?.locality}
                      onChange={(e) => handleEditForm(e, 'locality')}
                      required
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
                      value={vehicleData?.pincode}
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
                      value={vehicleData?.price}
                      onChange={(e) => handleEditForm(e, 'price')}
                      required
                      className="w-[85vw] md:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold mt-4  mb-4 text-xl text-gray-700">
                    Upload upto 20 photos
                  </h3>
                  <div>
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

                    {/* <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-7 gap-2 text-gray-700">
                    {vehicleData?.images?.map((imageUrl, index) => (
                      <div
                        key={index}
                        className="border border-gray-400 rounded-md relative"
                      >
                        <img
                          src={imageUrl?.original}
                          alt={imageUrl?.original}
                          className="h-24 rounded-md w-32"
                        />
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(index)}
                          className="text-[#f58181] p-[2px] shadow-md rounded absolute top-[2px] right-[2px] text-sm font-bold"
                        >
                          X
                        </button>
                      </div>
                    ))}
                  </div> */}
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

export default EditVehicleDetails;
