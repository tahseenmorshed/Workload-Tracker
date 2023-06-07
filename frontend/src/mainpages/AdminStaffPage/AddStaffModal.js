import React, { useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';
import { v4 as uuidv4 } from 'uuid';
import ErrorModal from '../AdminUnitPage/ErrorModal';

// AddStaffModal component for adding a new staff member
const AddStaffModal = ({ show, onHide, onAdd }) => {
// Initialize the form state with empty values
const [form, setForm] = useState(
{
  name: '',
  email: '',
  ID: '',
  Password: '',
  Discipline: '',
  Position: '',
  WFunction: '',
  Teaching: '',
  Research: '',
  Leadership: '',
  CAP: '',
});

const [showErrorModal, setErrorModal] = useState(false);
const [error, setErrorMessage] = useState('');
// Handle input changes for the form fields
const handleFormChange = (e) => 
{ 
    setForm({ ...form, [e.target.name]: e.target.value });
};

// Function to add a new staff member with a unique ID
const addItem = async () => 
{
    // Validate form fields
    if (
      form.name == '' ||
      form.id == '' ||
      form.password == '' ||
      form.discipline == '' ||
      form.position == '' ||
      form.workFunction == '' ||
      form.occupancyType == '' ||
      form.email == ''
    ) {
      setErrorMessage("Please fill out all fields");
      setErrorModal(true);
      return;
    }

  const newUser = {
    name: form.name,
    staffID: form.id,
    password: form.password, 
    email: form.email,
    discipline: form.discipline,
    positionTitle: form.position,
    workFunction: form.workFunction,
    occupancyType: form.occupancyType,
  }; 
  console.log("new user: ", newUser);
  console.log("Sending JSON data:", JSON.stringify(newUser, null, 2));
  onAdd(newUser);

      //MAKE HTTPPOST REQUEST HERE
  try{
    const response = await fetch ('/api/User', {
      method: 'POST', 
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newUser),
    }); 

  } catch (error) {
    console.error('Error:', error);
  }
};

// Render the modal with form input fields for adding a new staff member
return (
  <>
    <Modal show={show} onHide={onHide}>
        <Modal.Header closeButton>
            <Modal.Title>Add Staff Member</Modal.Title>
               </Modal.Header>
                  <Modal.Body>

                    <Form>
                       {/* Form group for name input */}
                       <Form.Group>
                         <Form.Label>Name</Form.Label>
                           <Form.Control
                             type="text"
                             name="name"
                             value={form.name}
                             onChange={handleFormChange}
                          />
                       </Form.Group>

                       {/* Form group for ID input */}
                       <Form.Group>
                         <Form.Label>ID</Form.Label>
                           <Form.Control
                             type="text"
                             name="id"
                             value={form.id}
                             onChange={handleFormChange}
                           />
                        </Form.Group>

                      {/* Form group for ID input */}
                       <Form.Group>
                         <Form.Label>Email</Form.Label>
                           <Form.Control
                             type="text"
                             name="email"
                             value={form.email}
                             onChange={handleFormChange}
                           />
                        </Form.Group>

                       {/* Form group for discipline input */}
                       <Form.Group>
                         <Form.Label>Discipline</Form.Label>
                           <Form.Control
                             type="text"
                             name="discipline"
                             value={form.discipline}
                             onChange={handleFormChange}
                           />
                       </Form.Group>

                       {/* Form group for position title input */}
                       <Form.Group>
                         <Form.Label>Position Title</Form.Label>
                           <Form.Control
                             type="text"
                             name="position"
                             value={form.position}
                             onChange={handleFormChange}
                           />
                        </Form.Group>

                       {/* Form group for work function input */}
                       <Form.Group>
                         <Form.Label>Work Function</Form.Label>
                           <Form.Control
                             type="text"
                             name="workFunction"
                             value={form.workFunction}
                             onChange={handleFormChange}
                           />
                       </Form.Group>

                       {/* Form group for teaching input */}
                       <Form.Group>
                         <Form.Label>Password</Form.Label>
                           <Form.Control
                             type="text"
                             name="password"
                             value={form.password}
                             onChange={handleFormChange}
                           />
                        </Form.Group>
                       
                       {/* Form group for occupancy input */}
                       <Form.Group>
                         <Form.Label>Occupancy Type</Form.Label>
                           <Form.Control
                             type="text"
                             name="occupancyType"
                             value={form.occupancyType}
                             onChange={handleFormChange}
                           />
                       </Form.Group>

                    </Form>
              </Modal.Body>
        <Modal.Footer>

        {/*Button to close the modal*/} 
          <Button variant="secondary" onClick={() => onHide(false)}>
            Close
          </Button>
        {/* Button to add a new staff member */}
          <Button
            variant="success"
            onClick={() =>
              addItem(
              {
                name: form.name,
                id: form.id,
                email: form.email,
                password: form.password, 
                discipline: form.discipline,
                position: form.position,
                workFunction: form.workFunction,
                occupancyType: form.occupancyType
              })
            }
          >
            Add Staff Member
          </Button>
        </Modal.Footer>
    </Modal>

    <ErrorModal
          showErrorModal={showErrorModal}
          setErrorModal={setErrorModal}
          error={error}
    />
  </>
  );
};
export default AddStaffModal;