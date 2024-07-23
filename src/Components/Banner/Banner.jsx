import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/react-splide/css/skyblue';
import Button from '../Button/Button';
import { useNavigate } from 'react-router-dom';
import { BannerImages } from '../../data/bannerImages';

const Banner = () => {
  const navigate = useNavigate();
  const options = {
    type: 'loop',
    autoplay: true,
    interval: 2000,
    pauseOnHover: false,
    resetProgress: false,
  };

  return (
    <>
      <section className="flex flex-col lg:flex-row items-center justify-center px-2 sm:px-4 lg:px-12 gap-2 md:gap-8 max-w-[1500px] mb-8">
        <div className="w-5/5 lg:w-3/5 flex-2 ">
          <Splide aria-label="Banner" options={options}>
            <SplideSlide>
              <div className="relative">
                <img
                  src="/assets/Banner/carousel_banner.png"
                  className="w-[100%] rounded-3xl"
                  alt="Image 1"
                />
                <div className="absolute top-[50%] left-[2rem] translate-y-[-50%]">
                  <h2 className="text-white font-bold sm:text-4xl text-xl primaryheader">
                    Let us help you <br /> Find, Buy & Sell your <br /> Products
                    and services
                  </h2>
                  <p className="text-white text-xs xsm:text-sm pt-2 sm:pt-4">
                    Most loved and trusted classified ad listing <br /> website.
                    Browse thousand of items near you.
                  </p>
                  <div className="flex gap-4 mt-2 sm:mt-4">
                    <Button category={'primarybtn'}>List Your Business</Button>
                    <Button category={'secondbtn'}>Ask our Expert</Button>
                  </div>
                </div>
              </div>
            </SplideSlide>
            {BannerImages?.map((item, index) => (
              <SplideSlide key={index}>
                <div className="relative">
                  <img
                    src={item.image_path}
                    className="w-[100%] rounded-3xl"
                    alt="Image 1"
                  />
                </div>
              </SplideSlide>
            ))}
          </Splide>
        </div>

        <div className="lg:w-2/5 w-5/5 flex-1 flex md:flex-row flex-col justify-center lg:flex-col gap-2 md:gap-4">
          <div className="relative">
            <img
              src="/assets/Banner/side_banner_two.png"
              className="lg:w-[100%] md:w-[100%] w-[95vw]"
              alt=""
            />
            <div className="absolute top-[50%] left-[2rem] translate-y-[-50%]">
              <h2 className="text-white font-bold sm:text-2xl text-xl w-[70%] mb-2 primaryheader">
                Have a business ? Start selling with us.
              </h2>
              <Button category={'primarybtn'}>Register Now</Button>
            </div>
          </div>
          <div className="relative">
            <img
              src="/assets/Banner/side_banner_one.png"
              className="lg:w-[100%] md:w-[100%] w-[95vw]"
              alt=""
            />
            <div className="absolute top-[50%] left-[2rem] translate-y-[-50%]">
              <h2 className="text-black font-bold sm:text-2xl text-xl w-[70%] mb-2 primaryheader">
                Want to grow your business 10X Faster?
              </h2>
              <Button
                clickHandler={() => navigate('/postad')}
                category={'primarybtn'}
              >
                Post an Ad
              </Button>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Banner;
