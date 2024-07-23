import React from 'react';
import Navbar from '../Components/Navbar/Navbar';
import Categories from '../Components/Categories/Categories';
import Banner from '../Components/Banner/Banner';
import HappyUsers from '../Components/HappyUsers/HappyUsers';
import PopularSearches from '../Components/PopularSearches/PopularSearches';
import FeaturedAds from '../Components/FeaturedAds/FeaturedAds';
import LatestAds from '../Components/LatestAds/LatestAds';
import SecondaryAd from '../Components/SecondaryAd/SecondaryAd';
import Sponsors from '../Components/Sponsors/Sponsors';
import Footer from '../Components/Footer/Footer';
import SaveButton from '../Components/SaveButton/SaveButton';

const Home = () => {
  return (
    <div className="max-w-[1500px] m-auto">
      <Categories />
      <Banner />
      <HappyUsers />
      {/* <PopularSearches/> */}
      <FeaturedAds />
      <LatestAds />
      {/* <SecondaryAd /> */}
      {/* <Sponsors/> */}
      {/* <SaveButton/> */}
    </div>
  );
};

export default Home;
