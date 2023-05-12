import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import './Login.css'; // import the custom stylesheet

const QuoteForm = ({ onSubmit }) => {
  const [quoteText, setQuoteText] = useState('');
  const [secondaryText, setSecondaryText] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onSubmit(quoteText, secondaryText);
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Form.Group controlId="formQuoteText">
        <Form.Control as="textarea" rows={4} placeholder="Quote Text" value={quoteText} onChange={(e) => setQuoteText(e.target.value)} />
      </Form.Group>
      <Form.Group controlId="formSecondaryText">
        <Form.Control type="text" placeholder="Secondary Text" value={secondaryText} onChange={(e) => setSecondaryText(e.target.value)} />
      </Form.Group>
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default QuoteForm;
