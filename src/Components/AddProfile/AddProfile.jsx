import React, { useState, useEffect } from 'react';
import Button from '../Button/Button';
import { FaCamera } from 'react-icons/fa';
import { FiCamera } from 'react-icons/fi';
import { RiImageAddLine } from 'react-icons/ri';
import { MdOutlineCloudUpload } from 'react-icons/md';
import axiosInstance, { baseURL } from '../../api/axiosInstance';
import Swal from 'sweetalert2';
import { useLocation, useNavigate } from 'react-router-dom';
import { StateCitiesData } from '../../data/Indian_Cities_In_States';
import toast from 'react-hot-toast';
import { formatAadhaarNumber } from '../../utils/fornatter';

const AddProfile = () => {
  const [plans, setPlans] = useState([]);
  const token = localStorage.getItem('token');
  const [submitting, setSubmitting] = useState(false);
  const [isAadhar, setIsAadhar] = useState(false);
  const [profilePic, setProfilePic] = useState(null);
  const [doctImage, setDoctImage] = useState(null);
  const [aadharImage, setAadharImage] = useState(null);
  const [selectedState, setSelectedState] = useState('');
  const [selectedDoct, setSelectedDoct] = useState('pan');
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const [userDetails, setUserDetails] = useState({
    fullname: '',
    email: '',
    mobile: '',
    state: '',
    city: '',
    locality: '',
    pincode: '',
    doc_type: '',
    doc_number: '',
    about: '',
  });
  const navigate = useNavigate();
  const route = location?.state?.route;

  useEffect(() => {
    axiosInstance
      .get('api/plans', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setPlans(response?.data?.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  useEffect(() => {
    axiosInstance
      .get('api/users/details', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const userData = response.data.data;
        if (userData) {
          setUserDetails(userData);
          setSelectedState(userData?.state);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const docTypehandler = (e) => {
    setSelectedDoct(e.target.value);
    if (e.target.value == 'aadhar') {
      setIsAadhar(true);
    } else {
      setIsAadhar(false);
    }
  };

  const handleDoctImage = (e) => {
    const file = e.target.files[0];
    setDoctImage(URL.createObjectURL(file));
  };
  const handleAadharImage = (e) => {
    const file = e.target.files[0];
    setAadharImage(URL.createObjectURL(file));
  };

  const handleStateChange = (event) => {
    const selectedState = event.target.value;
    setSelectedState(selectedState);
  };

  const handlePicChange = (e, fieldName) => {
    setIsLoading(true);
    const file = e.target.files[0];
    // setProfilePic(URL.createObjectURL(file));

    const formData = new FormData();
    if (fieldName == 'profilePic') {
      formData.append('profile_pic', file);
    } else if (fieldName == 'doctFront') {
      formData.append('doc_file', file);
    } else if (fieldName == 'doctBack') {
      formData.append('doc_file_back', file);
    }

    axiosInstance
      .post('api/users/doc', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        setSubmitting(false);
        setIsLoading(false);
        if (fieldName == 'profilePic') {
          setUserDetails((prev) => ({
            ...prev,
            profile_pic: response?.data?.data?.profile_pic,
          }));
        } else if (fieldName == 'doctFront') {
          setUserDetails((prev) => ({
            ...prev,
            doc_file: response?.data?.data?.doc_file,
          }));
        } else if (fieldName == 'doctBack') {
          setUserDetails((prev) => ({
            ...prev,
            doc_file_back: response?.data?.data?.doc_file_back,
          }));
        }
      })
      .catch((err) => {
        setSubmitting(false);
        setIsLoading(false);
        Swal.fire({
          title: 'Error',
          text: err.response.data.message,
          icon: 'error',
        });
      });
    // setProfilePic(response);
    // if (route?.length) {
    //   navigate(route, { state: { state: "getData" } });
    // } else {
    //   navigate('/profile');
    // }
  };

  const profileSubmitHandler = (e) => {
    e.preventDefault();
    if (!(profilePic?.length || userDetails?.profile_pic)) {
      // toast.error("Please upload your profile picture!");
      toast('Please upload your profile picture!', {
        icon: '😥',
      });
      return;
    }
    setSubmitting(true);
    e.preventDefault();
    const data = new FormData(e.target);
    const value = Object.fromEntries(data.entries());

    axiosInstance
      .post('api/users/details', value, {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        console.log(response);
        toast.success(response?.data?.message);
        setSubmitting(false);
        route?.length ? navigate(route) : navigate('/profile');
      })
      .catch((err) => {
        console.log(err);
        setSubmitting(false);
        toast.error(err.response.data.message);
      });
  };
  const handleEditForm = (e, fieldName) => {
    const value = e.target.value;
    let formattedValue = value;

    if (selectedDoct === 'aadhar') {
      formattedValue = formatAadhaarNumber(value);
    }

    setUserDetails((prevState) => ({
      ...prevState,
      [fieldName]: formattedValue,
    }));
  };
  useEffect(() => {
    if (route?.length) {
      toast('Please complete your profile to post an ads!', {
        icon: '⚠️',
      });
    }
  }, []);

  return (
    <form
      className="w-full bg-white rounded shadow p-6"
      onSubmit={profileSubmitHandler}
    >
      <h2 className="font-bold mb-6 text-xl">My Profile</h2>
      <div className="grid sm:grid-cols-2 gap-8">
        <div>
          <p className="text-gray-500 text-sm mb-2">Upload Profile Picture*</p>
          <div className="w-28 h-28 flex items-center justify-center border border-gray-400 rounded-full relative">
            {profilePic || userDetails?.profile_pic?.length ? (
              <img
                src={
                  userDetails?.profile_pic?.length
                    ? `${userDetails?.profile_pic}`
                    : profilePic
                }
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <label
                htmlFor="profile"
                className="cursor-pointer py-8 flex justify-center items-center"
              >
                <FaCamera size={20} color="gray" />
              </label>
            )}
            <input
              id="profile"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePicChange(e, 'profilePic')}
            />
            <div className="w-7 h-7 bg-white flex items-center justify-center border border-black absolute bottom-0 -right-1 rounded-full">
              <label
                htmlFor="profile"
                className="cursor-pointer flex justify-center items-center"
              >
                {isLoading ? (
                  <MdOutlineCloudUpload
                    color="white"
                    className="animate-bounce"
                  />
                ) : (
                  <FiCamera size={15} color="black" />
                )}
              </label>
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="firstname" className="text-gray-500 text-sm">
            Full Name/Company
          </label>
          <input
            id="firstname"
            required
            type="text"
            placeholder="Full Name"
            name="fullname"
            className="border border-gray-200 rounded"
            value={userDetails?.fullname || ''}
            onChange={(e) => handleEditForm(e, 'fullname')}
          />
        </div>

        <div className="flex flex-col gap-2">
          <label htmlFor="email" className="text-gray-500 text-sm">
            Email ID
          </label>
          <input
            id="email"
            type="email"
            placeholder="Email ID"
            name="email"
            className="border border-gray-200 rounded"
            value={userDetails?.email || ''}
            onChange={(e) => handleEditForm(e, 'email')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="mobile" className="text-gray-500 text-sm">
            Mobile
          </label>
          <input
            id="mobile"
            type="text"
            maxLength={10}
            placeholder="Mobile"
            name="mobile"
            readOnly
            className="border border-gray-200 rounded"
            value={userDetails?.mobile || ''}
            onChange={(e) => handleEditForm(e, 'mobile')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="state" className="text-gray-500 text-sm">
            State
          </label>
          {/* <input
            id="state"
            required
            type="text"
            placeholder="State"
            name="state"
            className="border border-gray-200 rounded"
            value={userDetails?.state || ''}
            onChange={(e) => handleEditForm(e, 'state')}
          /> */}
          <select
            name="state"
            id="state"
            value={userDetails?.state || ''}
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
        <div className="flex flex-col gap-2">
          <label htmlFor="city" className="text-gray-500 text-sm">
            City
          </label>
          {/* <input
            id="city"
            required
            type="text"
            placeholder="City"
            name="city"
            className="border border-gray-200 rounded"
            value={userDetails?.city || ''}
            onChange={(e) => handleEditForm(e, 'city')}
          /> */}
          <select
            name="city"
            id="city"
            value={userDetails?.city || ''}
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
        <div className="flex flex-col gap-2">
          <label htmlFor="address" className="text-gray-500 text-sm">
            Locality
          </label>
          <input
            id="address"
            type="text"
            placeholder="Address"
            name="locality"
            className="border border-gray-200 rounded"
            value={userDetails?.locality || ''}
            onChange={(e) => handleEditForm(e, 'locality')}
          />
        </div>
        <div className="flex flex-col gap-2">
          <label htmlFor="pincode" className="text-gray-500 text-sm">
            Pincode*
          </label>
          <input
            id="pincode"
            required
            type="text"
            placeholder="Pincode"
            name="pincode"
            maxLength={6}
            className="border border-gray-200 rounded"
            value={userDetails?.pincode || ''}
            onChange={(e) => handleEditForm(e, 'pincode')}
          />
        </div>
        {/* <div className='flex flex-col gap-2'>
                    <label htmlFor="plans" className='text-gray-500 text-sm'>Select Plan</label>
                    <select name="plan_id" id="plans" className='border border-gray-200 rounded text-gray-500'>
                            <option value="" disabled>Select Plan</option>
                            {plans?.length>0 && plans?.map((item)=> (
                                <option value={item.id} key={item.id}>{item.type}</option>
                            ))}
                    </select>
                </div> */}
      </div>

      <div className="grid sm:grid-cols-2 gap-6 my-8">
        <div className="flex flex-col gap-2">
          <div className="flex flex-col gap-2">
            <label htmlFor="doc_type" className="text-gray-500 text-sm">
              Select Document Type
            </label>
            <select
              name="doc_type"
              id="doc_type"
              className="border border-gray-200 rounded text-gray-500"
              onChange={docTypehandler}
            >
              <option value="" disabled>
                Select Document Type
              </option>
              <option value="pan">PAN Card</option>
              <option value="aadhar">Aadhar Card</option>
              <option value="gst">GST Document</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label htmlFor="doc_no" className="text-gray-500 text-sm">
              {selectedDoct == 'pan'
                ? 'Pan Number: '
                : selectedDoct == 'gst'
                ? 'GST Number: '
                : selectedDoct == 'aadhar' && 'Aadhar Number: '}
            </label>
            <input
              id="doc_no"
              type="text"
              placeholder={
                selectedDoct == 'aadhar'
                  ? 'XXXX XXXX XXXX XXXX'
                  : selectedDoct == 'pan'
                  ? 'Pan Card Number'
                  : selectedDoct == 'gst' && 'GST Number'
              }
              name="doc_number"
              maxLength={
                selectedDoct == 'aadhar'
                  ? 14
                  : selectedDoct == 'pan'
                  ? 10
                  : selectedDoct == 'gst' && 15
              }
              value={userDetails?.doc_number || ''}
              onChange={(e) => handleEditForm(e, 'doc_number')}
              className="border border-gray-200 rounded"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-10">
        <div>
          <p className="text-gray-500 text-sm mb-2">
            {isAadhar ? 'Upload Document(Front Side)*' : 'Upload Document*'}
          </p>
          <div
            className={`${
              doctImage || (userDetails?.doc_file && 'w-fit h-fit')
            } border border-gray-400 rounded-md relative`}
          >
            {doctImage || userDetails?.doc_file?.length ? (
              <img
                src={
                  userDetails?.doc_file?.length
                    ? `${userDetails?.doc_file}`
                    : doctImage
                }
                alt="doctImage"
                className="w-[20rem] h-[12rem] rounded-md object-cover"
              />
            ) : (
              <label
                htmlFor="document"
                className="cursor-pointer py-8 flex justify-center items-center"
              >
                <FaCamera size={30} color="gray" />
              </label>
            )}
            <input
              id="document"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => handlePicChange(e, 'doctFront')}
            />
            {userDetails?.doc_file && (
              <div className="w-7 h-7 bg-gray-500 flex items-center justify-center border absolute bottom-0 -right-1 rounded-full">
                <label
                  htmlFor="document"
                  className="cursor-pointer flex justify-center items-center"
                >
                  <RiImageAddLine size={15} color="white" />
                </label>
              </div>
            )}
          </div>
        </div>
        {isAadhar && (
          <div>
            <p className="text-gray-500 text-sm mb-2">
              Upload Document(Back Side)*
            </p>
            <div
              className={`${
                aadharImage && 'w-fit h-fit'
              } border border-gray-400 rounded-md relative`}
            >
              {aadharImage || userDetails?.doc_file_back ? (
                <img
                  src={
                    userDetails?.doc_file_back
                      ? `${userDetails?.doc_file_back}`
                      : aadharImage
                  }
                  alt="aadharImage"
                  className="w-[20rem] h-[12rem] rounded-md object-cover"
                />
              ) : (
                <label
                  htmlFor="documentAadhar"
                  className="cursor-pointer py-8 flex justify-center items-center"
                >
                  <FaCamera size={30} color="gray" />
                </label>
              )}
              <input
                id="documentAadhar"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => handlePicChange(e, 'doctBack')}
              />
              {userDetails?.doc_file_back && (
                <div className="w-7 h-7 bg-gray-500 flex items-center justify-center border absolute bottom-0 -right-1 rounded-full">
                  <label
                    htmlFor="documentAadhar"
                    className="cursor-pointer flex justify-center items-center"
                  >
                    <RiImageAddLine size={15} color="white" />
                  </label>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-2 my-8">
        <label htmlFor="about" className="text-gray-500 text-sm">
          About
        </label>
        <textarea
          placeholder="Describe about yourself/company"
          name="about"
          id="about"
          cols="20"
          rows="5"
          className=" p-2 border border-gray-200 rounded"
          value={userDetails?.about}
          onChange={(e) => handleEditForm(e, 'about')}
        ></textarea>
      </div>
      <div className="flex justify-end pt-4">
        <Button category={'primarybtn'} type={'submit'} disabled={submitting}>
          {submitting ? 'Submitting' : 'Submit'}
        </Button>
      </div>
    </form>
  );
};

export default AddProfile;
