import React, { useState } from "react";
import { FaLocationDot } from "react-icons/fa6";
import { MdVerified } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { baseURL } from "../../api/axiosInstance";
import Switch from "@mui/material/Switch";
import axiosInstance from "../../api/axiosInstance";
import dayjs from "dayjs";
import { FaRegEdit } from "react-icons/fa";
import { MdOutlineDeleteOutline } from "react-icons/md";
import Swal from "sweetalert2";
import toast from "react-hot-toast";

const AdCard = ({ data, link , refresh}) => {
  const token = localStorage.getItem("token");
  const [isActive, setisActive] = useState(data?.is_active);
  const navigate = useNavigate();
  
  const categoryRoutes ={
    Property: "propertiesdetails",
    Vehicle: "vehicledetails",
    Education: "educationdetails",
    Hospitality: "hospitalitydetails",
    Doctor: "doctordetails",
    Hospital: "hospitaldetails"
  }

  const editRoutes = {
    Vehicle: "vehicle",
    Property: "property",
    Education: "education",
    Hospitality: "hospitality",
    Doctor : "healthcare",
    Hospital : "healthcare",
  }

  const category = data?.advType;
  const id = data?._id;

  const refreshOnce = () => {
    refresh();
  }

  const disableHandler = (id, category) => {
    if (isActive) {
      if (confirm("Are you sure you want to disable the ad?") == true) {
        axiosInstance
          .delete(`api/${category}/deactivate/id/${id}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          })
          .then((response) => {
            console.log(response);
            toast.success(response?.data?.message)
            setisActive(!isActive);
          })
          .catch((err) => {
            setisActive(!isActive);
            toast.error(err?.response?.data?.message)
            console.log(err);
          });
      }
    } else {
      if (confirm("Are you sure you want to enable the ad?") == true) {
        axiosInstance
          .put(
            `api/${category}/activate/id/${id}`,
            {},
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          )
          .then((response) => {
            setisActive(!isActive);
            console.log(response);
            toast.success(response?.data?.message)
          })
          .catch((err) => {
            setisActive(!isActive);
            console.log(err);
            toast.error(err?.response?.data?.message)
          });
      }
    }
  };

  const handleDeleteAd = () => {
    if (confirm("Are you sure you want to delete the ad?") == true) {
      axiosInstance
        .delete(`api/${category}/id/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          toast.success(response?.data?.message);
          refreshOnce();
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }


  return (
    <div className="border-[1px] border-slate-400 rounded-md overflow-hidden bg-white">
      <div className="h-[150px] sm:h-[200px]">
        <img
          src={`${data?.images[0]}`}
          alt="image"
          className="sm:h-[200px] h-full w-full object-cover"
        />
      </div>
      <div className="w-[100%] p-2 flex flex-col gap-2">
        <div>
          <div className="flex justify-between items-center">
            <h2 className="font-bold xl:text-lg">
              {" "}
              {data?.name ? data?.name : data?.title ? data?.title : "₹" + data?.price}
            </h2>
            <div className="flex items-center gap-5">
              <Switch
                checked={isActive}
                size="small"
                onChange={() => disableHandler(id, category)}
              />
              <FaRegEdit
                onClick={() => navigate(`/edit-${editRoutes[category]}-details/${id}`,{state:{category:category}})}
                className="w-5 h-5 cursor-pointer"
              />
              <MdOutlineDeleteOutline onClick={handleDeleteAd} className="w-6 h-6 cursor-pointer"/>
            </div>
          </div>
          <p className="text-xs xl:text-sm">{data?.title?.slice(0, 40)}...</p>
        </div>
        <div>
          <div className="flex items-center gap-[3px]">
            <div>
              <FaLocationDot />
            </div>
            <p className="font-semibold text-xs xl:text-sm">{`${data?.city} ${data?.state}`}</p>
          </div>
        </div>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-[3px]">
            {category && categoryRoutes[category] && (
              <Link
                to={`/${categoryRoutes[category]}/${id}`}
                className="text-sm font-bold"
              >
                View Details
              </Link>
            )}
          </div>
          <p className="text-xs font-bold">
            {dayjs(data?.created_at).format("DD/MM/YYYY")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdCard;
