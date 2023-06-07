import React, { useState, useEffect } from 'react';
import { Modal, Form, InputGroup } from 'react-bootstrap';
import ConfirmationModal from './ConfirmationModal';
import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'


const EditUnitModal = ({ show, onHide, onUpdate, item }) => {
  // Initialize the form state with empty values
  const [form, setForm] = useState(
  {
    name: '',
    UnitCode: '',
    Coordinator: '',
    Discipline: '',
    Location:'',
    Parameter: '',
    Credits:'',
    TeachWeeks:'',
    PSH:'',
  });

  const [errors, setErrors] = useState({});
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);


  useEffect(() => 
  {
    if (item) 
    {
      setForm(
      {
        name: item.name, 
        UnitCode: item.UnitCode, 
        Coordinator: item.Coordinator, 
        Discipline: item.Discipline,
        Location: item.Location,
        Parameter: item.Parameter, 
        Credits: item.Credits, 
        TeachWeeks: item.TeachWeeks, 
        PSH: item.PSH 
      });
    }
  }, [item]);

  const handleFormChange = (e) => 
  {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validateForm = () => 
  {
    const newErrors = {};

    // Validate name, ID, and Discipline to ensure the user has entered values for these sections
    if (!form.name) newErrors.name = 'Name is required';
    if (!form.UnitCode) newErrors.UnitCode = 'Unit Code is required';
    if (!form.Coordinator) newErrors.Coordinator = 'Unit Coordinator is required';
    if (!form.Discipline) newErrors.Discipline = 'Discipline is required';
    if (!form.Location) newErrors.Location = 'Location is required';

    // Validate Credits, Parameter, PSH, and TeachWeeks to ensure user input is correct

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleUpdate = () => {
    if (validateForm()) {
      setShowConfirmationModal(true);
    }
  };

  const handleConfirmUpdate = () => {
    onUpdate({
      id: item.id,
      ...form,
    });
    setShowConfirmationModal(false);
    onHide();
  };

  return (
    <><Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Edit User</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          {/* Name field */}
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              isInvalid={errors.name} />
            <Form.Control.Feedback type="invalid">
              {errors.name}
            </Form.Control.Feedback>
          </Form.Group>

          {/* ID field */}
          <Form.Group>
            <Form.Label>Unit Code</Form.Label>
            <Form.Control
              type="text"
              name="UnitCode"
              value={form.UnitCode}
              onChange={handleFormChange}
              isInvalid={errors.UnitCode} />
            <Form.Control.Feedback type="invalid">
              {errors.UnitCode}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Discipline field */}
          <Form.Group>
            <Form.Label>Unit Coordinator</Form.Label>
            <Form.Control
              type="text"
              name="Coordinator"
              value={form.Coordinator}
              onChange={handleFormChange}
              isInvalid={errors.Coordinator} />
            <Form.Control.Feedback type="invalid">
              {errors.Coordinator}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Position Title field */}
          <Form.Group>
            <Form.Label>Discipline</Form.Label>
            <Form.Control
              type="text"
              name="Discipline"
              value={form.Discipline}
              onChange={handleFormChange}
              isInvalid={errors.Discipline} />
            <Form.Control.Feedback type="invalid">
              {errors.Discipline}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Location field */}
          <Form.Group>
            <Form.Label>Location</Form.Label>
            <Form.Control
              type="text"
              name="Location"
              value={form.Location}
              onChange={handleFormChange}
              isInvalid={errors.Location} />
            <Form.Control.Feedback type="invalid">
              {errors.Location}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Parameter field */}
          <Form.Group>
            <Form.Label>Parameter</Form.Label>
            <InputGroup className='mb-3'></InputGroup>
            <Form.Control
              type="text"
              name="Parameter"
              value={form.Parameter}
              onChange={handleFormChange} />
          </Form.Group>


          {/* Credits field */}
          <Form.Group>
            <Form.Label>Credits</Form.Label>
            <Form.Control
              type="text"
              name="Credits"
              value={form.Credits}
              onChange={handleFormChange} />
          </Form.Group>

          {/* TeachWeeks field */}
          <Form.Group>
            <Form.Label>TeachWeeks</Form.Label>
            <Form.Control
              type="text"
              name="TeachWeeks"
              value={form.TeachWeeks}
              onChange={handleFormChange} />
          </Form.Group>

          {/* PSH field */}
          <Form.Group>
            <Form.Label>PSH</Form.Label>
            <Form.Control
              type="text"
              name="PSH"
              value={form.PSH}
              onChange={handleFormChange} />
          </Form.Group>
        </Form>

      </Modal.Body>
      <Modal.Footer>
        <Button.Group>
        <Button variant="secondary" onClick={() => onHide(false)}> {/* Creates a close button at the bottom of the pop up*/}
          Close
        </Button>
        <Button.Or />
        <Button
         positive
          variant="info"
          onClick={handleUpdate}
        >
          Save Changes {/* Saves the information provided by the user, storing it in the table */}
        </Button>
        </Button.Group>
      </Modal.Footer>
    </Modal>
    
    <ConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmUpdate} /></>  
  );
};      

export default EditUnitModal;