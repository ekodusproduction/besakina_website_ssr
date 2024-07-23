import React from 'react'
import Navbar from '../Navbar/Navbar'
import Categories from '../Categories/Categories'
import Banner from '../Banner/Banner'
import HappyUsers from '../HappyUsers/HappyUsers'
import PopularSearches from '../PopularSearches/PopularSearches'
import FeaturedAds from '../FeaturedAds/FeaturedAds'
import LatestAds from '../LatestAds/LatestAds'
import SecondaryAd from '../SecondaryAd/SecondaryAd'
import Sponsors from '../Sponsors/Sponsors'
import Footer from '../Footer/Footer'

const Main = () => {
  return (
    
    <div className='max-w-[1500px] m-auto'>
        <Navbar/>
        <Categories/>
        <Banner/>
        <HappyUsers/>
        <PopularSearches/>
        <FeaturedAds/>
        <LatestAds/>
        <SecondaryAd/>
        <Sponsors/>
        <Footer/>
       
    </div>
  )
}

export default Main