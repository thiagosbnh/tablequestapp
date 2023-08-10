import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form'
import Container from 'react-bootstrap/esm/Container';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';
import Row from 'react-bootstrap/esm/Row'
import Col from 'react-bootstrap/esm/Col'

function SignUpForm() {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');
  const [message, setMessage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const userData = {
      "user": {
        email: email,
        password: password,
        password_confirmation: passwordConfirmation,
        name: fullName,
        phone: phoneNumber
      }
    };

    try {
      const response = await fetch('http://localhost:4000/signup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Encoding': 'gzip, deflate, br',
          'Connection': 'keep-alive',
        },
        body: JSON.stringify(userData),
      });

      if (response.ok) {
        // User creation successful
        setMessage('User created successfully');
        setSuccess(true);
      } else {
        // User creation failed
        setMessage('Failed to create user');
        setSuccess(false);
      }
    } catch (error) {
      console.error(error);
      setMessage('An error occurred');
      setSuccess(false);
    }
  };

  return (
    <><>
      <Container>
        <Row className='d-flex align-items-center justify-content-center'>
          <Col md={10} lg={8} xl={6}>
            <div className='loginbg'>
              <div className="logo-img mt-2 mb-5 d-flex justify-content-center">
                <img src="./tablequest-blue.png" alt="TableQuest logo"></img>
              </div>
              <div className="mb-3 d-flex justify-content-center">
                <h5>Create your account:</h5>
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
                    style={{height:70}} />
                </FloatingLabel>
                <FloatingLabel
                  label="Full Name"
                  className='mb-3'
                >
                  <Form.Control
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder='Name & Surname'
                    style={{height:70}} />
                </FloatingLabel>
                <FloatingLabel
                  label="Phone Number"
                  className='mb-3'
                >
                  <Form.Control
                    type="text"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    placeholder='XXX-XXXX-XXX'
                    style={{height:70}} />
                </FloatingLabel>
                <FloatingLabel
                  label="Password"
                  className='mb-3'
                >
                  <Form.Control
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={{height:70}} />
                </FloatingLabel>
                <FloatingLabel
                  label="Confirm Password"
                  className='mb-3'
                >
                  <Form.Control
                    type="password"
                    value={passwordConfirmation}
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    style={{height:70}} />
                </FloatingLabel>
                <div className="d-grid gap-2">
                  <Button variant='success' type="submit" size="lg" className='mt-3 mb-4' style={{fontWeight:600 , fontSize:24 , padding:15 }}>Create Account</Button>
                </div>    
                <div className="d-flex align-items-center justify-content-center">
                  {message && (
                    <p className={success ? 'success-message' : 'error-message'}>{message}</p>
                  )}
                </div>
              </Form>
            </div>
          </Col>
        </Row>
      </Container>
      
    </>
    <div className="mt-5 d-flex align-items-center justify-content-center">
      <p style={{fontWeight:500 , fontSize:20 , textAlign:'center'}}>
        Already have an account?<br/><Link to="/login">Click here to Login</Link>
      </p>
    </div>
    </>
  );
}

export default SignUpForm;