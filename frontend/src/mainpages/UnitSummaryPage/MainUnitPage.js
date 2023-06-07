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
  

  return (
    <Container >
      <UserRow data={units}/>
  
    </Container>
  );
}