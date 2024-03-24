import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../authContext';
import Navbar from './Navbar';
import Navigation from './Navigation';
import '../styles/Header.css';

function Header() {
  const { isLoggedIn } = useContext(AuthContext);
  const [showNavigation, setShowNavigation] = useState(false);

  useEffect(() => {
    if (!isLoggedIn) {
      setShowNavigation(false);
    } else {
      setShowNavigation(true);
    }
  }, [isLoggedIn]);

  return (
    <header>
      <img src='/images/logo.png' alt='logo CERT' />
      <Navbar />
      {showNavigation ? <Navigation /> : null}
    </header>
  )
}

export default Header;