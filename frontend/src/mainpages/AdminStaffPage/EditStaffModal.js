import React, { useState, useEffect } from 'react';
import { Button, Modal, Form, InputGroup } from 'react-bootstrap';
import ConfirmationModal from './confirmationModal';

const EditStaffModal = ({ show, onHide, onUpdate, item }) => {
  // Initialize the form state with empty values
  const [form, setForm] = useState(
  {
    name: '',
    ID: '',
    Discipline: '',
    Position: '',
    WFunction: '',
    Teaching: '',
    Research: '',
    Leadership: '',
    CAP: '',
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
        ID: item.ID,
        Discipline: item.Discipline,
        Position: item.Position,
        WFunction: item.WFunction,
        Teaching: item.Teaching,
        Research: item.Research,
        Leadership: item.Leadership,
        CAP: item.CAP,
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
    if (!form.ID) newErrors.ID = 'ID is required';
    if (!form.Discipline) newErrors.Discipline = 'Discipline is required';
    if (!form.Position) newErrors.Position = 'Position Title is required';
    if (!form.WFunction) newErrors.WFunction = 'Work Function is required';

    // Validate Research, Teaching, CAP, and Leadership to ensure user input is correct
    const sum = parseInt(form.Research) + parseInt(form.Teaching) + parseInt(form.CAP) + parseInt(form.Leadership);
    if (isNaN(sum) || sum !== 100) newErrors.totalPercentage = 'Research, Teaching, CAP, and Leadership must sum up to 100%';

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
            <Form.Label>ID</Form.Label>
            <Form.Control
              type="text"
              name="ID"
              value={form.ID}
              onChange={handleFormChange}
              isInvalid={errors.ID} />
            <Form.Control.Feedback type="invalid">
              {errors.ID}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Discipline field */}
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

          {/* Position Title field */}
          <Form.Group>
            <Form.Label>Position Title</Form.Label>
            <Form.Control
              type="text"
              name="Position"
              value={form.Position}
              onChange={handleFormChange}
              isInvalid={errors.Position} />
            <Form.Control.Feedback type="invalid">
              {errors.Position}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Work Function field */}
          <Form.Group>
            <Form.Label>Work Function</Form.Label>
            <Form.Control
              type="text"
              name="Work Function"
              value={form.WFunction}
              onChange={handleFormChange}
              isInvalid={errors.WFunction} />
            <Form.Control.Feedback type="invalid">
              {errors.WFunction}
            </Form.Control.Feedback>
          </Form.Group>

          {/* Teaching field */}
          <Form.Group>
            <Form.Label>Teaching</Form.Label>
            <InputGroup className='mb-3'></InputGroup>
            <Form.Control
              type="text"
              name="Teaching"
              value={form.Teaching}
              onChange={handleFormChange}
              isInvalid={errors.totalPercentage} />
          </Form.Group>


          {/* Research field */}
          <Form.Group>
            <Form.Label>Research</Form.Label>
            <Form.Control
              type="text"
              name="Research"
              value={form.Research}
              onChange={handleFormChange}
              isInvalid={errors.totalPercentage} />
          </Form.Group>

          {/* Leadership field */}
          <Form.Group>
            <Form.Label>Leadership</Form.Label>
            <Form.Control
              type="text"
              name="Leadership"
              value={form.Leadership}
              onChange={handleFormChange}
              isInvalid={errors.totalPercentage} />
          </Form.Group>

          {/* CAP field */}
          <Form.Group>
            <Form.Label>CAP</Form.Label>
            <Form.Control
              type="text"
              name="CAP"
              value={form.CAP}
              onChange={handleFormChange}
              isInvalid={errors.totalPercentage} />
          </Form.Group>
        </Form>

        {errors.totalPercentage && (<div className="text-danger mt-2">{errors.totalPercentage}</div>)}
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={() => onHide(false)}> {/* Creates a close button at the bottom of the pop up*/}
          Close
        </Button>
        <Button
          variant="info"
          onClick={handleUpdate}
        >
          Save Changes {/* Saves the information provided by the user, storing it in the table */}
        </Button>
      </Modal.Footer>
    </Modal>
    
    <ConfirmationModal
        show={showConfirmationModal}
        onHide={() => setShowConfirmationModal(false)}
        onConfirm={handleConfirmUpdate} /></>

  );
};      

export default EditStaffModal;