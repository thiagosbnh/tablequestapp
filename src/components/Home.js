import React from 'react';
import NavbarUser from './NavbarUser'
import Container from 'react-bootstrap/esm/Container'
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import { Link } from 'react-router-dom';

function Home() {  

  return (
    <>
      <NavbarUser/>
    <Container>
      <div className='mb-5'>
        <h1>Welcome, {sessionStorage.getItem("userName")}!</h1>
      </div>
      
    <Row>
      <Col lg={6}>
        <div>
          <form style={{ width: "100%" }}>
						<Link to="/booking">
							<button className="booking-button">
								Make a Booking
							</button>
						</Link>
						
					</form>
        </div>
      </Col>
      <Col lg={6}>
        <div>
          <form style={{ width: "100%" }}>
						<Link to="/bookings">
							<button className="mybookings-button">
								Manage your Bookings
							</button>
						</Link>
						
					</form>
        </div>
      </Col>
    </Row>

    </Container>
    </>
  )
}

export default Home
