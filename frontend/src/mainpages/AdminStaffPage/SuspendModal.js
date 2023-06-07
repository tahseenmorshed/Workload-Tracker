import React from 'react';
import {  Modal } from 'react-bootstrap';
import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'

const SuspendModal = ({ show, onHide, onConfirm, unsuspendSelected }) => 
{
  return (
    <Modal show={show} onHide={onHide} centered backdrop="static">
        <Modal.Header closeButton>
            <Modal.Title>{unsuspendSelected ? "Confirm Unsuspend" : "Confirm Suspend"}</Modal.Title>
                </Modal.Header>
                    <Modal.Body  style={{ fontSize: '1.4em' }} >
                    {unsuspendSelected 
                        ? "Are you sure you want to unsuspend the selected accounts?"
                         : "Are you sure you want to suspend the selected accounts?"}
                    </Modal.Body>
                <Modal.Footer>
      
                <Button.Group>
                <Button variant="secondary" onClick={onHide}> {/* If user clicks no, the staff memver will remain suspended*/}
                    Cancel
                </Button>
               <Button.Or />
                <Button positive onClick={onConfirm}> {/* If user clicks yes, the staff member will be unsuspended*/}
                    Save
                </Button>
                </Button.Group>
        </Modal.Footer>
    </Modal>

  );
                
};
export default SuspendModal;