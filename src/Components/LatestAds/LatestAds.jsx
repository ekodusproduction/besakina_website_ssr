import React, { useState, useEffect } from "react";
import ProductCard from "../Cards/ProductCard";
import Button from "../Button/Button";
import axiosInstance from "../../api/axiosInstance";
import { baseURL } from "../../api/axiosInstance";
import HospitalCard from "../Cards/HospitalCard";

const LatestAds = () => {
  const [latestData, setLatestData] = useState([]);
  const [visibleCards, setVisibleCards] = useState(12);

  useEffect(() => {
    axiosInstance
      .get(`api/home/latest`)
      .then((response) => {
        console.log(response);
        const data = response.data.data.advertisements;
        console.log(data);
        setLatestData(data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const handleLoadMore = () => {
    setVisibleCards((prevVisibleCards) => prevVisibleCards + 8);
  };

  return (
    <section className="lg:px-12 px-4 mb-8">
      <h2 className="sm:font-bold text-xl font-semibold sm:text-2xl mb-2 sm:mb-4">
        Latest Ads
      </h2>
      <div className="grid xl:grid-cols-4 lg:grid-cols-3 grid-cols-2 gap-2 md:gap-4">
        {latestData?.slice(0, visibleCards).map((item,index) => (
          <div key={index}>
            {item.advType == "Property" && (
              <ProductCard
                data={item}
                key={item.id}
                link={"/propertiesdetails"}
              />
            )}
            {item.advType == "Vehicle" && (
              <ProductCard data={item} key={item.id} link={"/vehicledetails"} />
            )}
            {item.advType == "Education" && (
              <ProductCard
                data={item}
                key={item.id}
                link={"/educationdetails"}
              />
            )}
            {item.advType == "Hospitality" && (
              <ProductCard
                data={item}
                key={item.id}
                link={"/hospitalitydetails"}
              />
            )}
            {item?.advType =="Doctor" && (
                <ProductCard
                  data={item}
                  key={item.id}
                  link={"/doctordetails"}
                />
              )}
              {item?.advType == "Hospital" &&
                    <HospitalCard data={item} key={item.id} link={"/hospitaldetails"} />
                }
          </div>
        ))}
        {/* // <ProductCard/>
            // <ProductCard/>
            // <ProductCard/>
            // <ProductCard/>
            // <ProductCard/>
            // <ProductCard/>
            // <ProductCard/>
            // <ProductCard/>
            // <ProductCard/>
            // <ProductCard/>
            // <ProductCard/>
            // <ProductCard/> */}
      </div>
      {visibleCards < latestData.length && (
        <div className="flex justify-center mt-6">
          <Button clickHandler={handleLoadMore} category={"primarybtn"}>
            Load More
          </Button>
        </div>
      )}
    </section>
  );
};

export default LatestAds;
