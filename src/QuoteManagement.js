import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Row, Col } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import './Login.css';
import './QuoteManagement.css';
import './Navbar.css';
import config from './config';
import QuoteEditModal from './QuoteEditModal';
import NavbarComponent from './NavbarComponent';

const QuoteManagement = () => {
  const [quoteText, setQuoteText] = useState('');
  const [secondaryText, setSecondaryText] = useState('');
  const [quoteURL, setQuoteURL] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quoteEdits, setQuoteEdits] = useState(0);
  const [editedQuoteText, setEditedQuoteText] = useState(quoteText);
  const [editedSecondaryText, setEditedSecondaryText] = useState(secondaryText);
  const [editedIsActive, setEditedIsActive] = useState(isActive);
  const [editedQuoteURL, setEditedQuoteURL] = useState('');
  const authData = JSON.parse(localStorage.getItem('authData') || '{}');


  const fetchQuotes = async () => {
    try {
      const response = await fetch(`${authData.instanceUrl}/quote`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });
  
      if (!response.ok) {
        throw new Error(response.statusText);
      }
  
      const data = await response.json();
      setQuotes(data);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [quoteEdits, authData.token]);

  const handleLogout = () => {
    localStorage.removeItem('authData');
    window.location.reload();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${authData.instanceUrl}/quote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          quoteText: quoteText,
          secondaryText: secondaryText,
          url: quoteURL,
          isActive: isActive ? 1 : 0,
        }),
      });

      if (response.ok) {
        setQuoteText('');
        setSecondaryText('');
        setQuoteURL('');
        setIsActive(true);
        fetchQuotes();
      }
    } catch (error) {
      console.error('An error occurred while submitting the quote:', error);
    }
  };

  const handleEdit = async (quote) => {
    setSelectedQuote(quote);

    try {
      const response = await fetch(`${authData.instanceUrl}/quote/${quote.id}`, {
        headers: {
          Authorization: `Bearer ${authData.token}`,
        },
      });

      if (response.ok) {
        const quoteData = await response.json();

        setShowModal(true);
        setEditedQuoteText(quoteData.quoteText);
        setEditedSecondaryText(quoteData.secondaryText);
        setEditedQuoteURL(quoteData.url);
        setEditedIsActive(quoteData.isActive);
      }
    } catch (error) {
      console.error('An error occurred while fetching the quote for editing:', error);
    }
  };

  const handleSave = async (event) => {
    try {
      const response = await fetch(`${authData.instanceUrl}/quote/${selectedQuote.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authData.token}`,
        },
        body: JSON.stringify({
          id: selectedQuote.id,
          quoteText: event.quoteText,
          secondaryText: event.secondaryText,
          url: event.quoteURL,
          isActive: event.isActive,
        }),
      });

      if (response.ok) {
        setShowModal(false);
        setQuoteEdits((prevEdits) => prevEdits + 1);
      }
    } catch (error) {
      console.error('An error occurred while saving the quote:', error);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (quote) => {
    const confirmation = window.confirm('Are you sure you want to delete this quote?');
    if (confirmation) {
      try {
        const response = await fetch(`${authData.instanceUrl}/quote/${quote.id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${authData.token}`,
          },
        });
        if (response.ok) {
          fetchQuotes();
        }
      } catch (error) {
        console.error('An error occurred while deleting the quote:', error);
      }
    }
  };

  const handleRowClick = (params) => {
    setSelectedQuote(params.row);
  };

  const formattedQuotes = quotes.map((quote) => {
    const { creationDate, quoteText, secondaryText, isActive } = quote;
    return {
      id: quote.id,
      quote: {
        creationDate: new Date(creationDate).toISOString(),
        text: quoteText,
        secondaryText: secondaryText,
        isActive: isActive === 0 ? '[Hidden]' : '',
      },
    };
  });

  const columns = [
    {
      field: 'quote',
      headerName: 'Entries',
      flex: 1,
      renderCell: (params) => {
        const { creationDate, text, secondaryText, isActive } = params.row.quote;
        const formattedDate = new Date(creationDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
          hour: 'numeric',
          minute: 'numeric',
          hour12: true,
        });
        return (
          <div className="quote-summary">
            <b>[{formattedDate}] <span className="inactiveColor">{isActive}</span></b> - [{text}] - [{secondaryText}]
          </div>
        );
      },
    },
    {
      field: 'edit',
      headerName: '',
      minWidth: 25,
      maxWidth: 35,
      resizable: false,
      renderCell: (params) => {
        if (selectedQuote && selectedQuote.id === params.row.id) {
          return (
            <button className="quote-action-button" onClick={() => handleEdit(params.row)}>
              <FontAwesomeIcon icon={faEdit} />
            </button>
          );
        }
        return null;
      },
    },
    {
      field: 'delete',
      headerName: '',
      minWidth: 25,
      maxWidth: 35,
      resizable: false,
      renderCell: (params) => {
        if (selectedQuote && selectedQuote.id === params.row.id) {
          return (
            <button className="quote-action-button" onClick={() => handleDelete(params.row)}>
              <FontAwesomeIcon icon={faTrash} />
            </button>
          );
        }
        return null;
      },
    },
  ];

  const navbarButtons = [
    { text: 'Quotes', icon: null, link: '/QuoteManagement' },
    { text: 'Reports', icon: null, link: '/PrintQuoteReport' },
    // Add more buttons as needed
  ];

  return (
    <div className="login-background">
      <NavbarComponent buttons={navbarButtons} onLogout={handleLogout} />
      <Card className="quote-card quote-widget">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={4}
                className="quote-input"
                style={{ borderRadius: '5px' }}
                placeholder="Enter quote text"
                value={quoteText}
                maxLength={250}
                onChange={(e) => setQuoteText(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter secondary text"
                value={secondaryText}
                className="quote-input"
                style={{ borderRadius: '5px' }}
                onChange={(e) => setSecondaryText(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Control
                type="text"
                placeholder="Enter a URL"
                value={quoteURL}
                className="quote-input"
                style={{ borderRadius: '5px' }}
                onChange={(e) => setQuoteURL(e.target.value)}
              />
            </Form.Group>
            <Form.Group>
              <Form.Check
                type="switch"
                id="isActiveSwitch"
                label="Show in App"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
              />
            </Form.Group>
            <Button type="submit" variant="success">
              <FontAwesomeIcon icon={faPlusSquare} /> Submit Quote
            </Button>
          </Form>
        </Card.Body>
      </Card>
      <Container className="quote-management-container">
        <Row>
          <Col className="mx-auto">
            <div className="quote-list">
              <DataGrid
                rows={formattedQuotes}
                columns={columns}
                pageSize={25}
                autoHeight
                disableSelectionOnClick
                onRowClick={handleRowClick}
              />
            </div>
          </Col>
        </Row>
      </Container>
      {showModal && (
        <QuoteEditModal
          quoteText={editedQuoteText ? editedQuoteText : ''}
          secondaryText={editedSecondaryText}
          quoteURL={editedQuoteURL}
          isActive={editedIsActive}
          onCloseModal={handleCloseModal}
          onSave={handleSave}
          config={config}
          fetchQuotes={fetchQuotes}
          setEditedQuoteText={setEditedQuoteText}
          setEditedSecondaryText={setEditedSecondaryText}
          setEditedQuoteURL={setEditedQuoteURL}
        />
      )}
    </div>
  );
};

export default QuoteManagement;
