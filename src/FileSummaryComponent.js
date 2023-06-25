import React, { useState, useEffect } from 'react';
import { Button} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileExcel, faTrash } from '@fortawesome/free-solid-svg-icons';
import { v4 as uuidv4 } from 'uuid';
import './QuoteManagement.css';

const FileSummaryComponent = ({ file, setQuoteTranslations, handleRemoveFile, setQuoteText, setSecondaryText }) => {
  const [lineCount, setLineCount] = useState(0);

  useEffect(() => {
    if (file) {
      console.log(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const contents = e.target.result;
        const lines = contents.split('\n');
        setLineCount(lines.length - 1);  // Subtract one to exclude the header

        const translations = lines.slice(1)
        .filter(line => line.trim() !== '')  // Filter out any empty lines
        .map(line => {
          const parts = line.split(',"');
      
          if (parts.length < 3) {  // Check if line has the correct number of parts
            console.warn(`Skipping line with missing fields: "${line}"`);
            return null;
          }
      
          return {
            index: uuidv4(),
            languageCode: parts[0],
            primaryText: parts[1].slice(0, -1), // Remove quotes
            secondaryText: parts[2].slice(0, -1) // Remove quotes
          };
        })
        .filter(item => item !== null);  // Remove any null items

        // Set the translations in the parent component
        setQuoteTranslations(translations);

        // Set the quoteText and secondaryText based on the first quote with language code 'en'
        const firstEnglishTranslation = translations.find(t => t.languageCode === 'en');
        if (firstEnglishTranslation) {
          setQuoteText(firstEnglishTranslation.primaryText);
          setSecondaryText(firstEnglishTranslation.secondaryText);
        }
      };
      reader.readAsText(file);
    } else {
      setLineCount(0);
    }
  }, [file, setQuoteTranslations, setQuoteText, setSecondaryText]);

  return (
    <div className='inline-group'> 
      <p className='inline-info'><FontAwesomeIcon icon={faFileExcel} /> Line Count: {lineCount}</p>
      <Button variant="info" className='inline-group-button-icon inline-button red' onClick={handleRemoveFile}>
        <FontAwesomeIcon icon={faTrash} />
      </Button>
    </div>
  );
};

export default FileSummaryComponent;