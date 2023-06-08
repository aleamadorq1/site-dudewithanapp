import React from 'react';
import { Navbar, Nav } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSignature } from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom'; // Import the Link component

const NavbarComponent = ({ buttons, onLogout  }) => {
    const handleLogout = () => {
        onLogout(); // Call the logout function from props
    };


  return (
    <Navbar bg="transparent" expand="lg" variant="light" className="navbar-transparent">
      <Navbar.Brand className="navbar-icon navbar-transparent">
        <FontAwesomeIcon icon={faSignature} />
      </Navbar.Brand>
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="ml-auto">
          {buttons.map((button, index) => (
            <Link key={index} to={button.link} className="navbar-button">
              {button.icon && <FontAwesomeIcon icon={button.icon} />}
              {button.text}
            </Link>
          ))}
          <button className="navbar-button" onClick={handleLogout}>
            Logout
          </button>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
