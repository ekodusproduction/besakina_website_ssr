import React, { useState, useEffect } from 'react';
import Categories from '../Components/Categories/Categories';
import { Link } from 'react-router-dom';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/skyblue';
import Button from '../Components/Button/Button';
import ProductCard from '../Components/Cards/ProductCard';
import axiosInstance from '../api/axiosInstance';
import { IoFilterOutline } from 'react-icons/io5';

const Vehicles = () => {
  const [priceRange, setPriceRange] = useState({
    min_price: 0,
    max_price: '',
  });
  const [filter, setFilter] = useState({
    type: '',
    brand: '',
    fuel: '',
  });
  const [vehiclesList, setVehiclesList] = useState([]);
  const [notFound, setNotFound] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  useEffect(() => {
    axiosInstance
      .get('api/vehicle/list')
      .then((response) => {
        console.log(response);
        setVehiclesList(response.data.data.vehicles);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const filterHandler = () => {
    let url = `api/vehicle/filter?minPrice=${priceRange.min_price}`;
    if (filter.brand) url += `&brand=${filter.brand}`;
    if (filter.type) url += `&type=${filter.type}`;
    if (filter.fuel) url += `&fuel=${filter.fuel}`;
    if (priceRange.max_price) url += `&maxPrice=${priceRange.max_price}`;

    axiosInstance
      .get(
        url
      )
      .then((response) => {
        setVehiclesList(response.data.data.vehicles);
      })
      .catch((err) => {
        console.log(err);
        if ((err.response.http_status_code = 404)) {
          setNotFound(true);
        }
      });
  };

  console.log(filter);

  return (
    <>
      <Categories />
      <div className="md:px-12 sm:px-4 px-2 py-2 max-w-[1450px] m-auto ">
        <div className="flex gap-2 sm:mb-6">
          <Link to="/" className="font-semibold">
            Home
          </Link>
          <p> {'>'} </p>
          <Link className="font-semibold">
            Vehicles
          </Link>
        </div>
        <div>
          <Splide aria-label="Banner">
            <SplideSlide>
              <img
                src="/assets/Post/vehical (3).jpg"
                className="w-[100%] rounded-xl"
                alt="Image 1"
              />
            </SplideSlide>
            {/* <SplideSlide>
              <img
                src="/assets/Banner/properties_banner.png"
                className="w-[100%]"
                alt="Image 1"
              />
            </SplideSlide> */}
          </Splide>
        </div>
        <div className="py-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="w-full max-w-[300px] bg-white">
              <div
                className="bg-[#3484A1] px-2 py-[3px] mb-4 rounded text-white shadow flex flex-row items-center gap-2 cursor-pointer w-fit"
                onClick={() => setShowFilter(!showFilter)}
              >
                <h3 className="font-semibold">Filter</h3>
                <IoFilterOutline />
              </div>
              {showFilter && (
                <>
                  <div className="flex gap-4">
                    <div>
                      <p className="font-medium">Type</p>
                      <select
                        name='type'
                        onClick={(e) =>
                          setFilter((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                          }))
                        }
                        className="w-[10rem]"
                      >
                        <option value="Car">Car</option>
                        <option value="Motorcycle">Motorcycle</option>
                        <option value="Scooter">Scooter</option>
                        <option value="Bicycle">Bicycle</option>
                      </select>
                    </div>
                    <div>
                      <p className="font-medium">Brand</p>
                      <select onClick={(e) =>
                          setFilter((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                          }))
                        } name="brand" id="" className="w-[10rem]">
                        <option value="BMW">BMW</option>
                        <option value="Ford">Ford</option>
                        <option value="Fiat">Fiat</option>
                        <option value="Honda">Honda</option>
                        <option value="Hyundai">Hyundai</option>
                        <option value="Jeep">Jeep</option>
                        <option value="Mercedes">Mercedes</option>
                        <option value="Toyota">Toyota</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div>
                      <p className="font-medium">Fuel</p>
                      <select onClick={(e) =>
                          setFilter((prev) => ({
                            ...prev,
                            [e.target.name]: e.target.value,
                          }))
                        } name="fuel" id="">
                        <option value="petrol">Petrol</option>
                        <option value="diesel">Diesel</option>
                        <option value="electric">Electric</option>
                        <option value="hybrid">Hybrid</option>
                        <option value="cng">CNG</option>
                        <option value="lpg">LPG</option>
                      </select>
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium whitespace-nowrap">
                        Choose Budget range
                      </p>
                      <div className="flex flex-row items-center gap-2">
                        <input
                          required
                          className="border border-gray-500 rounded w-[10rem]"
                          type="number"
                          placeholder="Minimum price"
                          name="min_price"
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.value,
                            }))
                          }
                        />
                        <p className="font-medium">To</p>
                        <input
                          required
                          className="border border-gray-500 rounded w-[10rem] "
                          type="number"
                          placeholder="Maximum price"
                          name="max_price"
                          onChange={(e) =>
                            setPriceRange((prev) => ({
                              ...prev,
                              [e.target.name]: e.target.value,
                            }))
                          }
                        />
                      </div>
                    </div>
                    <Button
                      classItems={'h-10 mt-6'}
                      category={'primarybtn'}
                      clickHandler={filterHandler}
                    >
                      Search
                    </Button>
                  </div>
                  {notFound && (
                    <p className="text-[red] text-sm">
                      *Vehicle Not Found! Please select a valid range
                    </p>
                  )}
                </>
              )}
            </div>
          </div>
          <div className="grid xl:grid-cols-4 lg:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-2 md:gap-4 ">
            {vehiclesList?.map((item) => (
              <ProductCard data={item} key={item.id} link={'/vehicledetails'} />
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Vehicles;
