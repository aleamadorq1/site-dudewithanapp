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
  const [quotes, setQuotes] = useState([]);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [quoteEdits, setQuoteEdits] = useState(0);
  const [editedQuoteText, setEditedQuoteText] = useState(quoteText);
  const [editedSecondaryText, setEditedSecondaryText] = useState(secondaryText);
  const [editedQuoteURL, setEditedQuoteURL] = useState('');

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

  const fetchQuotes = async () => {
    try {
      const data = await fetchWithRetries(`${config.apiUrl}/quote`);
      setQuotes(data);
    } catch (error) {
      console.error('Failed to fetch quotes:', error);
    }
  };

  useEffect(() => {
    fetchQuotes();
  }, [quoteEdits]);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const response = await fetch(`${config.apiUrl}/quote`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteText: quoteText,
        secondaryText: secondaryText,
        url: quoteURL,
      }),
    });

    if (response.ok) {
      setQuoteText('');
      setSecondaryText('');
      setQuoteURL('');
      fetchQuotes();
    }
  };

  const handleEdit = async (quote) => {
    setSelectedQuote(quote);

    const response = await fetch(`${config.apiUrl}/quote/${quote.id}`);
    const quoteData = await response.json();

    setShowModal(true);
    setEditedQuoteText(quoteData.quoteText);
    setEditedSecondaryText(quoteData.secondaryText);
    setEditedQuoteURL(quoteData.url);
  };

  const handleSave = async (event) => {
    const response = await fetch(`${config.apiUrl}/quote/${selectedQuote.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        id: selectedQuote.id,
        quoteText: event.quoteText,
        secondaryText: event.secondaryText,
        url: event.quoteURL,
      }),
    });

    if (response.ok) {
      setShowModal(false);
      setQuoteEdits((prevEdits) => prevEdits + 1);
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleDelete = async (quote) => {
    const confirmation = window.confirm('Are you sure you want to delete this quote?');
    if (confirmation) {
      const response = await fetch(`${config.apiUrl}/quote/${quote.id}`, {
        method: 'DELETE',
      });
      if (response.ok) {
        fetchQuotes();
      }
    }
  };

  const handleRowClick = (params) => {
    setSelectedQuote(params.row);
  };

  const formattedQuotes = quotes.map((quote) => {
    const { creationDate, quoteText, secondaryText } = quote;
    return {
      id: quote.id,
      quote: {
        creationDate: new Date(creationDate).toISOString(),
        text: quoteText,
        secondaryText: secondaryText,
      },
    };
  });

  const columns = [
    {
      field: 'quote',
      headerName: 'Entries',
      flex: 1,
      renderCell: (params) => {
        const { creationDate, text, secondaryText } = params.row.quote;
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
            <b>[{formattedDate}]</b> - [{text}] - [{secondaryText}]
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
    { text: 'Quotes', icon: null, link:"/QuoteManagement" },
    { text: 'Reports', icon: null, link: "/PrintQuoteReport" },
    { text: 'Log Out', icon: null },
    // Add more buttons as needed
  ];

  return (
    <div className="login-background">
      <NavbarComponent buttons={navbarButtons}/>
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
