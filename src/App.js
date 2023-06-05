import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './Login';
import QuoteManagement from './QuoteManagement';
import PrintQuoteReport from './PrintQuoteReport';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = (isAuth) => {
    setIsAuthenticated(isAuth);
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/PrintQuoteReport" element={<PrintQuoteReport />} />
          <Route path="/QuoteManagement" element={<QuoteManagement />} />
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <QuoteManagement />
              ) : (
                <Login onAuthentication={handleAuthentication} />
              )
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
