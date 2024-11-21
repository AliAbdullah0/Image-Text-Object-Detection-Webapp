import React from 'react';
import Navigation from './components/Navigation';
import { Outlet } from 'react-router-dom';
import Footer from './components/Footer';


function Layout() {
  
  return (
    <>
      <Navigation/>
      <Outlet/>
      <Footer/>
    </>
  );
}

export default Layout;
