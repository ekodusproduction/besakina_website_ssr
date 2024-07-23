import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { FaCamera } from 'react-icons/fa';
import Button from '../../Components/Button/Button';
import '../../styles/style.css';
import axiosInstance, { baseURL } from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';
import { StateCitiesData } from '../../data/Indian_Cities_In_States';
import {
  BathroomData,
  BedroomsData,
  Category,
  ConstructionData,
  FurnishingData,
  ListedByData,
  ParkingData,
  TypesData,
} from '../../data/propertyFormData';
import toast from 'react-hot-toast';
import ReactSelect from 'react-select';
import AddNewField from '../../Components/Global/AddNewField';

const PropertyEditForm = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [image, setImage] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');

  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();
  const [propertyData, setPropertyData] = useState({});
  const [catgories, setCategories] = useState([]);
  const [newExpertise, setNewExpertise] = useState('');
  const [isModalOpenType, setModalOpenType] = useState(false);
  const [selectType, setSelectType] = useState('');

  useEffect(() => {
    axiosInstance
      .get(`api/property/id/${id}`)
      .then((response) => {
        console.log(response);
        const data = response.data.data;
        setPropertyData(data);
        setSelectedState(data?.state);
        setSelectedCity(data?.city);
        const newOption = {
          value: data?.category,
          label: data?.category,
        };
        setSelectType(newOption);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  const getFieldDetails = async (field) => {
    axiosInstance
      .get(`api/property/formdata/fieldname/${field}`)
      .then((response) => {
        const data = response?.data?.data?.[field];
        if (field === 'type') {
          setCategories(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getFieldDetails('type');
  }, []);

  useEffect(() => {
    if (propertyData?.images?.length) {
      setSelectedImages((prev) => [
        ...prev, // Spread the previous images
        ...propertyData?.images, // Spread the new images fetched from vehicleData
      ]);
    }
  }, [propertyData?.images]);

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

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
  };

  const formSubmitHandler = () => {
    setSubmitting(true);
    axiosInstance
      .put(`api/property/id/${id}`, propertyData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        toast.success(response?.data?.message);
        setSubmitting(false);
        navigate(`/propertiesdetails/${id}`);
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        toast.error(err?.response?.data?.message);
      });
  };

  const imageDeleteHandler = (image) => {
    const body = {
      images: image,
    };

    axiosInstance
      .delete(`api/property/image/delete/id/${id}`, {
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
        console.error('Error: ', error);
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

  const addField = async (field) => {
    const payload = {
      label: newExpertise,
      value: newExpertise,
      fieldname: field,
    };
    axiosInstance
      .post(`api/property/formdata`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success(response?.data?.message);
        getFieldDetails(field);
        setNewExpertise('');
        setModalOpenType(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (selectedOption, fieldName) => {
    if (selectedOption.value === 'add-new' && fieldName === 'type') {
      setModalOpenType(true);
    } else {
      setModalOpenType(false);
    }
    setPropertyData((prevData) => ({
      ...prevData,
      category: selectedOption.value,
    }));
    if (fieldName === 'type') {
      const newOption = {
        value: selectedOption.value.toLowerCase().trim(),
        label: selectedOption.label.trim(),
      };
      setSelectType(newOption);
    }
  };

  const handleEditForm = (e, fieldName) => {
    const value = e.target.value;
    setPropertyData((prevState) => ({
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
          <div>
            <div className="flex flex-col gap-4">
              <h3 className="mb-2 font-semibold text-xl">Add Some Details</h3>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Category*</p>
                <div className="flex items-center gap-4">
                  <ReactSelect
                    name="type"
                    className="w-60 capitalize"
                    value={selectType}
                    onChange={(e) => handleChange(e, 'type')}
                    options={[
                      ...catgories,
                      { value: 'add-new', label: 'Add new type' },
                    ]}
                    placeholder="Search or select type..."
                  />
                  {isModalOpenType && (
                    <AddNewField
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onClick={() => addField('type')}
                      setOpen={() => setModalOpenType(false)}
                      placeholder={'Add new type'}
                    />
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Type*</p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  {TypesData?.map((item, index) => (
                    <div
                      key={index}
                      className="border-[1px] border-gray-400 rounded-sm"
                    >
                      <input
                        type="radio"
                        id={item.value}
                        checked={propertyData?.type === item.value}
                        onChange={(e) => handleEditForm(e, 'type')}
                        name="type"
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
                <p className="mb-2 font-semibold text-gray-700">Bedrooms*</p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  {BedroomsData?.map((item, index) => (
                    <div
                      key={index}
                      className="border-[1px] border-gray-400 rounded-sm"
                    >
                      <input
                        type="radio"
                        id={item.id}
                        name="bedrooms"
                        checked={propertyData?.bedrooms == item.label}
                        onChange={(e) => handleEditForm(e, 'bedrooms')}
                        value={item.label}
                        className="hidden"
                      />
                      <label
                        for={item.id}
                        className="px-4 py-[2px] cursor-pointer"
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Bathroom*</p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  {BathroomData?.map((item, index) => (
                    <div
                      key={index}
                      className="border-[1px] border-gray-400 rounded-sm"
                    >
                      <input
                        type="radio"
                        id={item.id}
                        name="bathrooms"
                        checked={propertyData?.bathrooms == item.label}
                        onChange={(e) => handleEditForm(e, 'bathrooms')}
                        value={item.label}
                        className="hidden"
                      />
                      <label
                        for={item.id}
                        className="px-4 py-[2px] cursor-pointer"
                      >
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Furnishing*</p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  {FurnishingData?.map((item, index) => (
                    <div
                      key={index}
                      className="border-[1px] border-gray-400 rounded-sm"
                    >
                      <input
                        type="radio"
                        id={item.value}
                        name="furnishing"
                        checked={propertyData?.furnishing == item.value}
                        onChange={(e) => handleEditForm(e, 'furnishing')}
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
                <p className="mb-2 font-semibold text-gray-700">
                  Construction Status*
                </p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  {ConstructionData?.map((item, index) => (
                    <div
                      key={index}
                      className="border-[1px] border-gray-400 rounded-sm"
                    >
                      <input
                        type="radio"
                        id={item.value}
                        name="construction_status"
                        checked={
                          propertyData?.construction_status == item.value
                        }
                        onChange={(e) =>
                          handleEditForm(e, 'construction_status')
                        }
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
                <p className="mb-2 font-semibold text-gray-700">Listed By</p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  {ListedByData?.map((item, index) => (
                    <div
                      key={index}
                      className="border-[1px] border-gray-400 rounded-sm"
                    >
                      <input
                        type="radio"
                        id={item.value}
                        name="listed_by"
                        checked={propertyData?.listed_by == item.value}
                        onChange={(e) => handleEditForm(e, 'listed_by')}
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
                <p className="mb-2 font-semibold text-gray-700">Ad title*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="title"
                    value={propertyData?.title}
                    onChange={(e) => handleEditForm(e, 'title')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Super Builtup Area*
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="super_builtup_area"
                    value={propertyData?.super_builtup_area}
                    onChange={(e) => handleEditForm(e, 'super_builtup_area')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Carpet Area*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="carpet_area"
                    value={propertyData?.carpet_area}
                    onChange={(e) => handleEditForm(e, 'carpet_area')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Maintenance*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="maintenance"
                    value={propertyData?.maintenance}
                    onChange={(e) => handleEditForm(e, 'maintenance')}
                    className="w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Total Floors*
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="total_floors"
                    value={propertyData?.total_floors}
                    onChange={(e) => handleEditForm(e, 'total_floors')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Floor No.</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="floor_no"
                    value={propertyData?.floor_no}
                    onChange={(e) => handleEditForm(e, 'floor_no')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Total Rooms*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="total_rooms"
                    value={propertyData?.total_rooms}
                    onChange={(e) => handleEditForm(e, 'total_rooms')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Car Parking</p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  {ParkingData?.map((item, index) => (
                    <div
                      key={index}
                      className="border-[1px] border-gray-400 rounded-sm"
                    >
                      <input
                        type="radio"
                        id={item.id}
                        name="car_parking"
                        checked={propertyData?.car_parking == item.label}
                        onChange={(e) => handleEditForm(e, 'car_parking')}
                        value={item.label}
                        className="hidden"
                      />
                      <label for={item.id} className="px-4 py-[2px]">
                        {item.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  House Number*
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="house_no"
                    value={propertyData?.house_no}
                    onChange={(e) => handleEditForm(e, 'house_no')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Street*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="street"
                    value={propertyData?.street}
                    onChange={(e) => handleEditForm(e, 'street')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Landmark*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="landmark"
                    value={propertyData?.landmark}
                    onChange={(e) => handleEditForm(e, 'landmark')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
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
                    value={propertyData?.pincode}
                    onChange={(e) => handleEditForm(e, 'pincode')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <h3 className="font-bold mt-4 mb-2 text-xl ">Set a price</h3>
                <p className="mb-2 font-semibold text-gray-700">Price</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="price"
                    value={propertyData?.price}
                    onChange={(e) => handleEditForm(e, 'price')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
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

export default PropertyEditForm;
