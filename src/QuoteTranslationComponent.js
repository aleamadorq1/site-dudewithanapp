import React from 'react';
import { Form, Button, Card } from 'react-bootstrap';
import Select from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import './QuoteManagement.css';

const QuoteTranslationComponent = ({ index, translation, updateTranslation, removeTranslation }) => {

  const handleChange = (field, value) => {
    updateTranslation(index, field, value);
  };

  const languageOptions = [
    { value: 'en', label: '🇬🇧 English' },
    { value: 'es', label: '🇪🇸 Spanish' },
    { value: 'pt', label: '🇧🇷 Portuguese' },
    { value: 'de', label: '🇩🇪 German' },
    { value: 'it', label: '🇮🇹 Italian' },
    { value: 'ja', label: '🇯🇵 Japanese' },
    { value: 'zh', label: '🇨🇳 Chinese' }, // Note: This is for Simplified Chinese
    { value: 'ko', label: '🇰🇷 Korean' },
    { value: 'ru', label: '🇷🇺 Russian' }
  ];
  
  return (
    <Card className="mt-3">
      <Card.Body>
        <Form.Group className='multi-column'>
            <Select
                options={languageOptions}
                className='quote-input'
                onChange={(options) => handleChange("languageCode", options.value)}
                defaultValue={languageOptions.find(opt => opt.value === translation.languageCode)}
            />
            <Button className='inline-button red' onClick={removeTranslation }>
                <FontAwesomeIcon icon={faTrash} />
            </Button>
        </Form.Group>
        <Form.Group>
          <Form.Control
            as="textarea"
            rows={4}
            className="quote-input"
            style={{ borderRadius: '5px' }}
            placeholder="Enter quote text"
            value={translation.primaryText}
            maxLength={250}
            onChange={(e) => handleChange("primaryText", e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Control
            type="text"
            placeholder="Enter secondary text"
            value={translation.secondaryText}
            className="quote-input"
            style={{ borderRadius: '5px' }}
            onChange={(e) => handleChange("secondaryText", e.target.value)}
          />
        </Form.Group>
        
      </Card.Body>
    </Card>
  );
};

export default QuoteTranslationComponent;
