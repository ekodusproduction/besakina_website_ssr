import React, { useState, useEffect, useContext } from 'react';
import Navbar from '../../Components/Navbar/Navbar';
import Footer from '../../Components/Footer/Footer';
import { FaCamera } from 'react-icons/fa';
import '../../styles/style.css';
import Button from '../../Components/Button/Button';
import axiosInstance from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from '../../Components/BackButton/BackButton';
import {
  Select_Course_Type,
  Select_Domain,
  formFields,
} from '../../data/formConstains';
import { DataContext } from '../../contexts/DataContext';
import { StateCitiesData } from '../../data/Indian_Cities_In_States';
import toast from 'react-hot-toast';
import Select from 'react-select';
import AddNewField from '../../Components/Global/AddNewField';

const EducationAdForm = () => {
  const [selectedImages, setSelectedImages] = useState([]);
  const [image, setImage] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const { storeData, updateData } = useContext(DataContext);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const initialSelectedState = Object.keys(StateCitiesData)[0];
  const [selectedState, setSelectedState] = useState(initialSelectedState);
  const [fillData, setFillData] = useState([]);
  const [courseTypeData, setCourseTypeData] = useState([]);
  const [courseDomain, setCourseDomain] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenType, setModalOpenType] = useState(false);
  const [newExpertise, setNewExpertise] = useState('');
  const token = localStorage.getItem('token');
  const navigate = useNavigate();
  const location = useLocation();
  const state = location?.state?.state;

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

  useEffect(() => {
    if (state) {
      setFillData(storeData);
      setSelectedImages(storeData?.images ? storeData?.images : []);
    }
  }, []);

  // useEffect(() => {
  //   axiosInstance
  //     .get(`api/education/formdata/fieldname/type`)
  //     .then((response) => {
  //       const data = response?.data?.data?.type;
  //       setCourseTypeData(data);
  //     })
  //     .catch((error) => {
  //       console.error(error);
  //     });
  // }, []);

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
        setIsModalOpen(false);
      })
      .catch((error) => {
        console.error(error);
      });
  };
  // const handleCheckChange = (event) => {
  //     const value = event.target.value;
  //     if (value) {
  //         setSelectedOptions([...selectedOptions, value]);
  //     } else {
  //         setSelectedOptions(selectedOptions.filter(option => option !== value));
  //     }
  // }

  useEffect(() => {
    setFillData((prevData) => ({
      ...prevData,
      state: initialSelectedState,
      city: StateCitiesData[initialSelectedState][0],
    }));
  }, []);

  const handleCheckChange = (event) => {
    const selectedValue = event.target.getAttribute('value');
    if (selectedOptions.includes(selectedValue)) {
      // If already selected, remove it
      setSelectedOptions(
        selectedOptions.filter((option) => option !== selectedValue)
      );
    } else {
      // If not selected, add it
      setSelectedOptions([...selectedOptions, selectedValue]);
    }
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
  };

  const handleChange = (selectedOption, fieldName) => {
    if (selectedOption.value === 'add-new' && fieldName === 'domain') {
      setIsModalOpen(true);
    } else if (selectedOption.value === 'add-new' && fieldName === 'type') {
      setModalOpenType(true);
    } else {
      setIsModalOpen(false);
      setModalOpenType(false);
    }
    setFillData((prevData) => ({
      ...prevData,
      [fieldName]: selectedOption.value,
    }));
  };

  const formSubmitHandler = () => {
    setSubmitting(true);
    axiosInstance
      .post(
        'api/education/add',
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
        console.log(err);
        setSubmitting(false);
        toast.error(err?.response?.data?.message);
        if (err?.response?.data?.message === 'User Profile Incomplete') {
          updateData(formData);
          navigate('/setup-profile', {
            state: {
              form: '/educationadform',
            },
          });
        }
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

  const handleEditForm = (e, fieldName) => {
    const value = e.target.value;

    if (fieldName === 'description') {
      // setFillData((prevState) => ({
      //   ...prevState,
      //   description: value.replace(/[\r\n]+/g, ' '),
      // }));
    } else {
      setFillData((prevState) => ({
        ...prevState,
        [fieldName]: value,
      }));
    }
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
                <p className="mb-2 font-semibold text-gray-700">
                  Name of the Institute*
                </p>
                <div className="flex gap-2">
                  <input
                    name="institution_name"
                    required={true}
                    type="text"
                    value={fillData.institution_name}
                    onChange={(e) => handleEditForm(e, 'institution_name')}
                    className="w-[90vw] sm:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                  />
                </div>
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Select Course Type
                </p>
                <div className="flex flex-wrap gap-2 text-gray-700">
                  <div className="flex items-center gap-2">
                    <Select
                      name="type"
                      className="w-60 capitalize"
                      onChange={(e) => handleChange(e, 'type')}
                      options={[
                        ...courseTypeData,
                        { value: 'add-new', label: 'Add new type' },
                      ]}
                      placeholder="Search or select type"
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
              </div>
              <div>
                <p className="mb-2 font-semibold text-gray-700">
                  Select Domain
                </p>
                <div className="w-full flex items-center gap-2 text-gray-700">
                  <Select
                    className="w-60 capitalize"
                    name="domain"
                    onChange={(e) => handleChange(e, 'domain')}
                    options={[
                      ...courseDomain,
                      { value: 'add-new', label: 'Add new domain' },
                    ]}
                    placeholder="Search or select domain"
                  />
                  {isModalOpen && (
                    <AddNewField
                      onChange={(e) => setNewExpertise(e.target.value)}
                      onClick={() => addField('domain')}
                      placeholder={'Add new domain'}
                      setOpen={() => setIsModalOpen(false)}
                    />
                  )}
                </div>
              </div>

              {formFields?.map((item, index) => (
                <div key={index}>
                  {item.name === 'state' ? (
                    <div className="flex items-center gap-5">
                      <div>
                        <p className="mb-2 font-semibold text-gray-700">
                          State*
                        </p>
                        <select
                          name="state"
                          id="state"
                          value={fillData?.state}
                          onChange={(e) => {
                            handleStateChange(e), handleEditForm(e, 'state');
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
                        <p className="mb-2 font-semibold text-gray-700">
                          City*
                        </p>
                        <select
                          name="city"
                          id="city"
                          value={fillData?.city}
                          onChange={(e) => handleEditForm(e, 'city')}
                        >
                          <option value="" defaultChecked>
                            Select City
                          </option>
                          {StateCitiesData[selectedState]?.map(
                            (city, index) => (
                              <option
                                key={index}
                                value={city}
                                className="cursor-pointer"
                              >
                                {city}
                              </option>
                            )
                          )}
                        </select>
                      </div>
                    </div>
                  ) : (
                    <>
                      {item.secondaryTitle && (
                        <h3 className="font-bold mt-4 mb-2 text-xl ">
                          {item.secondaryTitle}
                        </h3>
                      )}

                      <p className="mb-2 font-semibold text-gray-700">
                        {item.title} {item.required && '*'}
                      </p>
                      <div className="flex gap-2">
                        {item.type == 'textarea' ? (
                          <textarea
                            name={item.name}
                            required={item.required}
                            // value={fillData[item.name]}
                            onChange={(e) => handleEditForm(e, item.name)}
                            rows={3}
                            className="w-[90vw] sm:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md resize-none"
                          />
                        ) : (
                          <input
                            name={item.name}
                            required={item.required}
                            type={item.type ? item.type : 'text'}
                            value={fillData[item.name]}
                            maxLength={item.max}
                            onChange={(e) => handleEditForm(e, item.name)}
                            className="w-[90vw] sm:w-[50vw] border-[1px] pl-2 border-gray-400 py-2 rounded-md"
                          />
                        )}
                      </div>
                    </>
                  )}
                </div>
              ))}
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
                  clickHandler={formSubmitHandler}
                  category={'primarybtn'}
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

export default EducationAdForm;
