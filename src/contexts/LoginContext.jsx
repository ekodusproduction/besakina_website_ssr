import React, { createContext, useState, useContext, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode';

// Create a context for the login state
export const LoginContext = createContext();

// Create a provider component to wrap your application with
export const LoginProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(localStorage.getItem('token') !== null);
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isTokenExpired, setIsTokenExpired] = useState(true);

  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   if (token) {
  //     try {
  //       const decodedToken = jwtDecode(token);
  //       const currentTime = Date.now() / 1000;

  //       if (decodedToken.exp < currentTime) {
  //         setIsLoggedIn(false);
  //       }
  //     } catch (error) {
  //       console.error('Error decoding token:', error);
  //     }
  //   }
  // }, []);

  return (
    <LoginContext.Provider value={{ isLoggedIn, setIsLoggedIn }}>
      {children}
    </LoginContext.Provider>
  );
};