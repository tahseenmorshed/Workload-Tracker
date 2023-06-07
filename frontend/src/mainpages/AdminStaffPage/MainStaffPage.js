import React, { useState, useEffect } from 'react';
import { Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';
import './styles.css';
import UserRow from './UserRow';
import AddStaffModal from './AddStaffModal';
import EditStaffModal from './EditStaffModal';
import SuspendModal from './SuspendModal';
import UnSuspendModal from './SuspendModal';
import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import ErrorModal from '../AdminUnitPage/ErrorModal';


// This is just hardcoded data to test the tables
const initialData = 
[
  { id: uuidv4(), name: 'Rishi Makwana', ID: '20177065', Discipline: 'Computing', Position: 'Tutor', WFunction: 'Teaching Only',Teaching: '50%', Research: '20%', Leadership: '10%', CAP: '20%' },
  { id: uuidv4(), name: 'Tahseen Morshed', ID: '20194853', Discipline: 'Computing',Position: 'Tutor',WFunction: 'Teaching Only',Teaching: '50%', Research: '20%', Leadership: '10%', CAP: '20%' },
];

export default function CRUDTable() 
{
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [suspendedIds, setSuspendedIds] = useState(new Set());
  const [showSuspendConfirmationModal, setShowSuspendConfirmationModal] = useState(false);
  const [showUnsuspendConfirmationModal, setShowUnsuspendConfirmationModal] = useState(false); // Showing unsuspended confirmation modal
  const [unsuspendItemId, setUnsuspendItemId] = useState(null); // Store ID of item to unsuspend
  const [users, setUsers] = useState([]); 
  const [data, setData] = useState([]);
  const [showErrorModal, setErrorModal] = useState(false);
  const [error, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      const response = await fetch('/api/User/GetUsers');
      const fetchedUsers = await response.json();
      setUsers(fetchedUsers);
      setData(fetchedUsers); // Update data state with fetched users
      console.log("Fetched Users: ", fetchedUsers);
    };

    fetchUsers();
  }, []);


// Initialize the form state with empty values
  const [, setForm] = useState(
  {
    name: '',
    ID: '',
    Discipline: '',
    Position: '',
    WFunction:'',
    Teaching: '',
    Research:'',
    Leadership:'',
    CAP:'',
  });



  function handleEdit(item) 
  {
    setEditItem(item);
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
      CAP: item.CAP 
    });
    setShowEditModal(true);
  }

  function addItem(item)  //Adds item to the table
  {
    setData([...data, item]);
    setShowAddModal(false);
  }

  function updateItem(item) //Allows to edit the rows
  {
    setData(data.map((d) => (d.id === item.id ? item : d)));
    setShowEditModal(false);
    setEditItem(null);
  }


  const deleteSelectedItems = async () => {
    /*
    setData(data.filter((d) => !selectedIds.has(d.id)));
    setSelectedIds(new Set());*/

    const deleteUsers = Array.from(selectedIds);
    console.log("Deleting units ", deleteUsers);
  
    const deletePromises = deleteUsers.map(async (user) => {
      const staffID = user.staffID;
      try{
        const response = await fetch(`/api/User/${user}`, {
          method: 'DELETE',
        });

        if (!response.ok){
          setErrorMessage("Cannot delete a Unit Coordinator. You must delete or reassign any assigned relevant units.")
          setErrorModal(true)
        }
      }
      catch(error){
        console.log("Error", error)
      }
      
    });
  
    Promise.all(deletePromises)
      .then(() => {
        const newUsers = users.filter((user) => !selectedIds.has(`${user.staffID}`));
        setUsers(newUsers);
        setSelectedIds(new Set());
      })
      .catch((error) => {
        console.error('Error deleting units:', error);
      });
  }

  /*
  function handleSelect(id) {
    setSelectedIds((prevSelectedIds) => {
      const newSelectedIds = new Set(prevSelectedIds);
      if (newSelectedIds.has(id)) {
        newSelectedIds.delete(id);
      } else {
        newSelectedIds.add(id);
      }
      return newSelectedIds;
    });
  }*/

  function handleSelect(id) {
    const selectedId = `${id}`;
    const newSelectedIds = new Set(selectedIds);
  
    if (newSelectedIds.has(selectedId)) {
      newSelectedIds.delete(selectedId);
    } else {
      newSelectedIds.add(selectedId);
    }
  
    setSelectedIds(newSelectedIds);
  }
  
  
  //Handles uspend button 
  function handleSuspendAccount() {
    setShowSuspendConfirmationModal(true);
  }
  
  function handleConfirmSuspend() 
  {
    const newSuspendedIds = new Set(suspendedIds);
    selectedIds.forEach((id) => // Iterates over selectedIDs
    {
      if (newSuspendedIds.has(id))  // Checks to see if the current ID exists in the newSuspendedIds set
      {
        newSuspendedIds.delete(id); //Remove if it exists which unsuspends account
      } 
      else 
      {
        newSuspendedIds.add(id); // If ID doesn't exist, add it to newSuspendedIds set which suspends account
      }
    });
    setSuspendedIds(newSuspendedIds);
    setShowSuspendConfirmationModal(false);
  }
//Handles unsuspend button
  function handleUnsuspendAccount(id) 
  {
    setUnsuspendItemId(id);
    setShowUnsuspendConfirmationModal(true);
  }

  //Handles confirmaton of unsuspend action
  function handleConfirmUnsuspend() 
  {
    const newSuspendedIds = new Set(suspendedIds);
    newSuspendedIds.delete(unsuspendItemId);
    setSuspendedIds(newSuspendedIds);
    setShowUnsuspendConfirmationModal(false);
    setUnsuspendItemId(null);
  }


  return (
    <Container >
      <UserRow data={data} onSelect={handleSelect} selectedIds={selectedIds} onEdit={handleEdit} suspendedIds={suspendedIds} onUnsuspend={handleUnsuspendAccount}/>

      {/* Button to delete the staff members that have been selected */}
    {/* Button to add new staff members - this pulls up the pop-up to add new members */}
    <Button circular className="add-units-locatio" size="large"
        onClick={() => setShowAddModal(true)}
        style={{ backgroundColor: '#2c75e2', color:"white"}}
      >
        Add User(s)
      </Button>
   
     
      {/* Button to delete the staff members that have been selected */}
      <Button
        circular size="large"
        variant="danger"
        onClick={deleteSelectedItems}
        disabled={selectedIds.size === 0}
        style={{ backgroundColor: 'red', color:"white"}}
        className="delete-units-location"
      >
        Delete User(s)
      </Button>

      <Button
        circular size="large"
        variant="warning"
        onClick={handleSuspendAccount}
        disabled={selectedIds.size === 0}
        style={{ backgroundColor: 'Orange', color:"white"}}
        className="suspend-units-location"
      >
      {(selectedIds.size === suspendedIds.size) ? 'Unsuspend Unit(s)' : 'Suspend Unit(s)'}
      </Button>
    
  
     
     
      <AddStaffModal //Calls component to add staff members to a table
        show={showAddModal}
        onHide={() => setShowAddModal(false)}
        onAdd={addItem}
      />

      <EditStaffModal //Calls component to edit staff members to a table
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        onUpdate={updateItem}
        item={editItem}
      />

      <SuspendModal //Calls component suspend a user with confirmation
        show={showSuspendConfirmationModal}
        onHide={() => setShowSuspendConfirmationModal(false)}
        onConfirm={handleConfirmSuspend} />

      <UnSuspendModal //Calls component to unsuspend a user with confirmation
        show={showUnsuspendConfirmationModal}
        onHide={() => setShowUnsuspendConfirmationModal(false)}
        onConfirm={handleConfirmUnsuspend} />

      <ErrorModal
          showErrorModal={showErrorModal}
          setErrorModal={setErrorModal}
          error={error}
       />

    </Container>
  );
}