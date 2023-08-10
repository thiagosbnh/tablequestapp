import React, { useState } from 'react';
import { Routes, Route, useNavigate, Navigate } from 'react-router-dom';
import LoginForm from './components/LoginForm';
import BookingForm from './components/BookingForm';
import Home from './components/Home';
import UserBookings from './components/UserBookings';
import AdminBookings from './components/AdminBookings';
import ManageGames from './components/ManageGames';
import ManageTables from './components/ManageTables';
import Dashboard from './components/Dashboard';
import SignUpForm from './components/SignUpForm';
import ViewBoardgames from './components/ViewBoardgames';

function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const navigate = useNavigate();

  const handleLogin = () => {
    // Perform login logic, set loggedIn state to true
    setLoggedIn(true);

    // Get the user ID from sessionStorage
    const userId = sessionStorage.getItem('userId');

    // Redirect based on user ID
    if (userId === '1') {
      navigate('/dashboard');
    } else {
      navigate('/home');
    }
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
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/home" element={<Home />} />
        <Route path="/booking" element={<BookingForm />} />
        <Route path="/bookings" element={<UserBookings />} />
        <Route path="/showgames" element={<ViewBoardgames />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/manage_bookings" element={<AdminBookings />} />
        <Route path="/manage_games" element={<ManageGames />} />
        <Route path="/manage_tables" element={<ManageTables />} />
      </Routes>
    </>
  );
}

export default App;
