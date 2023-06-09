import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Login';
import QuoteManagement from './QuoteManagement';
import PrintQuoteReport from './PrintQuoteReport';

function App() {
  const storedAuthData = localStorage.getItem('authData');
  const initialAuthData = storedAuthData ? JSON.parse(storedAuthData) : false;
  const [isAuthenticated, setIsAuthenticated] = useState(initialAuthData);

  const handleAuthentication = (response) => {
    setIsAuthenticated(response);
    if (response) {
      localStorage.setItem('authData', JSON.stringify(response));
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('authData');
    return <Navigate to="/Login" replace />;
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/PrintQuoteReport" 
                 element={isAuthenticated ? <PrintQuoteReport onLogout={handleLogout} /> : <Navigate to="/Login" replace />} />
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