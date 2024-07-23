import React, { useEffect, useState } from 'react';
import { RxHamburgerMenu } from 'react-icons/rx';
import { MdNavigateNext } from 'react-icons/md';
import { Link } from 'react-router-dom';

const Categories = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    if (window.innerWidth <= 1024) {
      setIsMenuOpen(!isMenuOpen);
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 1024 && isMenuOpen) {
        setIsMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [isMenuOpen]);
  return (
    <section
      className={`${
        isMenuOpen ? 'flex-col' : 'items-center gap-8 max-w-[1450px] m-auto'
      } lg:px-12 px-2 xsm:px-4 py-4 flex`}
    >
      <button
        onClick={toggleMenu}
        className="flex items-center justify-between bg-[#1A5C96] text-white rounded-md px-4 py-[12px] w-[200px] sm:w-[250px]"
      >
        <span className="flex items-center gap-2 text-sm sm:text-base whitespace-nowrap">
          <RxHamburgerMenu size={20} /> All Categories
        </span>
        <MdNavigateNext size={25} />
      </button>
      <nav
        className={`${
          isMenuOpen ? 'block animate-slideDown' : 'hidden'
        } lg:block w-full`}
      >
        <ul className={`${isMenuOpen ? 'flex-col gap-4 pt-5' : 'gap-4'} flex`}>
          <li>
            <Link
              to="/properties"
              className="border-[1px] border-slate-400 px-2 py-[2px] rounded-md"
            >
              Properties
            </Link>
          </li>
          <li>
            <Link
              to="/education"
              className="border-[1px] border-slate-400 px-2 py-[2px] rounded-md"
            >
              Education
            </Link>
          </li>
          <li>
            <Link
              to="/vehicles"
              className="border-[1px] border-slate-400 px-2 py-[2px] rounded-md"
            >
              Vehicles
            </Link>
          </li>
          <li>
            <Link
              to="/hospitality"
              className="border-[1px] border-slate-400 px-2 py-[2px] rounded-md"
            >
              Hospitality
            </Link>
          </li>
          <li>
            <Link
              to="/healthcare"
              className="border-[1px] border-slate-400 px-2 py-[2px] rounded-md"
            >
              Healthcare
            </Link>
          </li>
          {/* <li><Link to="/hospitals" className='border-[1px] border-slate-400 px-2 py-[2px] rounded-md'>Hospitals</Link></li> */}
        </ul>
      </nav>
    </section>
  );
};

export default Categories;
