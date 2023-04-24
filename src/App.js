import React, { useState } from 'react';
import Login from './Login';
import QuoteManagement from './QuoteManagement';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleAuthentication = (isAuth) => {
    setIsAuthenticated(isAuth);
  };

  return (
    <div className="App">
      {isAuthenticated ? (
        <QuoteManagement />
      ) : (
        <Login onAuthentication={handleAuthentication} />
      )}
    </div>
  );
}

export default App;
