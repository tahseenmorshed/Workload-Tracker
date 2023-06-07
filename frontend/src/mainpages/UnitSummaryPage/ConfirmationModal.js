import React from 'react';
import { Modal } from 'react-bootstrap';
import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const ConfirmationModal = ({
  showModal,
  handleClose,
  handleCancelSave,
  handleConfirmSave,
}) => {
  return (
    <Modal
      size="lg"
      centered
      backdrop="static"
      show={showModal}
      onClose={handleClose}
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirm Changes</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ fontSize: '1.4em' }}>
        Are you sure you want to proceed?
      </Modal.Body>
      <Modal.Footer>
        <Button.Group>
          <Button variant="secondary" onClick={handleCancelSave}>
            Modify
          </Button>
          <Button.Or />
          <Button onClick={handleConfirmSave} style={{ backgroundColor: '#2c75e2' }}>
            Continue
          </Button>
        </Button.Group>
      </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;