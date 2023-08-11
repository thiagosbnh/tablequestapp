import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';

function NavbarUser() {
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
        sessionStorage.removeItem('userName');
        sessionStorage.removeItem('userPhone');
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
    <Navbar expand="lg" className="bg-body-secondary p-3 mb-5">
    <Container>
      <Navbar.Brand href="/home"><img src="./tablequest-blue.png" style={{height:60 , paddingRight:30}}></img></Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="me-auto">
          <Nav.Link href="/booking">New Booking</Nav.Link>
          <Nav.Link href="/bookings">My Bookings</Nav.Link>
          <Nav.Link href="/showgames">See our Boardgames</Nav.Link>
          <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
        </Nav>
      </Navbar.Collapse>
    </Container>
  </Navbar>


  );
}

export default NavbarUser;
