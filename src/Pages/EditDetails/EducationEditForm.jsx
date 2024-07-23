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
import toast from 'react-hot-toast';
import ReactSelect from 'react-select';
import AddNewField from '../../Components/Global/AddNewField';

const EducationEditForm = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [image, setImage] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [selectedState, setSelectedState] = useState('');
  const [selectedCity, setSelectedCity] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const { id } = useParams();
  const [educationData, setEducationData] = useState({});
  const [modalOpen, setModalOpen] = useState('');
  const [courseDomain, setCourseDomain] = useState('');
  const [courseTypeData, setCourseTypeData] = useState('');
  const [newExpertise, setNewExpertise] = useState('');
  const [selectType, setSelectType] = useState('');
  const [selectDomain, setSelectDomain] = useState('');

  useEffect(() => {
    axiosInstance
      .get(`api/education/id/${id}`)
      .then((response) => {
        console.log(response);
        const data = response.data.data;
        setEducationData(data);
        setSelectedState(data?.state);
        setSelectedCity(data?.city);
        const type = {
          value: data?.type,
          label: data?.type,
        };
        const domain = {
          value: data?.domain,
          label: data?.domain,
        };
        setSelectType(type);
        setSelectDomain(domain);
      })
      .catch((error) => {
        console.error(error);
      });
  }, [id]);

  useEffect(() => {
    if (educationData?.images?.length) {
      setSelectedImages((prev) => [
        ...prev, // Spread the previous images
        ...educationData?.images, // Spread the new images fetched from vehicleData
      ]);
    }
  }, [educationData?.images]);

  const handleEditForm = (e, fieldName) => {
    const value = e.target.value;
    setEducationData((prevState) => ({
      ...prevState,
      [fieldName]: value,
    }));
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
  };

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
      .post(`api/education/images/id/${id}`, formData, {
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
    setSubmitting(true);
    axiosInstance
      .put(`api/education/id/${id}`, educationData, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        toast.success(response?.data?.message);
        setSubmitting(false);
        navigate(`/educationdetails/${id}`);
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

  const getFieldDetails = async (field) => {
    axiosInstance
      .get(`api/education/formdata/fieldname/${field}`)
      .then((response) => {
        const data = response?.data?.data?.[field];
        if (field === 'domain') {
          setCourseDomain(data);
        } else if (field === 'type') {
          setCourseTypeData(data);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  };

  useEffect(() => {
    getFieldDetails('type');
    getFieldDetails('domain');
  }, []);

  const addField = async (field) => {
    const payload = {
      label: newExpertise,
      value: newExpertise,
      fieldname: field,
    };
    axiosInstance
      .post(`api/education/formdata`, payload, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success(response?.data?.message);
        getFieldDetails(field);
        setNewExpertise('');
        setModalOpen('');
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const handleChange = (selectedOption, fieldName) => {
    if (selectedOption.value === 'add-new' && fieldName === 'type') {
      setModalOpen('type');
    } else if (selectedOption.value === 'add-new' && fieldName === 'domain') {
      setModalOpen('domain');
    } else {
      setModalOpen('');
    }
    setEducationData((prevData) => ({
      ...prevData,
      [fieldName]: selectedOption.value,
    }));

    if (fieldName === 'type') {
      const value = {
        value: selectedOption.value.toLowerCase().trim(),
        label: selectedOption.label.trim(),
      };
      setSelectType(value);
    } else if (fieldName === 'domain') {
      const value = {
        value: selectedOption.value.toLowerCase().trim(),
        label: selectedOption.label.trim(),
      };
      setSelectDomain(value);
    }
  };
  const imageDeleteHandler = (image) => {
    const body = {
      images: image,
    };
    axiosInstance
      .delete(`api/education/image/delete/id/${id}`, {
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
        toast.error(error?.response?.data?.message);
      });
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
            <div className="flex flex-col gap-8">
              <h3 className="mb-2 font-semibold text-xl">Add Some Details</h3>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Select Course Type*
                </p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  <ReactSelect
                    name="type"
                    className="w-60 capitalize"
                    value={selectType}
                    onChange={(e) => handleChange(e, 'type')}
                    options={[
                      ...courseTypeData,
                      { value: 'add-new', label: 'Add new type' },
                    ]}
                    placeholder="Search or select type"
                  />
                  {modalOpen === 'type' && (
                    <AddNewField
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onClick={() => addField('type')}
                      setOpen={() => setModalOpen('')}
                      placeholder={'Add new type'}
                    />
                  )}
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Select Domain*
                </p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  <ReactSelect
                    name="domain"
                    className="w-60 capitalize"
                    value={selectDomain}
                    onChange={(e) => handleChange(e, 'domain')}
                    options={[
                      ...courseDomain,
                      { value: 'add-new', label: 'Add new domain' },
                    ]}
                    placeholder="Search or select domain"
                  />
                  {modalOpen === 'domain' && (
                    <AddNewField
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onClick={() => addField('domain')}
                      placeholder={'Add new domain'}
                      setOpen={() => setModalOpen('')}
                    />
                  )}
                </div>
              </div>

              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Name of Institution*
                </p>
                <div className="flex gap-2">
                  <input
                    name="institution_name"
                    required
                    type="text"
                    value={educationData?.institution_name}
                    onChange={(e) => handleEditForm(e, 'institution_name')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Course Duration (In months)*
                </p>
                <div className="flex gap-2">
                  <input
                    name="course_duration"
                    required
                    type="number"
                    value={educationData?.course_duration}
                    onChange={(e) => handleEditForm(e, 'course_duration')}
                    className="w-[90vw] sm:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Ad Title*</p>
                <div className="flex gap-2">
                  <input
                    name="title"
                    type="text"
                    value={educationData?.title}
                    onChange={(e) => handleEditForm(e, 'title')}
                    required
                    className="w-[90vw] sm:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Describe about the course*
                </p>
                <div className="flex gap-2">
                  <input
                    name="description"
                    type="text"
                    value={educationData?.description}
                    onChange={(e) => handleEditForm(e, 'description')}
                    required
                    className="w-[90vw] sm:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Street*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="street"
                    value={educationData?.street}
                    onChange={(e) => handleEditForm(e, 'street')}
                    required
                    className="w-[90vw] sm:w-[50vw] border-[1px] border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">Locality*</p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    name="locality"
                    value={educationData?.locality}
                    onChange={(e) => handleEditForm(e, 'locality')}
                    required
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
                    value={educationData?.pincode}
                    onChange={(e) => handleEditForm(e, 'pincode')}
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
                    name="price"
                    type="text"
                    value={educationData?.price}
                    onChange={(e) => handleEditForm(e, 'price')}
                    required
                    className="w-[90vw] sm:w-[50vw] pl-2 border-[1px] border-gray-400 py-2 rounded-md"
                    onkeypress="return event.charCode != 45"
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

export default EducationEditForm;
