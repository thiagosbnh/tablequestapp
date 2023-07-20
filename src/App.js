import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import BookingForm from './components/BookingForm';
// import Bookings from './components/Bookings';
import Home from './components/Home';
import UserBookings from './components/UserBookings';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform login logic, set loggedIn state to true
    setLoggedIn(true);
    // Redirect to Home after login
    navigate('/home');
  };

  const handleLogout = () => {
    // Perform logout logic, set loggedIn state to false
    setLoggedIn(false);
    // Redirect to Login after logout
    navigate('/login');
  };

  return (
    <>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<LoginForm onLogin={handleLogin} />} />
        <Route path="/home" element={<Home />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/bookings" element={<UserBookings />} />
      </Routes>
    </>
  );
}

export default App;