import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

function AdminNavbar() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const authToken = sessionStorage.getItem('authToken');
    const headers = {
      Authorization: authToken,
    };


    try {
      const response = await fetch('http://localhost:4000/logout', {
        method: 'DELETE',
        headers: headers,
      });

      if (response.ok) {
        // Clear the stored tokens and navigate to the login page
        sessionStorage.removeItem('authToken');
        sessionStorage.removeItem('userId');
        sessionStorage.setItem('isLoggedIn', 'false');
        navigate('/login'); // Navigate to the login page
      } else {
        console.log('delete:',authToken);
      }
    } catch (error) {
      console.error(error);
      // Handle logout error if needed
    }
  };

  return (
    <nav>
      <ul>
        <li>
          <Link to="/manage_bookings">Manage Bookings</Link>
        </li>
        <li>
          <Link to="/manage_games">Manage Boardgames</Link>
        </li>
        <li>
          <Link to="/manage_tables">Manage Tables</Link>
        </li>
        <li>
          <button onClick={handleLogout}>Logout</button>
        </li>
      </ul>
    </nav>
  );
}

export default AdminNavbar;