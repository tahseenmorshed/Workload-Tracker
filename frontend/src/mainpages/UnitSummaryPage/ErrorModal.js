import React from 'react';
import { Modal, Button } from 'react-bootstrap';

const ErrorModal = ({ showErrorModal, setErrorModal, error }) => {
  return (
    <Modal
      size="sm"
      centered
      backdrop="static"
      show={showErrorModal}
      onHide={() => setErrorModal(false)}
    >
      <Modal.Header closeButton>
        <Modal.Title>Error</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ fontSize: '1.4em' }}>{error}</Modal.Body>
      <Modal.Footer>
        <Button variant="primary" onClick={() => setErrorModal(false)}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ErrorModal;
