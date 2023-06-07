import React, { useRef, useState } from 'react';
import { Segment, Header, Button, Message } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import './FileUpload.css';
import { BiImport } from 'react-icons/bi';
import { IoMdTrash } from 'react-icons/io';

// FileUpload component for uploading CSV files
const FileUpload = () => {
  const fileInputRef = useRef(); // Reference to the file input element
  const [fileNames, setFileNames] = useState([]); // List of selected file names
  const [fileUploaded, setFileUploaded] = useState(false); // Flag for successful file upload
  const [formData, setFormData] = useState(null); // Form data for file upload
  const [errorMessage, setErrorMessage] = useState(''); // Error message to display on the frontend

  // Handle file selection in the file input element
  const handleFileChange = async (event) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    const newFileNames = [];
    const newFormData = new FormData();
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.type !== 'text/csv') {
        alert('Please select only CSV files');
        return;
      }
      newFileNames.push(file.name);
      newFormData.append('files', file);
    }

    setFileNames(newFileNames);
    setFormData(newFormData);
  };

  // Handle file upload when the "Upload" button is clicked
  const handleUpload = async () => {
    if (!formData) {
      setErrorMessage('Please choose a file before uploading.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5185/api/csv/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorText = await response.text();
        setErrorMessage('An error occurred while uploading the file. Please try again.');
        throw new Error(errorText);
      }

      const data = await response.json();
      console.log(data); // Do something with the parsed data
      setFileUploaded(true);
      setErrorMessage('');
    } catch (error) {
      console.error('Error uploading file:', error);
    }
  };

  // Handle file deletion when the delete icon is clicked
  const handleDeleteFile = (index) => {
    const newFileNames = [...fileNames];
    newFileNames.splice(index, 1);
    setFileNames(newFileNames);

    const newFormData = new FormData();
    for (let i = 0; i < newFileNames.length; i++) {
      const file = fileInputRef.current.files[i];
      newFormData.append('files', file);
    }
    setFormData(newFormData);

    // Reset the file input
    fileInputRef.current.value = null;
  };

  // Clear all selected files when the "Clear" button is clicked
  const handleClearFiles = () => {
    setFileNames([]);
    setFormData(null);
    fileInputRef.current.value = null;
  };

  // Trigger the file input element when the "Choose File" button is clicked
  const triggerFileInput = () => {
    fileInputRef.current.click();
  };

  return (
    <>
      <Segment
        style={{ border: '1px solid black' }}
        className="upload-segment"
      >
        <Header style={{ fontSize: '33px' }}>
          <BiImport />
        </Header>
        <p style={{ fontWeight: 'bold', fontSize: '21px' }}>
          Please Import CSV File Here
        </p>
        <Button
          style={{ backgroundColor: '#2c75e2', color: 'white' }}
          onClick={triggerFileInput}
        >
          Choose File
        </Button>
        <input
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          ref={fileInputRef}
          hidden
          multiple
        />
        <p>
        {fileNames.length > 0 && (
            <>
              Selected files:
              <ul className="file-names-list">
                {fileNames.map((name, index) => (
                  <li key={index}>
                    {name}{'  '}
                    <IoMdTrash
                    fontSize='20px'
                      color='red'
                      onClick={() => handleDeleteFile(index)}
                    />
                  </li>
                ))}
              </ul>
            </>
          )}
        </p>
        <Button onClick={handleUpload}>Upload</Button>
        <Button onClick={handleClearFiles}>Clear</Button>
        {fileUploaded && (
          <Message positive>
            <Message.Header>File(s) have been successfully uploaded
            </Message.Header>
          </Message>
        )}
          {errorMessage && (
          <Message negative>
            <Message.Header>Error</Message.Header>
            <p>{errorMessage}</p>
          </Message>
        )}
      </Segment>
    </>
  );
};
export default FileUpload;

