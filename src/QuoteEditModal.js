import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import './QuoteEdit.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

const QuoteEditModal = ({ quoteText, secondaryText, quoteURL, onCloseModal, onSave }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [editedQuoteText, setEditedQuoteText] = useState(quoteText);
  const [editedSecondaryText, setEditedSecondaryText] = useState(secondaryText);
  const quoteTextInputRef = useRef(null);

  useEffect(() => {
    // Set focus on the quote text input when the modal opens
    quoteTextInputRef.current.focus();

    // Add event listener to handle clicks outside the modal
    const handleOutsideClick = (event) => {
      if (event.target.classList.contains('modal-background')) {
        setModalVisible(false);
        onCloseModal();
      }
    };

    window.addEventListener('click', handleOutsideClick);

    // Clean up the event listener when the component unmounts
    return () => {
      window.removeEventListener('click', handleOutsideClick);
    };
  }, [onCloseModal]);

  const handleSave = () => {
    // Handle save functionality
    onSave();
    setModalVisible(false);
  };

  const handleCloseModal = () => {
    // Close the modal without saving changes
    setModalVisible(false);
    onCloseModal();
  };

  return (
    <div className={`modal-background ${modalVisible ? 'visible' : ''}`}>
      <div className="modal-content">
        <Card className="modal-card quote-widget">
          <Modal.Body>
            <Form onSubmit={handleSave}>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={3}
                  className="quote-input"
                  style={{ height: '82px', width: '328px', borderRadius: '5px' }}
                  placeholder="Enter quote text"
                  value={editedQuoteText}
                  onChange={(e) => setEditedQuoteText(e.target.value)}
                  ref={quoteTextInputRef}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter secondary text"
                  className="quote-input"
                  value={editedSecondaryText}
                  onChange={(e) => setEditedSecondaryText(e.target.value)}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter a URL"
                  className="quote-input"
                  value={quoteURL}
                  onChange={(e) => setQuoteURL(e.target.value)}
                />
              </Form.Group>
              <Button type="submit" variant="success">
                <FontAwesomeIcon icon={faPlusSquare} /> Save
              </Button>
            </Form>
          </Modal.Body>
        </Card>
      </div>
    </div>
  );
};

export default QuoteEditModal;
