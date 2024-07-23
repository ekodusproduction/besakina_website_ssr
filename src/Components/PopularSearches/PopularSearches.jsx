import React from 'react'
import SearchCard from '../Cards/SearchCard'
import propertyimg from '/assets/properties.jpg'
import vehicleimg from '/assets/vehicles.jpg'
import hospitalityimg from '/assets/hospitality.jpg'
import educationimg from '/assets/education.jpg'

const searchCardItems = [
  {
    image: propertyimg,
    title: 'Properties',
    link: '/properties'
  },
  {
    image: educationimg,
    title: 'Education',
    link: '/education'
  },
  {
    image: vehicleimg,
    title: 'Vehicles',
    link: '/vehicles'
  },
  {
    image: hospitalityimg,
    title: 'Hospitality',
    link: '/hospitality'
  },
  {
    image: propertyimg,
    title: 'Properties',
    link: '/properties'
  }
]

const PopularSearches = () => {
  return (
    <section className='lg:px-12 px-4 mb-8'>
        <h2 className='sm:font-bold text-xl font-semibold sm:text-2xl mb-2 sm:mb-4'>Popular Searches</h2>
        <div className='grid xl:grid-cols-5 lg:grid-cols-4 md:grid-cols-3 grid-cols-2 gap-2  md:gap-4'>
            {/* <SearchCard image={propertyimg} title='Properties' link='/properties'/>
            <SearchCard image={educationimg} title='Education' link='/education'/>
            <SearchCard image={vehicleimg} title='Vehicles' link='/vehicles'/>
            <SearchCard image={hospitalityimg} title='Hospitality' link='/hospitality'/>
            <SearchCard image={propertyimg} title='Properties' link='/properties'/> */}
            {searchCardItems.map((item,index)=> (
              <SearchCard image={item.image} title={item.title} link={item.link} key={index}/>
            ))}
            
        </div>
    </section>
  )
}

export default PopularSearches