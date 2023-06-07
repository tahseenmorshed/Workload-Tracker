import React, {useState} from 'react';
import { Container } from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css';
import UnitInformation from './UnitInformation';
import TDRTable from './TDRTable';
import TeachingTeamAllocationTable from './TeachingTeamAllocationTable';
import './styles.css';
import { Button } from 'semantic-ui-react';
import { useNavigate} from 'react-router-dom';
import { Modal} from 'react-bootstrap';
import ConfirmationModal from '../ConfirmationModal';
import ErrorModal from '../ErrorModal';

const initialData = [
    {
      name: '',
      coordinator: '',
      code: '',
      teachingWeeks: '',
      creditPoints: '',
      location: '',
      workloadParameter: '',
      plannedHeadCount: '',
      studyPeriod: '',
    },
  ];
  
  const DataTables = ({ data, setData }) => {
    const unit = data[0];
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setErrorModal] = useState(false);
    const [error, setErrorMessage] = useState('');
    const navigate = useNavigate();

    const [standardContactData, setStandardContactData] = useState([
      ['Lecture', '', '', '', '', ''],
      ['Seminar', '', '', '', '', ''],
      ['Workshop', '', '', '', '', ''],
      ['Tutorial', '', '', '', '', ''],
      ['Computer Lab', '', '', '', '', ''],
      ['Science Lab', '', '', '', '', ''],
    ]);

    const [practicalData, setPracticalData] = useState([
      ['Fieldwork', '', '', '', '', ''],
      ['Practical', '', '', '', '', ''],
    ]);

    const [projectUnitData, setProjectUnitData] = useState([
      ['Project Unit', '', '', '', '', ''],
    ]);

    const [teachingRelatedDuties, setTeachingRelatedDuties] = useState(Array(6).fill(0));

    const [staffNames, setStaffNames] = useState (['', '', '', '', '']); 

    const [standardAllocationData, setStandardAllocationData] = useState([
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      [null, null, null, null, null, null],
      ['-', '-', '-', '-', '-', '-'],
    ]);
  
    const [practicalFieldworkAllocation, setPracticalFieldworkAllocation] = useState([
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      [null, null],
      ['-', '-'],
    ]);

    const [projectUnitsAllocation, setProjectUnitsAllocation] = useState([
      [null],
      [null],
      [null],
      [null],
      [null],
      ['-'],
    ]);

    const [teachingDutiesAllocation, setTeachingDutiesAllocation] = useState([
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      [null, null, null, null, null, null, null],
      ['-', '-', '-', '-', '-', '-', '-',]
    ]);

    const handleSave = (staffAllocationData) => { 
      if (validateUnitInformation(data[0])){
        setShowModal(true);
      }
    };
  
    const validateUnitInformation = (unit) => {
      for (const key in unit){
        if (unit[key].trim() == ''){
          setErrorMessage("Please fill out all fields for Unit Information");
          setErrorModal(true);
          return false;
        }
      }
      return true; 
    }; 

    const createTeachingStaffList = (staffNames, standardAllocationData) => {
      const teachingDeliveryTypes = [
        'Lecture',
        'Seminar',
        'Workshop',
        'Tutorial',
        'Computer Lab',
        'Science Lab',
      ];
    
      const fieldworkTypes = [
        'Fieldwork',
        'Practical',
      ];

      const teachingStaffList = staffNames.map((staffName, index) => {
        const standardAllocations = standardAllocationData[index].map((value, i) => {
          return {
            total: value,
            type: teachingDeliveryTypes[i % teachingDeliveryTypes.length],
          };
        });

        const fieldworkAllocations = practicalFieldworkAllocation[index].map((value, i) => {
          return {
            total: value || 0, 
            type: fieldworkTypes[i % fieldworkTypes.length],
            tuitionPatternFrequency: "", 
            tuitionPatternHours: 0, 
            staffAllocatedHours: 0, 
          }
        })
    
        //this const is no longer needed
        const teachingAllocations = teachingDutiesAllocation[index].map((value, i) => {
          return {  
            total: value || 0,   
            unitCoordination: 0,  
            preparation: 0,  
            consultation: 0,  
            marking: 0,   
            moderation: 0,   
            coAssessorDuties: 0,  
            other: 0,           
          }
        })

        const formatTRDAllocations = (teachingDutiesAllocation) => {
          return {
            unitCoordination: teachingDutiesAllocation[0] || 0,
            preparation: teachingDutiesAllocation[1] || 0,
            consultation: teachingDutiesAllocation[2] || 0,
            marking: teachingDutiesAllocation[3] || 0,
            moderation: teachingDutiesAllocation[4] || 0,
            coAssessorDuties: teachingDutiesAllocation[5] || 0,
          };
        };

        const trdAllocations = formatTRDAllocations(teachingDutiesAllocation[index]);

        const projectAllocations = projectUnitsAllocation[index].map((value, i) => {
          return{ 
            projectAllocation: value || 0,
          }
        })

        return {
          staffName: staffName || '',
          tdAllocations: [...standardAllocations, ...fieldworkAllocations], 
          trdAllocations: trdAllocations, 
          projectAllocation: projectUnitsAllocation[index][0] || 0,  
        };
      });
    
      return teachingStaffList;
    };

    const handleConfirmSave = async () => { //If confirm is pressed in modal, user will be taken back to admin unit page
      const formattedStandardContact = standardContactData.map((contact) => {
        return{
          type: contact[0],
          tuitionPatternHours: contact[1] || 0, 
          tuitionPatternFrequency: contact[2], 
          totalCount: contact[3] || 0, 
          duplicateClasses: contact[4] || 0,
        };
      });

      const formattedPracticals = practicalData.map((practical) => {
        return{
          type: practical[0],
          tuitionPatternHours: practical[1] || 0,
          tuitionPatternFrequency: practical[2], 
          noStaff: practical[3] || 0, 
          hoursPerStaff: practical[4] || 0,
        };
      })

      const formatTeachingRelatedDuties = (teachingRelatedDuties) => { 
        return {
          unitCoordination: teachingRelatedDuties[0] || 0,
          preparation: teachingRelatedDuties[1] || 0,
          consultation: teachingRelatedDuties[2] || 0,
          marking: teachingRelatedDuties[3] || 0,
          moderation: teachingRelatedDuties[4] || 0,
          coAssessorDuties: teachingRelatedDuties[5] || 0,
          other: teachingRelatedDuties[6] || 0,
        };
      }

      const formattedProjectUnit = {
        parameter: projectUnitData[0][1] || 0, 
        isProjectUnit: projectUnitData[0][2] == 'Yes', 
        noStudentsPerProject: projectUnitData[0][3] || 0,
        noProjects: projectUnitData[0][4] || 0,
      };

      const teachingStaff = createTeachingStaffList(staffNames, standardAllocationData); 
      const formattedTeachingRelatedDuties = formatTeachingRelatedDuties(teachingRelatedDuties); 
      
      const updatedUnit = {
        ...data[0], 
        standardTDs: formattedStandardContact, 
        fieldWorks: formattedPracticals,
        projectUnit: formattedProjectUnit,
        teachingRelatedDuties: formattedTeachingRelatedDuties, 
        teachingStaff: teachingStaff, 
      };

      console.log("Updated unit:",updatedUnit);
      console.log("Staff names:", staffNames);
      console.log("StandardAllocatoinData: ", standardAllocationData)

      //MAKE HTTPPOST REQUEST HERE
      try{
        const response = await fetch ('/api/unit', {
          method: 'POST', 
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(updatedUnit),
        }); 

        console.log("Sending JSON data:", JSON.stringify(updatedUnit, null, 2));

        if (!response.ok){
          console.log("Error!"); 
          if (response.status == 400){
            setErrorMessage("One or more users do not exist", response.text());
            response.text().then((text) => {
              console.log("Response Text:", text);
            });
            setErrorModal(true);
          }
        }

        if (response.ok){
          console.log("Response is ok");
          setShowModal(false);
          navigate('/adminunitpage');
        }

      } catch (error) {
        console.error('Error:', error);
      }

      /*
      setShowModal(false);
      navigate('/adminunitpage');*/
    };
  
    const handleCancelSave = () => {
      setShowModal(false);
    };
  
    const handleClose = () => { //If close is pressed, user will be taken back to admin unit page
      navigate('/adminunitpage');
    };
  
    return (
      <>
        <div className="table-wrapper-style">
          <UnitInformation unit={unit} onUnitChange={(newUnit) => setData([newUnit])}/>
        </div>
        <TDRTable standardContactData={standardContactData} setStandardContactData={setStandardContactData} onSave={handleSave}
        practicalData={practicalData} setPracticalData={setPracticalData}
        projectUnitData={projectUnitData} setProjectUnitData={setProjectUnitData} teachingRelatedDuties={teachingRelatedDuties}
        setTeachingRelatedDuties={setTeachingRelatedDuties}/>

        <TeachingTeamAllocationTable standardAllocationData={standardAllocationData} setStandardAllocationData={setStandardAllocationData}
        onSave={handleSave} staffNames={staffNames} setStaffNames={setStaffNames} practicalFieldworkAllocation={practicalFieldworkAllocation}
        setPracticalFieldworkAllocation={setPracticalFieldworkAllocation} projectUnitsAllocation={projectUnitsAllocation}
        setProjectUnitsAllocation={setProjectUnitsAllocation} teachingDutiesAllocation={teachingDutiesAllocation} 
        setTeachingDutiesAllocation={setTeachingDutiesAllocation} unit={unit} standardContactData={standardContactData} practicalData={practicalData}
        teachingRelatedDuties={teachingRelatedDuties} projectUnitData={projectUnitData}
        />

        <div style={{ display:'flex', marginTop: '1rem', marginLeft: "1100px" }}>
          <Button onClick={handleClose} color="grey">Close</Button>
          <Button onClick={handleSave}  style={{ marginLeft: '0.5rem', backgroundColor:"#2c75e2", color: "white" }}>Save</Button>
        </div>

        <ConfirmationModal
          showModal={showModal}
          handleClose={handleClose}
          handleCancelSave={handleCancelSave}
          handleConfirmSave={handleConfirmSave}
        />
    
        <ErrorModal
          showErrorModal={showErrorModal}
          setErrorModal={setErrorModal}
          error={error}
        />
      </>
    );
  };
  
  const Main = () => {
    const [data, setData] = useState(initialData);

    return (
      <Container>
        <DataTables data={data} setData={setData}/>
      </Container>
    );
  };
  
  export default Main;