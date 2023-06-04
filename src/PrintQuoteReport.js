import React, { useState, useEffect } from 'react';
import { Card } from 'react-bootstrap';
import { Line } from 'react-chartjs-2';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import config from './config';


const PrintQuoteReport = () => {
  const [chartView, setChartView] = useState('Day');
  const [quotePrints, setQuotePrints] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());

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

  return (
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
  );
};

export default PrintQuoteReport;