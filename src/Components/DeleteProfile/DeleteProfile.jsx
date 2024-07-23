import React from 'react';
import Button from '../Button/Button';
import toast from 'react-hot-toast';

const DeleteProfile = () => {
  const handleDeleteButton = () => {
    toast.error('This feature is currently disabled');
  };
  return (
    <div className="w-full bg-white rounded shadow p-4 sm:p-6">
      <h2 className="font-bold mb-6 text-xl">Delete Account</h2>
      <div className="grid grid-cols-1 gap-4">
        <div className="flex flex-col gap-2 ">
          <label htmlFor="reason" className="text-gray-500 text-sm">
            Please enter a reason why you are deleting your account
          </label>
          <textarea
            placeholder="Enter here"
            name="reason"
            id="reason"
            cols="20"
            rows="5"
            className=" p-2 border border-gray-200 rounded"
          ></textarea>
        </div>
        {/* <div className='flex flex-col gap-2'>
            <label htmlFor="password" className='text-gray-500 text-sm'>Please enter your Password</label>
            <input id='password' type="text" placeholder='Password' name='password' className='border border-gray-200 rounded' />
        </div> */}
      </div>
      <div className="flex justify-end pt-4">
        <Button clickHandler={handleDeleteButton} category={'primarybtn'}>
          Delete Account
        </Button>
      </div>
    </div>
  );
};

export default DeleteProfile;
