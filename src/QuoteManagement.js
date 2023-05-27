import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Row, Col, ButtonGroup } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faChartLine, faChartArea, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import './Login.css';
import './QuoteManagement.css';
import config from './config';
import QuoteEditModal from './QuoteEditModal';


const QuoteManagement = () => {
  const [quoteText, setQuoteText] = useState('');
  const [secondaryText, setSecondaryText] = useState('');
  const [QuoteURL, setQuoteURL] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [chartView, setChartView] = useState('Day');
  const [quotePrints, setQuotePrints] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const getDailyLabels = (date) => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) =>
      new Date(date.getFullYear(), date.getMonth(), i + 1).toLocaleString('default', { weekday: 'short' }) + ` ${i + 1}`
    );
  };

  const getMonthlyLabels = (date) => {
    return Array.from({ length: 12 }, (_, i) =>
      new Date(date.getFullYear(), i, 1).toLocaleString('default', { month: 'short' })
    );
  };

  const fetchQuotes = async () => {
    const response = await fetch(`${config.apiUrl}/quote`);
    const data = await response.json();
    setQuotes(data);
  };

  const fetchQuotePrintsData = async (view, year, month) => {
    const endpoint = view === 'Day' ? `printsByDay?year=${year}&month=${month}` : `printsByMonth?year=${year}`;
    const response = await fetch(`${config.apiUrl}/quoteprint/${endpoint}`);
    const printdata = await response.json();

    let formattedData = [];

    if (view === 'Day') {
      formattedData = new Array(31).fill(0);
      printdata.forEach((item) => {
        const day = new Date(item.date).getDate();
        formattedData[day - 1] = item.count;
      });
    } else {
      formattedData = new Array(12).fill(0);
      printdata.forEach((item) => {
        const month = new Date(item.date).getMonth();
        formattedData[month] = item.count;
      });
    }

    setQuotePrints(formattedData);
  };

  useEffect(() => {
    fetchQuotes();
  }, []);

  useEffect(() => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth() + 1;
    fetchQuotePrintsData(chartView, year, month);
  }, [chartView, selectedDate]);

  const graphData = {
    labels: chartView === 'Day' ? getDailyLabels(selectedDate) : getMonthlyLabels(selectedDate),
    datasets: [
      {
        label: chartView === 'Day' ? 'Prints per Day' : 'Prints per Month',
        data: quotePrints,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  };

  useEffect(() => {
    // Clear form input fields when modal closes
    if (!showModal) {
      setQuoteText('');
      setSecondaryText('');
      setQuoteURL('');
    }
  }, [showModal]);

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
        Url: QuoteURL,
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
  
    setQuoteText(quoteData.quoteText);
    setSecondaryText(quoteData.secondaryText);
    setQuoteURL(quoteData.url); // Update the variable name to lowercase 'l'
  
    setShowModal(true);
  };
  
  const handleSave = async () => {
    const response = await fetch(`${config.apiUrl}/quote/${selectedQuote.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        quoteText: quoteText,
        secondaryText: secondaryText,
        url: QuoteURL,
      }),
    });

    if (response.ok) {
      fetchQuotes();
      setShowModal(false);
    }
  };

  const handleCloseModal = () => {
    // Close the modal
    setShowModal(false);
  };

  const handleDelete = (quote) => {
    // Handle delete functionality
  };

  const handleRowClick = (params) => {
    setSelectedQuote(params.row);
  };

  const formattedQuotes = quotes.map((quote, index) => {
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

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
      x: {
        type: 'category',
      },
    },
  };

  const chartLabels =
    chartView === 'Day' && selectedDate
      ? getDailyLabels(selectedDate)
      : chartView === 'Month' && selectedDate
      ? getMonthlyLabels(selectedDate)
      : [];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const years = Array.from({ length: currentYear - 2021 + 1 }, (_, i) => 2024 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(currentYear, i, 1).toLocaleString('default', { month: 'long' }),
  }));

  const columns = [
    {
      field: 'quote',
      headerName: 'Quote',
      flex: 1,
      renderCell: (params) => {
        const { creationDate, text, secondaryText } = params.row.quote;
        const formattedDate = new Date(creationDate).toLocaleDateString('en-US', {
          year: 'numeric',
          month: '2-digit',
          day: '2-digit',
        });
        const spacePadding =
          (text + formattedDate + secondaryText).length > 100
            ? ' '.repeat(50)
            : ' '.repeat(220 - (text + formattedDate + secondaryText).length);
  
        return (
          <div className="quote-summary">
            [{formattedDate}] - [{text}] - [{secondaryText}]
          </div>
        );
      },
    },
    {
      field: 'edit',
      headerName: '',
      minWidth: 20,
      maxWidth: 30,
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
      minWidth: 20,
      maxWidth: 30,
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

  return (
    <div className="login-background">
      <Card className="quote-card quote-widget">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group>
              <Form.Control
                as="textarea"
                rows={3}
                className="quote-input"
                style={{ height: '82px', width:'328px', borderRadius: '5px' }}
                placeholder="Enter quote text"
                value={quoteText}
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
                value={QuoteURL}
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
                pageSize={4}
                autoHeight
                disableSelectionOnClick
                onRowClick={handleRowClick}
              />
            </div>
          </Col>
        </Row>
        <Row>
          <Col className="mx-auto">
            <Card className="quote-card quote-widget" style={{ maxWidth: 740 }}>
              <Card.Header className="quote-header">
                <ButtonGroup className="mb-3">
                  <Button
                    variant="outline-primary"
                    onClick={() => setChartView('Day')}
                    active={chartView === 'Day'}
                    style={{ fontSize: '0.8rem', marginRight: '1rem' }}
                  >
                    <FontAwesomeIcon icon={faChartLine} /> Daily
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => setChartView('Month')}
                    active={chartView === 'Month'}
                    style={{ fontSize: '0.8rem' }}
                  >
                    <FontAwesomeIcon icon={faChartArea} /> Monthly
                  </Button>
                </ButtonGroup>
                {chartView === 'Day' && (
                  <div className="month-select">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                      }}
                      dateFormat="MMMM yyyy"
                      showMonthYearPicker
                      className="form-control"
                    />
                  </div>
                )}
                {chartView === 'Month' && (
                  <div className="year-select">
                    <DatePicker
                      selected={selectedDate}
                      onChange={(date) => {
                        setSelectedDate(date);
                      }}
                      dateFormat="yyyy"
                      showYearPicker
                      className="form-control"
                    />
                  </div>
                )}
              </Card.Header>
              <Card.Body>
                <div className="quote-chart" style={{ opacity: '0.8' }}>
                  <Line data={graphData} options={options} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
      {showModal && (
        <QuoteEditModal
          quoteText={quoteText}
          secondaryText={secondaryText}
          quoteURL={QuoteURL} // Update the prop name to uppercase 'Q'
          onCloseModal={handleCloseModal}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default QuoteManagement;
