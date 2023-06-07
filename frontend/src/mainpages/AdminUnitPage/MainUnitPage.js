import { useState } from "react";
import { Container} from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import { v4 as uuidv4 } from 'uuid';
import './styles.css';
import UserRow from './UserRow';
import SuspendModal from './SuspendModal';
import DeleteModal from './DeleteModal'; 
import { Button } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { Link } from 'react-router-dom';
import React, {useEffect} from "react";

export default function CRUDTable() 
{
  //const [data, setData] = useState(initialData);
  const [selectedIds, setSelectedIds] = useState(new Set([]));
  const [suspendedIds, setSuspendedIds] = useState(new Set());
  const [showSuspendConfirmationModal, setShowSuspendConfirmationModal] = useState(false);
  const [showDeleteConfirmationModal, setShowDeleteConfirmationModal] = useState(false); 
  const [unsuspendSelected, setUnsuspendSelected] = useState(false);
  const [units, setUnits] = useState([]); 

  useEffect(() => {
    const fetchUnits = async () => {
      const response = await fetch('/api/Unit/GetUnits');
      const fetchedUnits = await response.json();
      setUnits(fetchedUnits);
      console.log("Units: ", fetchedUnits)
    };

    fetchUnits();
  }, []);
  
  function deleteSelectedItems() //Deletes all the selected rows
  {
    setShowDeleteConfirmationModal(true);
  }

  /*
  function handleConfirmDelete()
  {
    const newUnits = units.filter((unit) => !selectedIds.has(unit.code));
    setUnits(newUnits);
    setSelectedIds(new Set());  
    setShowDeleteConfirmationModal(false);

    //MAKE HTTPDELETE REQUEST HERE
  }*/

  function handleConfirmDelete() {
    const deleteUnits = Array.from(selectedIds);
    console.log("Deleting units ", deleteUnits);
  
    const deletePromises = deleteUnits.map((unit) => {
      const [code, studyPeriod] = unit.split('-');
      return fetch(`/api/Unit/${code}/${studyPeriod}`, {
        method: 'DELETE',
      });
    });
  
    Promise.all(deletePromises)
      .then(() => {
        const newUnits = units.filter((unit) => !selectedIds.has(`${unit.code}-${unit.studyPeriod}`));
        setUnits(newUnits);
        setSelectedIds(new Set());
        setShowDeleteConfirmationModal(false);
      })
      .catch((error) => {
        console.error('Error deleting units:', error);
      });
  }
  
  
/*
  function handleSelect(id) // Allows for selection of each row in the table
  {
      const newSelectedIds = new Set(selectedIds);
      if (newSelectedIds.has(id))  // Checks to see if the current ID exists in the newSelectedIds set
      {
        newSelectedIds.delete(id); // unselect
      }
      else
      {
        newSelectedIds.add(id); //select
      }
      setSelectedIds(newSelectedIds);
  }*/

  function handleSelect(code, studyPeriod) {
    const selectedId = `${code}-${studyPeriod}`;
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
      if (selectedIds.size === suspendedIds.size) {
        setUnsuspendSelected(true);
      } else {
        setUnsuspendSelected(false);
      }
      setShowSuspendConfirmationModal(true);
    }
    
    function handleConfirmSuspend() {
      const newSuspendedIds = new Set(suspendedIds);
      selectedIds.forEach((id) => {
        if (unsuspendSelected) {
          newSuspendedIds.delete(id);
        } else {
          newSuspendedIds.add(id);
        }
      });
      setSuspendedIds(newSuspendedIds);
      setShowSuspendConfirmationModal(false);
    }


  return (
    <Container >
      <UserRow data={units} onSelect={handleSelect} selectedIds={selectedIds} suspendedIds={suspendedIds} />

      <Link to="/unitaddpage/">
      <Button className="add-units-locati" size="large"
        style={{ backgroundColor: '#2c75e2', color:"white"}}
      >
        Add Unit(s)
      </Button>
      </Link>
     
      {/* Button to delete the staff members that have been selected */}
      <Button
        size="large"
        variant="danger"
        onClick={deleteSelectedItems}
        disabled={selectedIds.size === 0}
        style={{ backgroundColor: 'red', color:"white"}}
        className="delete-units-locatio"
      >
        Delete Units(s)
      </Button>

      {/* Buttons to do the suspending/unsuspending of a unit*/}
      <Button
        size="large"
        variant="warning"
        onClick={handleSuspendAccount}
        disabled={selectedIds.size === 0}
        style={{ backgroundColor: 'Orange', color:"white"}}
        className="suspend-units-locatio"
      >
      {(selectedIds.size === suspendedIds.size) ? 'Unsuspend Unit(s)' : 'Suspend Unit(s)'}
      </Button>
    
      <SuspendModal
        show={showSuspendConfirmationModal}
        onHide={() => setShowSuspendConfirmationModal(false)}
        onConfirm={handleConfirmSuspend}
        unsuspendSelected={unsuspendSelected}
      />

      <DeleteModal
        show={showDeleteConfirmationModal}
        onHide={() => setShowDeleteConfirmationModal(false)}
        onConfirm={handleConfirmDelete}
      />
     
    </Container>
  );
}