import React, {useState, useEffect} from 'react';
import { useParams } from 'react-router-dom';
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
import { useRef } from 'react'; 

  
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
    console.log("This is inside the data table: ", unit)
    const [showModal, setShowModal] = useState(false);
    const [showErrorModal, setErrorModal] = useState(false);
    const [error, setErrorMessage] = useState('');
    const navigate = useNavigate();
    
    const getStandardTDDataByType = (type) => {
      if (unit.standardTDs) {
        const td = unit.standardTDs.find(td => td.type === type);
        if (td) {
          return [td.tuitionPatternHours, td.tuitionPatternFrequency, td.totalCount, td.duplicateClasses, td.tuitionPatternHours*td.totalCount*td.duplicateClasses];
        }
      }
      return [null, null, null, null, null];
    }
    
    const [standardContactData, setStandardContactData] = useState([
      ['Lecture', ...getStandardTDDataByType('Lecture')],
      ['Seminar', ...getStandardTDDataByType('Seminar')],
      ['Workshop', ...getStandardTDDataByType('Workshop')],
      ['Tutorial', ...getStandardTDDataByType('Tutorial')],
      ['Computer Lab', ...getStandardTDDataByType('Computer Lab')],
      ['Science Lab', ...getStandardTDDataByType('Science Lab')],
    ]);

    const getFieldworkDataByType = (type) => {
      if (unit.fieldworks) {
        const fieldwork = unit.fieldworks.find(fw => fw.type === type);
        if (fieldwork) {
          return [fieldwork.tuitionPatternHours, fieldwork.tuitionPatternFrequency, fieldwork.noStaff, fieldwork.hoursPerStaff, fieldwork.noStaff*fieldwork.hoursPerStaff];
        }
      }
      return ['', '', '', '', ''];
    }
    
    const [practicalData, setPracticalData] = useState([
      ['Fieldwork', ...getFieldworkDataByType('Fieldwork')],
      ['Practical', ...getFieldworkDataByType('Practical')],
    ]);

    const [projectUnitData, setProjectUnitData] = useState([
      ['Project Unit', 
       unit?.projectUnit?.parameter || '', 
       unit?.projectUnit?.isProjectUnit ? 'Yes' : 'No', 
       unit?.projectUnit?.noStudentsPerProject || '', 
       unit?.projectUnit?.noProjects || 0, 
       (unit?.projectUnit?.parameter && unit?.projectUnit?.noProjects) ? unit.projectUnit.parameter * unit.projectUnit.noProjects : 0
      ],
    ]);

    //const [teachingRelatedDuties, setTeachingRelatedDuties] = useState(Array(6).fill(''));
    const [teachingRelatedDuties, setTeachingRelatedDuties] = useState([
      unit.teachingRelatedDuties?.unitCoordination || 0,
      unit.teachingRelatedDuties?.preparation || 0,
      unit.teachingRelatedDuties?.consultation || 0,
      unit.teachingRelatedDuties?.marking || 0,
      unit.teachingRelatedDuties?.moderation || 0,
      unit.teachingRelatedDuties?.coAssessorDuties || 0,
      unit.teachingRelatedDuties?.other || 0
    ]);

    const [staffNames, setStaffNames] = useState(
      unit.teachingStaff
        ? unit.teachingStaff.map(staff => staff.staffName ? staff.staffName : '')
        : []
    );

    const getAllocationTotal = (staffIndex, allocationIndex) => {
      const allocationTypes = ['Lecture', 'Seminar', 'Workshop', 'Tutorial', 'Computer Lab', 'Science Lab', 'Fieldwork', 'Practical'];
      if (unit.teachingStaff && staffIndex < unit.teachingStaff.length) {
        const staff = unit.teachingStaff[staffIndex];
        if (staff) {
          const allocation = staff.tdAllocations.find(allocation => allocation.type === allocationTypes[allocationIndex]);
          return allocation ? allocation.total : 0;
        }
      }
      return '';
    }

    const calculateStandardSum = (index) => 
    {
      const sum = getAllocationTotal(0,index)+getAllocationTotal(1,index)+getAllocationTotal(2,index)+getAllocationTotal(3,index)+getAllocationTotal(4,index)
      //return sum;
    };

    const [standardAllocationData, setStandardAllocationData] = useState([
      [getAllocationTotal(0,0), getAllocationTotal(0,1), getAllocationTotal(0,2), getAllocationTotal(0,3), getAllocationTotal(0,4), getAllocationTotal(0,5)],
      [getAllocationTotal(1,0), getAllocationTotal(1,1), getAllocationTotal(1,2), getAllocationTotal(1,3), getAllocationTotal(1,4), getAllocationTotal(1,5)],
      [getAllocationTotal(2,0), getAllocationTotal(2,1), getAllocationTotal(2,2), getAllocationTotal(2,3), getAllocationTotal(2,4), getAllocationTotal(2,5)],
      [getAllocationTotal(3,0), getAllocationTotal(3,1), getAllocationTotal(3,2), getAllocationTotal(3,3), getAllocationTotal(3,4), getAllocationTotal(3,5)],
      [getAllocationTotal(4,0), getAllocationTotal(4,1), getAllocationTotal(4,2), getAllocationTotal(4,3), getAllocationTotal(4,4), getAllocationTotal(4,5)],
      [calculateStandardSum(0), calculateStandardSum(1), calculateStandardSum(2), calculateStandardSum(3), calculateStandardSum(4), calculateStandardSum(5)]
    ]);

    const [practicalFieldworkAllocation, setPracticalFieldworkAllocation] = useState([
      [getAllocationTotal(0,6), getAllocationTotal(0,7)],
      [getAllocationTotal(1,6), getAllocationTotal(1,7)],
      [getAllocationTotal(2,6), getAllocationTotal(2,7)],
      [getAllocationTotal(3,6), getAllocationTotal(3,7)],
      [getAllocationTotal(4,6), getAllocationTotal(4,7)],
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


    const getTRDAllocation = (staffIndex, allocationIndex) => {
      const trdAllocationTypes = ['unitCoordination', 'preparation', 'consultation', 'marking', 'moderation', 'coAssessorDuties', 'other'];
      const staffMember = unit.teachingStaff[staffIndex];
      const allocationType = trdAllocationTypes[allocationIndex];

      // Safely access properties using optional chaining.
      return staffMember?.trdAllocations?.[allocationType] ?? 0;
    }

    const [teachingDutiesAllocation, setTeachingDutiesAllocation] = useState([
      [getTRDAllocation(0,0), getTRDAllocation(0,1), getTRDAllocation(0,2), getTRDAllocation(0,3), getTRDAllocation(0,4), getTRDAllocation(0,5), getTRDAllocation(0,6),],
      [getTRDAllocation(1,0), getTRDAllocation(1,1), getTRDAllocation(1,2), getTRDAllocation(1,3), getTRDAllocation(1,4), getTRDAllocation(1,5), getTRDAllocation(1,6),],
      [getTRDAllocation(2,0), getTRDAllocation(2,1), getTRDAllocation(2,2), getTRDAllocation(2,3), getTRDAllocation(2,4), getTRDAllocation(2,5), getTRDAllocation(2,6),],
      [getTRDAllocation(3,0), getTRDAllocation(3,1), getTRDAllocation(3,2), getTRDAllocation(3,3), getTRDAllocation(3,4), getTRDAllocation(3,5), getTRDAllocation(3,6),],
      [getTRDAllocation(4,0), getTRDAllocation(4,1), getTRDAllocation(4,2), getTRDAllocation(4,3), getTRDAllocation(4,4), getTRDAllocation(4,5), getTRDAllocation(4,6),],
      ['-', '-', '-', '-', '-', '-', '-']
    ]);


    const handleSave = (staffAllocationData) => { 
      setShowModal(true);
    };
  
    const validateUnitInformation = (unit) => {
      console.log("Validating")
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

      const teachingDutyTypes = [
        'Unit Coordination', 
        'Preparation', 
        'Consultation', 
        'Marking', 
        'Moderation', 
        'Co-assessor duties', 
        'Other', 
        'Total allocated teaching related duties'
      ]
    
      const teachingStaffList = staffNames.map((staffName, index) => {
        const standardAllocations = standardAllocationData[index].map((value, i) => {
          return {
            total: value || 0,
            type: teachingDeliveryTypes[i % teachingDeliveryTypes.length],
            tuitionPatternFrequency: "", 
            tuitionPatternHours: 0, 
            staffAllocatedHours: 0, 
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
          staffName: staffName || null,
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

      const formattedProjectUnit = {
        isProjectUnit: projectUnitData[0][2] == 'Yes', 
        noStudentsPerProject: projectUnitData[0][3] || 0,
        noProjects: projectUnitData[0][4] || 0,
      };

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
      console.log("Teaching related duties", formattedTeachingRelatedDuties); 

      //MAKE HTTPPOST REQUEST HERE

      
      try{
        const response = await fetch ('/api/unit', {
          method: 'PUT', 
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

      setShowModal(false);
      navigate('/adminunitpage');
    
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
    const [isLoading, setIsLoading] = useState(true);
    const{unitCode} = useParams(); 

    //get unit data from backend by using unit code in the url
    useEffect(() => {
      const fetchData = async () => {
        const response = await fetch(`/api/Unit/GetUnitByCode/${unitCode}`);
        if (response.ok){
          const unit = await response.json();
          console.log("Unit: ", unit)
          console.log("Fieldworks: ", unit.fieldWorks)
          setData([unit]);
        } else {
          console.error('Error fetching unit data:', response.status, response.statusText);
        }
        setIsLoading(false);
      };
  
      fetchData();
    }, [unitCode]);
  
    if (isLoading) {
      return <div>Loading...</div>;
    }

    return (
      <Container>
        <DataTables data={data} setData={setData}/>
      </Container>
    );
  };

  
  export default Main;