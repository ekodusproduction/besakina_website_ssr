import React, { useState } from 'react';
import { CiUser } from 'react-icons/ci';
import { CiBookmark } from 'react-icons/ci';
import { IoBagAddOutline } from 'react-icons/io5';
import { CiTrash } from 'react-icons/ci';
import Button from '../Components/Button/Button';
import { Link, useLocation } from 'react-router-dom';
import AddProfile from '../Components/AddProfile/AddProfile';
import MyListing from '../Components/MyListing/MyListing';
import ChangePassword from '../Components/ChangePassword/ChangePassword';
import DeleteProfile from '../Components/DeleteProfile/DeleteProfile';
import { RxHamburgerMenu } from 'react-icons/rx';
import BackButton from '../Components/BackButton/BackButton';

const Profile = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [selectMenu, setSelectedMenu] = useState('addprofile');
  const location = useLocation();
  const state = location?.state?.state;
  return (
    <>
      <BackButton path={-1} style={'mx-12 py-2'} />
      <div className="mx-12 flex flex-col lg:flex-row gap-6 ">
        <div className="bg-white shadow rounded lg:w-[300px] h-fit">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="py-2 px-4 bg-black text-white flex items-center gap-2 w-full"
          >
            <div className="lg:hidden">
              <RxHamburgerMenu />
            </div>
            <h3 className="font-semibold ">Navigation</h3>
          </button>

          <div className="py-2 px-4 hidden lg:block">
            <div className="flex gap-2 items-center py-2 my-[3px] rounded">
              <div>
                <CiUser color="gray" />
              </div>
              <button
                onClick={() => setSelectedMenu('addprofile')}
                className="text-gray-700"
              >
                Profile
              </button>
            </div>
            <div className="flex gap-2 items-center py-2 my-[3px] rounded">
              <div>
                <CiBookmark color="gray" />
              </div>
              <button
                onClick={() => setSelectedMenu('mylisting')}
                className="text-gray-700"
              >
                My Listing
              </button>
            </div>
            <div className="flex gap-2 items-center py-2 my-[3px] rounded">
              <div>
                <IoBagAddOutline color="gray" />
              </div>
              <Link to="/postad" className="text-gray-700">
                Add Listing
              </Link>
            </div>
            <div className="flex gap-2 items-center py-2 my-[3px] rounded">
              <div>
                <CiTrash color="gray" />
              </div>
              <button
                onClick={() => setSelectedMenu('deleteprofile')}
                className="text-gray-700"
              >
                Delete profile
              </button>
            </div>
          </div>
          {showMenu && (
            <div className="py-2 px-4 lg:hidden">
              <div className="flex gap-2 items-center py-2 my-[3px] rounded">
                <div>
                  <CiUser color="gray" />
                </div>
                <button
                  onClick={() => {
                    setSelectedMenu('addprofile'), setShowMenu(!showMenu);
                  }}
                  className="text-gray-700"
                >
                  Profile
                </button>
              </div>
              <div className="flex gap-2 items-center py-2 my-[3px] rounded">
                <div>
                  <CiBookmark color="gray" />
                </div>
                <button
                  onClick={() => {
                    setSelectedMenu('mylisting'), setShowMenu(!showMenu);
                  }}
                  className="text-gray-700"
                >
                  My Listing
                </button>
              </div>
              <div className="flex gap-2 items-center py-2 my-[3px] rounded">
                <div>
                  <IoBagAddOutline color="gray" />
                </div>
                <Link to="/postad" className="text-gray-700">
                  Add Listing
                </Link>
              </div>
              <div className="flex gap-2 items-center py-2 my-[3px] rounded">
                <div>
                  <CiTrash color="gray" />
                </div>
                <button
                  onClick={() => {
                    setSelectedMenu('deleteprofile'), setShowMenu(!showMenu);
                  }}
                  className="text-gray-700"
                >
                  Delete profile
                </button>
              </div>
            </div>
          )}
        </div>
        {selectMenu == 'addprofile' && <AddProfile />}
        {selectMenu == 'mylisting' && <MyListing />}
        {selectMenu == 'changepassword' && <ChangePassword />}
        {selectMenu == 'deleteprofile' && <DeleteProfile />}
      </div>
    </>
  );
};

export default Profile;
