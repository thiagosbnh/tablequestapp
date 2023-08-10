import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/esm/Container';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'
import Offcanvas from 'react-bootstrap/Offcanvas';
import Alert from 'react-bootstrap/Alert'
import axios from 'axios';

const API_BOARDGAMES_URL = "http://localhost:4000/boardgames";

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [show, setShow] = useState(false);
  const [boardgames, setBoardgames] = useState([]);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  useEffect(() => {
    fetchBoardgames();
  }, []);

  const fetchBoardgames = async () => {
    try {
      const response = await axios.get(API_BOARDGAMES_URL);
      setBoardgames(response.data);
    } catch (error) {
      console.error(error);
      // Handle error if needed
    }
  };

  // Sort the boardgames array based on title in alphabetical order
  const sortedBoardgames = boardgames.slice().sort((a, b) => a.title.localeCompare(b.title));

  useEffect(() => {
    checkLoginStatus();
  }, []);

  const checkLoginStatus = () => {
    // Check if the user is already logged in (e.g., token or session exists)
    const isLoggedIn = sessionStorage.getItem('isLoggedIn');

    if (isLoggedIn === 'true') {
      // User is logged in, trigger the onLogin function
      onLogin();
    }
  };

  const handleLogin = async () => {
    const loginData = {
      user: {
        email: email,
        password: password,
      },
    };

    try {
      const response = await fetch('http://localhost:4000/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginData),
      });

      if (response.ok) {
        // Successful login
        const authToken = response.headers.get('Authorization'); // Retrieve the authorization header
        sessionStorage.setItem('isLoggedIn', 'true'); // Store login status
        sessionStorage.setItem('authToken', authToken); // Store the authorization header

        // Retrieve user ID
        const userResponse = await fetch('http://localhost:4000/current_user', {
          headers: {
            'Authorization': authToken,
          },
        });

        if (userResponse.ok) {
          const userData = await userResponse.json();
          const userId = userData.id;
          const userName = userData.name;
          const userPhone = userData.phone;
          sessionStorage.setItem('userId', userId); // Store the user's ID
          sessionStorage.setItem('userName', userName); // Store the user's Name
          sessionStorage.setItem('userPhone', userPhone); // Store the user's Phone
        } else {
          console.error('Failed to fetch user data');
        }

        onLogin();
      } else {
        // Failed login
        setMessage(<Alert variant='warning'>Invalid email or password</Alert>);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleLogin();
  };

  return (
    <Container>
      <Row className='d-flex align-items-center justify-content-center'>
        <Col md={10} lg={8} xl={6} >
          <div className="loginbg">
            <div className="pub-logo-img mt-4 mb-5 d-flex justify-content-center">
              <img src="./GAMINGLOUNGE-WHITE.png" alt="Pub logo"></img>
            </div>
            <div className="logo-img mt-2 mb-5 d-flex justify-content-center">
              <img src="./tablequest-blue.png" alt="TableQuest logo"></img>
            </div>
            <div className="mb-3 d-flex justify-content-center">
              <h5>Enter your details to login:</h5>
            </div>
            <Form onSubmit={handleSubmit}>
                <FloatingLabel
                  label="Email address"
                  className='mb-3'
                >            
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder='name@email.com'
                    style={{height:70}}
                  />
                </FloatingLabel>
                <FloatingLabel
                  label="Password"
                  className='mb-3'
                >
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder='Password'
                    style={{height:70}}
                  />
                </FloatingLabel>
              <div className="d-grid gap-2">
                <Button type="submit" size="lg" className='mt-3 mb-4' style={{fontWeight:600 , fontSize:24 , padding:15 }}>Login</Button>
              </div>
              <div className="d-flex align-items-center justify-content-center">
                {message}
              </div>
            </Form>
          </div>
        </Col>
      </Row>
      <div className="mt-4 d-flex align-items-center justify-content-center">
        <p>
          Don't have an account?<br/>
          <div className="mt-1 d-flex align-items-center justify-content-center">
            <Button href="/signup" size="md" variant='outline-success' style={{fontWeight:700 , fontSize:18 , padding:10 }}>Sign Up</Button>
          </div>
        </p>
      </div>
      <div className="mt-4 d-flex align-items-center justify-content-center" >
        <Button size="sm" variant='outline-info' style={{fontWeight:600 , fontSize:16 , padding:10 }} onClick={handleShow}>See our list of boardgames</Button>
      </div>
      <Offcanvas show={show} onHide={handleClose} placement='end'>
        <Offcanvas.Header closeButton>
          <Offcanvas.Title>Our list of Boardgames</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
          {sortedBoardgames.map((boardgame) => (
              <p key={boardgame.id}>
                {boardgame.title}
              </p>
            ))}
        </Offcanvas.Body>
      </Offcanvas>
    </Container>
    
  );
}

export default LoginForm;
