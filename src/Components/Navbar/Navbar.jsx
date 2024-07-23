import { useEffect, useRef, useState } from 'react';
import Button from '../Button/Button';
import { RxHamburgerMenu } from 'react-icons/rx';
import { BsSearch } from 'react-icons/bs';
import styles from './Navbar.module.css';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { FaUser } from 'react-icons/fa';
import { Dropdown } from 'flowbite-react';
import { useLogin } from '../../hooks/useLogin';
import { baseURL } from '../../api/axiosInstance';
import axios from 'axios';
import ProductCard from '../Cards/ProductCard';

const Navbar = () => {
  const [search, setSearch] = useState();
  const [searchData, setSearchData] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const navRef = useRef();
  const { isLoggedIn, setIsLoggedIn } = useLogin();

  const navOpenHandler = () => {
    if (navRef.current.classList.contains('h-0')) {
      navRef.current.classList.remove('h-0');
      navRef.current.classList.add('h-auto');
    } else {
      navRef.current.classList.remove('h-auto');
      navRef.current.classList.add('h-0');
    }
  };
  const logoutHandler = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  const searchapi = () => {
    setLoading(true);
    axios
      .get(`${baseURL}home/search`, { params: { search: search } })
      .then((response) => {
        setSearchData(response?.data?.data?.advertisements);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data: ', error);
        setLoading(false);
      });
  };
  useEffect(() => {
    if (search?.length > 0) {
      const timer = setTimeout(() => {
        searchapi();
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [search]);

  const OnchangeSearch = (e) => {
    setSearch(e.target.value);
  };
  const handleProductNavigate = (item) => {
    setSearch('');
    if (item?.advType === 'Property') {
      return navigate(`/propertiesdetails/${item._id}`);
    } else if (item.advType === 'Vehicle') {
      return navigate(`/vehicledetails/${item._id}`);
    } else if (item.advType === 'Education') {
      return navigate(`/educationdetails/${item._id}`);
    } else if (item.advType === 'Hospitality') {
      return navigate(`/hospitalitydetails/${item._id}`);
    } else if (item.advType === 'Hospital') {
      return navigate(`/hospitaldetails/${item._id}`);
    }
  };

  return (
    <header className="lg:px-8 md:px-6 px-2 xsm:px-4 py-4 shadow-md sticky top-0 bg-white z-50">
      <section className="flex lg:items-center items-start lg:flex-row flex-col justify-between lg:justify-between max-w-[1500px] m-auto">
        <section className="flex items-center justify-between w-[100%]  lg:justify-start  lg:w-auto lg:gap-8 gap-4 ">
          <div className="flex items-center gap-2  md:gap-4">
            <button
              onClick={navOpenHandler}
              className="rounded-full bg-sky-100 p-[2px]"
            >
              <RxHamburgerMenu size={25} className="lg:hidden block" />
            </button>
            <Link to={'/'}>
              <div className="w-[160px] hidden md:block">
                <img src="/logo.png" className="w-full" alt="" />
              </div>
            </Link>
            <Link to={'/'}>
              <div className="xsm:w-[50px] w-[40px] md:hidden">
                <img src="/small_logo.png" className="w-full" alt="" />
              </div>
            </Link>
          </div>

          {/* search bar */}
          <div className="relative">
            <div className="flex items-center bg-slate-100  rounded-md">
              <input
                type="text"
                onChange={(e) => OnchangeSearch(e)}
                value={search}
                className="placeholder:text-xs sm:placeholder:text-sm w-[200px] xsm:w-[300px] sm:w-[400px]  md:w-[30vw]  pl-2 bg-transparent focus:outline-none border-none"
                placeholder="Search for product, business or service"
              />
              <Button category={'primarybtn'}>
                <BsSearch size={18} color="white" />
              </Button>
            </div>

            {/* search item */}
            {searchData?.length > 0 && search.length > 0 && (
              <div className="absolute bg-white w-full max-h-64 overflow-auto">
                {searchData?.map((item, index) => (
                  <ul
                    key={index}
                    className="flex flex-col gap-2 border-t border-b"
                  >
                    <li
                      onClick={() => handleProductNavigate(item)}
                      className="flex items-center gap-2 cursor-pointer hover:bg-gray-200 p-2"
                    >
                      <img
                        src={`${item?.images[0]}`}
                        alt={item?.images[0]}
                        className="w-12 h-12 object-cover rounded-md"
                      />
                      <div className="flex flex-col">
                        <p className="capitalize">{item?.title}</p>
                        <p className="capitalize text-sm">
                          {' '}
                          Category: {item?.advType}
                        </p>
                      </div>
                    </li>
                  </ul>
                ))}
              </div>
            )}
          </div>
        </section>
        <nav
          className={`lg:block lg:h-auto h-0 overflow-hidden ${styles.navdrop}`}
          ref={navRef}
        >
          <div className="lg:hidden flex items-center gap-2 pt-8 pb-4 border-b-[1px]">
            <div>
              <img src="/profile.png" className="w-[70px]" alt="" />
            </div>
            <div>
              <h2 className="font-bold text-lg">Welcome to Besakina.com</h2>
              <p className="text-sm text-slate-500">
                Buying and selling made easy for you.
              </p>
            </div>
          </div>
          <ul className="flex lg:items-center lg:flex-row flex-col pt-2 pb-2 lg:pt-0 lg:pb-0  gap-4 lg:gap-8 font-semibold">
            {/* <li className="py-2 lg:py-0">
              <a href="">List Your Business</a>
            </li> */}
            {/* <li className='py-2 md:py-0'><a href="" >Post Your Requirement</a></li> */}

            {isLoggedIn ? (
              <li className="py-2 lg:py-0">
                <Link to="/postad" onClick={() => navOpenHandler()}>
                  Post an Ad
                </Link>
              </li>
            ) : (
              <li className="py-2 lg:py-0">
                <Link to="/login">Post an Ad</Link>
              </li>
            )}
            {isLoggedIn && (
              <>
                <li className="py-2 lg:py-0 lg:hidden">
                  <Link to="/profile" onClick={() => navOpenHandler()}>
                    Profile
                  </Link>
                </li>
                <li className="py-2 lg:py-0 lg:hidden">
                  <Link to="/plans" onClick={() => navOpenHandler()}>
                    My Plans
                  </Link>
                </li>
                <li className="py-2 lg:py-0 lg:hidden">
                  <button onClick={logoutHandler}>Logout</button>
                </li>
              </>
            )}

            {isLoggedIn ? (
              <>
                <Dropdown
                  inline
                  label={''}
                  dismissOnClick={false}
                  renderTrigger={() => (
                    <button className="hidden lg:block">
                      <FaUser size={18} color="black" />
                    </button>
                  )}
                >
                  <Dropdown.Item
                    onClick={() => {
                      navigate('/profile'), navOpenHandler();
                    }}
                  >
                    Profile
                  </Dropdown.Item>
                  <Dropdown.Item
                    onClick={() => {
                      navigate('/plans'), navOpenHandler();
                    }}
                  >
                    My Plans
                  </Dropdown.Item>
                  <Dropdown.Item onClick={logoutHandler}>Logout</Dropdown.Item>
                </Dropdown>
              </>
            ) : (
              <li className="py-2 md:py-0">
                <Button
                  category={'primarybtn'}
                  clickHandler={() => navigate('/login')}
                >
                  Login
                </Button>
              </li>
            )}
          </ul>
        </nav>
      </section>
    </header>
  );
};

export default Navbar;
