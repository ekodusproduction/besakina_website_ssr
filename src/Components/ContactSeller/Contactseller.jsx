import React, { useState } from 'react';
import { useLogin } from '../../hooks/useLogin';
import { useNavigate } from 'react-router-dom';
import { baseURL } from '../../api/axiosInstance';
import axiosInstance from '../../api/axiosInstance';
import { MdVerified } from 'react-icons/md';
import Button from '../Button/Button';
import profilePic from "../../../public/profile.png"

const Contactseller = ({ data,route }) => {
  const token = localStorage.getItem('token');
  const { isLoggedIn } = useLogin();
  const [showContactDetails, setShowContactDetails] = useState(false);
  const [contactDetails, setContactDetails] = useState([]);
  const navigate = useNavigate();

  const handleContactSeller = (id) => {
    if (isLoggedIn) {
      axiosInstance
        .get(`api/users/id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setContactDetails(response?.data?.data);
          setShowContactDetails(true);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      navigate('/login',{state:{route}});
    }
  };
  

  function formatDate(dateString) {
    const createdDate = new Date(dateString);
    const monthNames = [
      'Jan',
      'Feb',
      'Mar',
      'Apr',
      'May',
      'Jun',
      'Jul',
      'Aug',
      'Sep',
      'Oct',
      'Nov',
      'Dec',
    ];
    return `Member since ${
      monthNames[createdDate.getMonth()]
    } ${createdDate.getFullYear()}`;
  }

  return (
    <div>
      <h3 className="my-4 font-bold">Seller Details</h3>
      <div className="flex gap-4 items-center pb-2">
        <div className="py-2 border-slate-400 flex justify-center items-center">
          <img
            src={
              data?.user?.profile_pic
                ? data?.user?.profile_pic
                : profilePic
            }
            className="w-20 h-20 overflow-hidden rounded-full"
            alt=""
          />
        </div>
        <div>
          <h4 className="font-bold">{data?.user?.fullname}</h4>
          {data?.user?.doc_number &&
          <p className="text-sm sm:text-base text-slate-700">
            <span className="font-semibold capitalize">
              {data?.user?.doc_type}:
            </span>
            {data?.user?.doc_number}
          </p>}
          <p className="text-sm sm:text-base text-slate-700">
            {formatDate(data?.user?.created_at)}
          </p>
        </div>
      </div>
      {data?.verified == 1 && (
        <div className="flex items-center gap-[3px] text-[#179CF0]">
          <MdVerified />
          <p className="text-sm font-bold">Verified</p>
        </div>
      )}
      <p className="py-2 text-sm sm:text-sm text-slate-700">
        {data?.user?.about}
      </p>
      <Button
        clickHandler={() => handleContactSeller(data?.user?._id)}
        category={'primarybtn'}
      >
        Contact Seller
      </Button>

      {contactDetails?.mobile && (
        <p className="py-4 font-medium text-lg">
          Phone number: {contactDetails?.mobile}{' '}
        </p>
      )}
    </div>
  );
};

export default Contactseller;
