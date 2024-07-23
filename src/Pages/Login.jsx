import React, { useState, useEffect } from "react";
import Button from "../Components/Button/Button";
import { Link, useLocation } from "react-router-dom";
import axiosInstance from "../api/axiosInstance";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import toast from "react-hot-toast";

export const isLoggedIn = () => {
  return localStorage.getItem("token") != null ? true : false;
};

const Login = () => {
  const [step, setStep] = useState(1);
  const [userData, setUserData] = useState({
    mobile: null,
    otp: null,
  });
  const [otp, setOtp] = useState(null);
  const { isLoggedIn, setIsLoggedIn } = useLogin();
  const navigate = useNavigate();
  const location = useLocation();
  const route = location?.state?.route;


  const onNumberChangeHandler = (e) => {
    setUserData((prev) => ({
      ...prev,
      mobile: e.target.value,
    }));
  };
  const submitNumberHandler = () => {
    if(userData?.mobile < 1){
      toast.error("Please enter number number")
      return;
    }else if(userData?.mobile?.length < 10){
      toast.error("Please enter 10 digit mobile number");
    }
    axiosInstance
      .post(
        "api/users/sendotp",
        { mobile: userData.mobile },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        setOtp(response.data.data.otp);
        setStep((prev) => prev + 1);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err?.response?.data?.message ? err?.response?.data?.message : "Something went wrong please try again" )
      });
  };

  const onOtpChangeHandler = (e) => {
    setOtp(e.target.value)
  };

  const handleKeyDown = (e,handler)=>{
    if(e.key ==="Enter"){
      handler();
    }
  }
 
  const loginHandler = () => {
    const otpNumber = Number(userData.otp);
    axiosInstance
      .post(
        "api/users/login",
        { ...userData, otp: otp },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        toast.success('Welcome to BesaKina!')
        localStorage.setItem("token", response.data.token);
        setIsLoggedIn(true);
        if(route){
          navigate(route)
        }else{
          navigate("/");
        }
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message)
      });
  };

  return (
    <div className="flex justify-center items-center h-[100vh]">
      <div className="flex flex-col gap-8 p-4 bg-white rounded sm:shadow">
        <div className="w-[350px]">
          <img src="/logo.png" className="w-[120px] m-auto" alt="" />
        </div>
        {step == 1 && (
          <div className="flex flex-col gap-4 justify-center items-center  ">
            <p className="font-semibold">Enter your Phone Number</p>
            <input
              id="phone"
              type="phone"
              maxLength="10"
              required
              onChange={onNumberChangeHandler}
              onKeyDown={(e)=>handleKeyDown(e,submitNumberHandler)}
              className="w-[320px] h-[40px] border-[1px] border-gray-300 rounded-md pl-2"
              placeholder="Enter mobile number"
            />
            <Button
              clickHandler={submitNumberHandler}
              category={"primarybtn"}
              classItems={"w-56 rounded-xl"}
            >
              Continue
            </Button>
            <Link to="/">
              <p className="text-sm text-gray-500 mt-2">
                Continue without login
              </p>
            </Link>
          </div>
        )}
        {step == 2 && (
          <div className="flex flex-col gap-4 justify-center items-center  ">
            <p className="font-semibold">Enter OTP</p>
            <input
              id="number"
              type="number"
              required
              value={otp}
              onChange={onOtpChangeHandler}
              max={4}
              onKeyDown={(e)=>handleKeyDown(e,loginHandler)}
              className="w-[320px] h-[40px] border-[1px] border-gray-300 rounded-md pl-2"
              placeholder="Enter OTP here"
            />
            <Button
              clickHandler={loginHandler}
              category={"primarybtn"}
              classItems={"w-56 rounded-xl"}
            >
              Continue
            </Button>
            <Link to="/">
              <p className="text-sm text-gray-500 mt-2">
                Continue without login
              </p>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
