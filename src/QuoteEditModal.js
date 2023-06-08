import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button, Form, Card } from 'react-bootstrap';
import './QuoteEdit.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlusSquare } from '@fortawesome/free-solid-svg-icons';

const QuoteEditModal = ({ quoteText, secondaryText, quoteURL, isActive, onCloseModal, onSave, config, fetchQuotes }) => {
  const [modalVisible, setModalVisible] = useState(true);
  const [editedQuoteText, setEditedQuoteText] = useState(quoteText);
  const [editedSecondaryText, setEditedSecondaryText] = useState(secondaryText);
  const [editedQuoteURL, setEditedQuoteURL] = useState(quoteURL);
  const [editedisActive, setEditedIsActive] = useState(isActive);
  const quoteTextInputRef = useRef(null);

  useEffect(() => {
    // Update state when props change
    setEditedQuoteText(quoteText);
    setEditedSecondaryText(secondaryText);
    setEditedQuoteURL(quoteURL);
    setEditedIsActive(isActive)
  }, [quoteText, secondaryText, quoteURL, isActive]);

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

  const handleSave = async () => {
    onSave({
      quoteText: editedQuoteText,
      secondaryText: editedSecondaryText,
      quoteURL: editedQuoteURL,
      isActive: editedisActive?1:0
    });
    setModalVisible(false);
    fetchQuotes(); // Call fetchQuotes function passed as a prop
  };

  return (
    <div className={`modal-background ${modalVisible ? 'visible' : ''}`}>
      <div className="modal-content">
        <Card className="modal-card quote-widget">
          <Modal.Body>
            <Form>
              <Form.Group>
                <Form.Control
                  as="textarea"
                  rows={4}
                  className="quote-input"
                  placeholder="Enter quote text"
                  value={editedQuoteText}
                  maxLength={250}
                  onChange={(e) => setEditedQuoteText(e.target.value)} // Update editedQuoteText state
                  ref={quoteTextInputRef}
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter secondary text"
                  className="quote-input"
                  value={editedSecondaryText}
                  onChange={(e) => setEditedSecondaryText(e.target.value)} // Update editedSecondaryText state
                />
              </Form.Group>
              <Form.Group>
                <Form.Control
                  type="text"
                  placeholder="Enter a URL"
                  className="quote-input"
                  value={editedQuoteURL}
                  onChange={(e) => setEditedQuoteURL(e.target.value)} // Update editedQuoteURL state
                />
              </Form.Group>
              <Form.Group>
                <Form.Check
                  type="switch"
                  id="isActiveSwitch"
                  label="Show in App"
                  checked={editedisActive}
                  onChange={(e) => setEditedIsActive(e.target.checked)}
                />
              </Form.Group>
              <Button type="button" variant="success" onClick={handleSave}>
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
