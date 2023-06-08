import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate } from 'react-router-dom';
import Login from './Login';
import QuoteManagement from './QuoteManagement';
import PrintQuoteReport from './PrintQuoteReport';

function App() {
  const storedAuthData = localStorage.getItem('authData');
  const initialAuthData = storedAuthData ? JSON.parse(storedAuthData) : false;
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthData);
  const navigate = useNavigate(); // Create a navigate function using useNavigate

  const handleAuthentication = (response) => {
    setIsAuthenticated(response);
    if (response) {
      localStorage.setItem('authData', JSON.stringify(response));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authData');
    navigate('/Login'); // Use navigate function to go to the login page
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/PrintQuoteReport" element={<PrintQuoteReport />} />
          <Route
            path="/QuoteManagement"
            element={isAuthenticated ? <QuoteManagement onLogout={handleLogout} /> : <Navigate to="/Login" replace />}
          />
          <Route
            path="/Login"
            element={isAuthenticated ? <Navigate to="/QuoteManagement" /> : <Login onAuthentication={handleAuthentication} />}
          />
          <Route
            path="/"
            element={isAuthenticated ? <QuoteManagement onLogout={handleLogout} /> : <Navigate to="/Login" replace />}
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
