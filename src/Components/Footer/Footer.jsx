import React from 'react';
import { FaFacebook } from 'react-icons/fa';
import { TfiLinkedin } from 'react-icons/tfi';
import { Link } from 'react-router-dom';

const Footer = () => {
  var currentDate = new Date();

  // Get the current year
  var currentYear = currentDate.getFullYear();
  return (
    <footer className="bg-[#1A5C96]">
      <section className="px-4 md:px-12 pt-12 pb-8 flex lg:flex-row flex-col justify-start gap-6 lg:gap-20 text-white">
        <div className="w-[220px]">
          <img src="/logo.png" alt="" className="w-[150px] filter grayscale" />
          <p className="mt-4 text-sm">Direct Mail and Online Market Place.</p>
          <div className="">
            <a href=""></a>
            <a href=""></a>
            <a href=""></a>
            <a href=""></a>
          </div>
        </div>
        <div className="lg:w-[140px]">
          <h3 className="font-bold text-lg mb-4">About us</h3>
          <ul className="flex flex-col md:flex-row lg:flex-col md:gap-4 gap-2">
            <li>
              <a href="">About Us</a>
            </li>
            <li>
              <Link to={'/listing-categories'}>Listing Categories</Link>
            </li>
            <li>
              <Link>FAQ</Link>
            </li>
            <li>
              <Link>How it works</Link>
            </li>
          </ul>
        </div>
        <div className="lg:w-[140px]">
          <h3 className="font-bold text-lg mb-4">Quick Links</h3>
          <ul className="flex flex-col md:flex-row lg:flex-col md:gap-4 gap-2">
            <li>
              <a href="">Advertise with us</a>
            </li>
            <li>
              <Link to={'/plans'}>Pricing</Link>
            </li>
            <li>
              <a href="">Customer Care</a>
            </li>
            <li>
              <a href="">Contact us</a>
            </li>
          </ul>
        </div>
        {/* <div className='lg:w-[140px]' >
                <h3 className='font-bold text-lg mb-4'>Top Cities</h3>
                <ul className='flex flex-col md:flex-row lg:flex-col md:gap-4 gap-2'>
                    <li><a href="">Guwahati</a></li>
                    <li><a href="">Jorhat</a></li>
                    <li><a href="">Bongaigaon</a></li>
                    <li><a href="">Nagaon</a></li>
                </ul>
            </div> */}
        <div className="lg:w-[140px]">
          <h3 className="font-bold text-lg mb-4">BesaKina</h3>
          <ul className="flex flex-col md:flex-row lg:flex-col md:gap-4 gap-2">
            <li>
              <Link>Terms & Conditions</Link>
            </li>
            <li>
              <Link>Privacy Policy</Link>
            </li>
          </ul>
        </div>
        <div className="flex flex-col">
          <p>Helpline Number:</p>
          <p className="text-xl font-bold">+91 78963 82896</p>
          <p className="pt-8 font-medium">Follow us</p>
          <div className="flex items-center gap-5 pt-2">
            <Link>
              <FaFacebook />
            </Link>
            <Link>
              <span class="[&>svg]:h-5 [&>svg]:w-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 448 512"
                >
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </span>
            </Link>
            <a
              href="https://www.linkedin.com/company/ekodus-inc"
              target="_blank"
            >
              <TfiLinkedin />
            </a>
          </div>
        </div>
      </section>
      <div className="text-white flex items-center justify-center py-4 text-sm border-t border-gray-500">
        © {currentYear} BesaKina. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;
