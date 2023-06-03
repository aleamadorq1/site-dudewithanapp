import React, { useState } from 'react';
import { Button, Form, Alert } from 'react-bootstrap';
import './Login.css'; // import the custom stylesheet
import config from './config';

const MAX_RETRIES = 10;
const RETRY_DELAY_MS = 1000;

const fetchWithRetries = async (url, options = {}, retries = 0) => {
  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    if (retries < MAX_RETRIES) {
      await new Promise((resolve) => setTimeout(resolve, RETRY_DELAY_MS));
      return fetchWithRetries(url, options, retries + 1);
    }
    throw new Error(`Exceeded maximum retries (${MAX_RETRIES}).`);
  }
};

const Login = ({ onAuthentication }) => { // Change this line to onAuthentication
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await fetchWithRetries(`${config.apiUrl}/Login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (response.message = 'Sucess') {
        onAuthentication(true);
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
