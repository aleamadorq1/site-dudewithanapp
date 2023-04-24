import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import './Login.css'; // import the custom stylesheet

const Login = ({ onAuthentication }) => { // Change this line to onAuthentication
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetch('https://dudewithanapp.site/api/Login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });
  
      if (response.ok) {
        console.log('Response status:', response.status);
        const text = await response.text();
        console.log('Response text:', text);
        const data = JSON.parse(text);
        console.log(data);
        console.log('Calling onAuthentication');
        onAuthentication(true); // Call onAuthentication instead of handleSubmit
      } else {
        setErrorMessage('Invalid email or password');
      }
    } catch (error) {
      setErrorMessage('An error occurred while processing your request');
      console.log(error);
    }
  };

  return (
    <div className="login-background">
      <div className="login-widget">
        <h2>Login</h2>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Control type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          </Form.Group>

          <Form.Group controlId="formBasicPassword">
            <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          </Form.Group>

          <Button variant="primary" type="submit">
            Submit
          </Button>
          {errorMessage && <Alert variant="danger">{errorMessage}</Alert>}
        </Form>
      </div>
    </div>
  );
};

export default Login;
