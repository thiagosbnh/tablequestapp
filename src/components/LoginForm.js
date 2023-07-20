import React, { useState, useEffect } from 'react';

function LoginForm({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

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
        setMessage('Logged in successfully');
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
          sessionStorage.setItem('userId', userId); // Store the user ID
        } else {
          console.error('Failed to fetch user data');
        }

        onLogin();
      } else {
        // Failed login
        setMessage('Invalid email or password');
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
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <label>Password:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <button type="submit">Login</button>
      </form>
      <p>{message}</p>
    </div>
  );
}

export default LoginForm;
