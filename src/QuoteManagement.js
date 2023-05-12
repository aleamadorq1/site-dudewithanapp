import React, { useState, useEffect } from 'react';
import { Card, Form, Button, Container, Row, Col, ButtonGroup } from 'react-bootstrap';
import { DataGrid } from '@mui/x-data-grid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare, faChartLine, faChartArea, faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Line } from 'react-chartjs-2';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './Login.css'; // Reuse the styles from Login.css
import './QuoteManagement.css';
import config from './config';

const QuoteManagement = () => {
  const [quoteText, setQuoteText] = useState('');
  const [secondaryText, setSecondaryText] = useState('');
  const [QuoteURL, setQuoteURL] = useState('');
  const [quotes, setQuotes] = useState([]);
  const [chartView, setChartView] = useState('Day');
  const [quotePrints, setQuotePrints] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const getDailyLabels = (date) => {
    const daysInMonth = new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    return Array.from({ length: daysInMonth }, (_, i) => new Date(date.getFullYear(), date.getMonth(), i + 1).toLocaleString('default', { weekday: 'short' }) + ` ${i + 1}`);
  };

  const getMonthlyLabels = (date) => {
    return Array.from({ length: 12 }, (_, i) => new Date(date.getFullYear(), i, 1).toLocaleString('default', { month: 'short' }));
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
        backgroundColor: "rgba(75,192,192,0.4)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
      },
    ],
  };
  
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
        Url: QuoteURL
      }),
    });
  
    if (response.ok) {
      setQuoteText('');
      setSecondaryText('');
      setQuoteURL('');
      fetchQuotes();
    }
  };

  const columns = [
    { field: 'creationDate', headerName: 'Creation Date', width: 150 },
    { field: 'text', headerName: 'Quote', width: 600, flex: 1 },
  ];
  
  const formattedQuotes = quotes.map((quote, index) => {
    const date = new Date(quote.creationDate);
    const formattedDate = date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    return {
      id: quote.id,
      text: quote.quoteText,
      creationDate: formattedDate,
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
  const chartLabels = (chartView === "Day" && selectedDate) ? getDailyLabels(selectedDate) : (chartView === "Month" && selectedDate) ? getMonthlyLabels(selectedDate) : [];

  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().getMonth() + 1;
  const years = Array.from({ length: currentYear - 2021 + 1 }, (_, i) => 2024 + i);
  const months = Array.from({ length: 12 }, (_, i) => ({
    value: i + 1,
    label: new Date(currentYear, i, 1).toLocaleString('default', { month: 'long' }),
  }));
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
            style={{ width: "100%", borderRadius: "5px" }} // add border-radius property
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
            style={{ borderRadius: "5px" }} // add border-radius property
            onChange={(e) => setSecondaryText(e.target.value)}
          />
        </Form.Group>

        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Enter a URL"
            value={QuoteURL}
            className="quote-input"
            style={{ borderRadius: "5px" }} // add border-radius property
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
                pageSize={5}
                autoHeight
                disableSelectionOnClick
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
                    onClick={() => setChartView("Day")}
                    active={chartView === "Day"}
                    style={{ fontSize: "0.8rem", marginRight: "1rem" }}
                  >
                    <FontAwesomeIcon icon={faChartLine} /> Daily
                  </Button>
                  <Button
                    variant="outline-primary"
                    onClick={() => setChartView("Month")}
                    active={chartView === "Month"}
                    style={{ fontSize: "0.8rem" }}
                  >
                    <FontAwesomeIcon icon={faChartArea} /> Monthly
                  </Button>
                </ButtonGroup>
                {
                chartView === "Day" && (
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
                {chartView === "Month" && (
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
                <div className="quote-chart" style={{ opacity: "0.8" }}>
                  <Line data={graphData} options={options} />
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
  
}

export default QuoteManagement;
