import React from 'react';
import { Button, Modal } from 'react-bootstrap';

const ConfirmationModal = ({ show, onHide, onConfirm }) => 
{
  return (
    <Modal size="lg" centered backdrop="static" show={show} onHide={onHide}> {/*Creates centred modal in centre of page*/}
        <Modal.Header closeButton>
            <Modal.Title>Confirm Changes</Modal.Title>
            </Modal.Header>
                 <Modal.Body style={{ fontSize: '1.4em' }}>
                    Are you sure you want to proceed?
                </Modal.Body>
            <Modal.Footer>
            
            <Button variant="secondary" onClick={onHide}> {/*Modal will drop and the user can keep editing*/}
                 Modify
            </Button>
            
            <Button onClick={onConfirm} style={{ backgroundColor: '#2c75e2'}}> {/*Modal will drop and the changes will be saved*/}
                Proceed
            </Button>
        </Modal.Footer>
    </Modal>
  );
};

export default ConfirmationModal;