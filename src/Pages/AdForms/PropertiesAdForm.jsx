import React, { useEffect, useState } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { FaCamera } from 'react-icons/fa';
import Button from '../../Components/Button/Button';
import '../../styles/style.css';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';
import BackButton from '../../Components/BackButton/BackButton';
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

const PropertiesAdForm = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [image, setImage] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const initialSelectedState = Object.keys(StateCitiesData)[0];
  const [selectedState, setSelectedState] = useState(initialSelectedState);
  const [catgories, setCategories] = useState([]);
  const [fillData, setFillData] = useState([]);
  const [newExpertise, setNewExpertise] = useState('');
  const [isModalOpenType, setModalOpenType] = useState(false);

  const token = localStorage.getItem('token');
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

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
  };

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

  const handleChange = (selectedOption, fieldName) => {
    if (selectedOption.value === 'add-new' && fieldName === 'type') {
      setModalOpenType(true);
    } else {
      setModalOpenType(false);
    }
    setFillData((prevData) => ({
      ...prevData,
      [fieldName]: selectedOption.value,
    }));
  };

  const handleEditForm = (e) => {
    const { name, value } = e.target;
    setFillData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const formSubmitHandler = (e) => {
    setSubmitting(true);

    axiosInstance
      .post(
        'api/property/add',
        { ...fillData, images: selectedImages },
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
        console.log('hiiiii', err?.response?.data?.message);
        setSubmitting(false);
        toast.error(err?.response?.data?.message);
        if (err?.response?.data?.message === 'User Profile Incomplete') {
          navigate('/setup-profile');
        }
      });
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
          <div>
            <div className="flex flex-col gap-8">
              <h3 className="mb-2 font-semibold text-xl">Add Some Details</h3>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Ad title*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="title"
                    onChange={handleEditForm}
                    required
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Category*</p>
                <div className="flex items-center gap-4">
                  <ReactSelect
                    name="type"
                    className="w-60 capitalize"
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
                    <div className="border-[1px] border-gray-400 rounded-sm">
                      <input
                        type="radio"
                        id={item?.value}
                        name="type"
                        onChange={handleEditForm}
                        value={item?.value}
                        className="hidden"
                      />
                      <label
                        for={item?.value}
                        className="px-4 py-[2px] cursor-pointer"
                      >
                        {item?.label}
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
                        onChange={handleEditForm}
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
                        onChange={handleEditForm}
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
                        onChange={handleEditForm}
                        name="furnishing"
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
              {/* <div>
                <p className="mb-2 font-semibold text-gray-700">Categories*</p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  <div className="border-[1px] border-gray-400 rounded-sm">
                    <input
                      type="radio"
                      id="1BHK"
                      name="category"
                      value="1BHK"
                      className="hidden"
                    />
                    <label for="1BHK" className="px-4 py-[2px] cursor-pointer">
                      1BHK
                    </label>
                  </div>
                  <div className="border-[1px] border-gray-400 rounded-sm">
                    <input
                      type="radio"
                      id="2BHK"
                      name="category"
                      value="2BHK"
                      className="hidden"
                    />
                    <label for="2BHK" className="px-4 py-[2px] cursor-pointer">
                      2BHK
                    </label>
                  </div>
                  <div className="border-[1px] border-gray-400 rounded-sm">
                    <input
                      type="radio"
                      id="3BHK"
                      name="category"
                      value="3BHK"
                      className="hidden"
                    />
                    <label for="3BHK" className="px-4 py-[2px] cursor-pointer">
                      3BHK
                    </label>
                  </div>
                  <div className="border-[1px] border-gray-400 rounded-sm">
                    <input
                      type="radio"
                      id="4BHK"
                      name="category"
                      value="4BHK"
                      className="hidden"
                    />
                    <label for="4BHK" className="px-4 py-[2px] cursor-pointer">
                      4BHK
                    </label>
                  </div>
                  <div className="border-[1px] border-gray-400 rounded-sm">
                    <input
                      type="radio"
                      id="unfurnished"
                      name="category"
                      value="unfurnished"
                      className="hidden"
                    />
                    <label
                      for="unfurnished"
                      className="px-4 py-[2px] cursor-pointer"
                    >
                      5BHK
                    </label>
                  </div>
                  <div className="border-[1px] border-gray-400 rounded-sm">
                    <input
                      type="radio"
                      id="1RK"
                      name="category"
                      value="1RK"
                      className="hidden"
                    />
                    <label for="1RK" className="px-4 py-[2px] cursor-pointer">
                      1RK
                    </label>
                  </div>
                  <div className="border-[1px] border-gray-400 rounded-sm">
                    <input
                      type="radio"
                      id="HOUSE"
                      name="category"
                      value="HOUSE"
                      className="hidden"
                    />
                    <label for="HOUSE" className="px-4 py-[2px] cursor-pointer">
                      HOUSE
                    </label>
                  </div>
                  <div className="border-[1px] border-gray-400 rounded-sm">
                    <input
                      type="radio"
                      id="VILLA"
                      name="category"
                      value="VILLA"
                      className="hidden"
                    />
                    <label for="VILLA" className="px-4 py-[2px] cursor-pointer">
                      VILLA
                    </label>
                  </div>
                </div>
              </div> */}
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
                        onChange={handleEditForm}
                        name="construction_status"
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
                        onChange={handleEditForm}
                        name="car_parking"
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
                        onChange={handleEditForm}
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
                  Super Builtup Area*
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    required
                    onChange={handleEditForm}
                    name="super_builtup_area"
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Carpet Area*</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    required
                    onChange={handleEditForm}
                    name="carpet_area"
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Maintenance(monthly)*
                </p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="maintenance"
                    onChange={handleEditForm}
                    required
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
                    type="number"
                    required
                    onChange={handleEditForm}
                    name="total_floors"
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Floor No.</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="floor_no"
                    onChange={handleEditForm}
                    required
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Total Rooms*</p>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="total_rooms"
                    onChange={handleEditForm}
                    required
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Description*</p>
                <div>
                  <textarea
                    type="text"
                    name="description"
                    onChange={handleEditForm}
                    rows={3}
                    required
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md resize-none"
                  />
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
                    onChange={handleEditForm}
                    required
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
                    onChange={handleEditForm}
                    required
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              {/* <div>
                <p className="mb-2 font-semibold text-gray-700">City*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="city"
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div> */}
              <div>
                <p className="mb-2 font-semibold text-gray-700">Landmark*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="landmark"
                    onChange={handleEditForm}
                    required
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
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
                    required
                    onChange={(e) => {
                      handleStateChange(e), handleEditForm(e);
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
                    value={fillData?.city}
                    onChange={handleEditForm}
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
                    onChange={handleEditForm}
                    required
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
                    onChange={handleEditForm}
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
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
                            className="h-24 w-32 rounded-md"
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
                          className="cursor-pointer h-24 w-32 flex justify-center items-center"
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

export default PropertiesAdForm;
