import React, { createContext, useState } from 'react';

export const DataContext = createContext();

export const DataProvider = ({ children }) => {
  const [storeData, setStoreData] = useState([]);
  const [storeImages,setStoreImages] = useState([]);

  const updateData = (newData) => {
    setStoreData(newData);
  };

  const saveImages = (newData) =>{
    setStoreImages(newData)
  }

  return (
    <DataContext.Provider value={{ storeData, updateData }}>
      {children}
    </DataContext.Provider>
  );
};
