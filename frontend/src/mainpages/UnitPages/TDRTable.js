import React from 'react';
import { Table } from 'semantic-ui-react';
import './styles.css';

const TableRowComponent = ({ label, rowData }) => (
  <Table.Row>
    {label && (
      <Table.Cell
        style=
        {{
          textAlign: 'left',
          fontSize: '16px',
          fontWeight: 'bold',
        }}
      >
        {label}
      </Table.Cell>
    )}
    {rowData.map((cell, index) => (
      <Table.Cell key={index} style={{ fontSize: '16px' }}>
        {cell}
      </Table.Cell>
    ))}
  </Table.Row>
);

const TDRTable = ( {unit}) => {

  const standardContacts = unit && unit.standardTDs ? unit.standardTDs :[]; 
    //formatting and initialising the standard contacts
    const createFormattedArray = (type) => {
      const contact = standardContacts.find(sc => sc.type === type);
      if (contact) {
        const totalHours = contact.tuitionPatternHours * (contact.duplicateClasses) * contact.totalCount; 
        return [
          contact.type,
          contact.tuitionPatternHours,
          contact.tuitionPatternFrequency,
          contact.totalCount, 
          contact.duplicateClasses, 
          totalHours, 
        ];
      }
      return [type, 0, '', 0, 0, 0];
    };
    
    const processStandardContacts = () => {
      const types = ['Lecture', 'Seminar', 'Workshop', 'Tutorial', 'Computer Lab', 'Science Lab'];
      return types.map(createFormattedArray);
    };
    
  const standardContact = processStandardContacts();
  console.log("standard contacts: ", standardContact);


  //formatting and initialising the practical/fieldworks
  const practicals = unit && unit.fieldworks ? unit.fieldworks : []; 
  const createFormattedPracticalsArray = (type) => {
    const prac = practicals.find(p => p.type === type);
    if (prac) {
      const totalHours = prac.noStaff * prac.hoursPerStaff; 
      return [
        prac.type,
        prac.tuitionPatternHours,
        prac.tuitionPatternFrequency,
        prac.noStaff, 
        prac.hoursPerStaff, 
        totalHours, 
      ];
    }
    return [type, 0, '', 0, 0, ''];
  };
  
  const processPracticals = () => {
    const types = ['Fieldwork', 'Practical'];
    return types.map(createFormattedPracticalsArray);
  };
  const practical = processPracticals(); 

  const TRDs = unit && unit.teachingRelatedDuties ? unit.teachingRelatedDuties : []; 
  const processTRD = () => {
    return[
      {label: "Unit Coordination", value: TRDs.unitCoordination},
      {label: "Preparation", value: TRDs.preparation},
      {label: "Consulting", value: TRDs.consultation},
      {label: "Marking", value: TRDs.marking},
      {label: "Moderation", value: TRDs.moderation},
      {label: "Co-Assessor Duties", value: TRDs.coAssessorDuties},
      {label: "Other", value: TRDs.other},
      {label: "Total Teaching Related Duties", value: TRDs.unitCoordination+TRDs.preparation+TRDs.consultation+TRDs.marking+TRDs.moderation+TRDs.coAssessorDuties+TRDs.other},
    ]
  }

  const TRD = processTRD();
  console.log("TESTING TRD: ", TRD)

  const projectUnit = [
    ['Project Unit', 
     unit?.projectUnit?.parameter || '', 
     unit?.projectUnit?.parameter ? 'Yes' : 'No', 
     unit?.projectUnit?.noStudentsPerProject || '', 
     unit?.projectUnit?.noProjects || 0, 
     (unit?.projectUnit?.parameter && unit?.projectUnit?.noProjects) ? unit.projectUnit.parameter * unit.projectUnit.noProjects : 0
    ],
  ]

  // Calculate total hours from standardContact and practical
  const totalTDHours = [...standardContact, ...practical].reduce((total, row) => total + (row[5] || 0), 0);

  // Calculate total hours from TRD, excluding the last value
  const totalTRDHours = TRD.slice(0, -1).reduce((total, row) => total + (row.value || 0), 0);

  // Extract the total hours from the last element in projectUnit
  const projectUnitHours = projectUnit[0][5] || 0;

  // Calculate total TD and TRD hours, including projectUnitHours
  const totalTDAndTRDHours = totalTDHours + totalTRDHours + projectUnitHours;

  return (
    <div className="teaching-table-format">
      <Table compact celled striped structured>
        <Table.Header>
          <Table.Row
            style={{
              fontSize: '16px',
              textAlign: 'center',
              fontWeight: 'bold',
            }}
          >
            <Table.HeaderCell colSpan="5">Teaching Delivery</Table.HeaderCell>
            <Table.HeaderCell>Total:</Table.HeaderCell>
          </Table.Row>
          <Table.Row style={{ fontSize: '16px', textAlign: 'center' }}>
            <Table.HeaderCell rowSpan="3" style={{ textDecoration: 'underline' }}>
              Standard Contact
            </Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Hours</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Occurrence</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Frequency</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">No. of same class per week</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">TD:</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body style={{ textAlign: 'center' }}>
          {standardContact.map((rowData, index) => 
          (
            <TableRowComponent key={index} label={rowData[0]} rowData={rowData.slice(1)} />
          ))}
        </Table.Body>

        <Table.Header>
        <Table.Row style={{ fontSize: '16px', textAlign: 'center' }}>
            <Table.HeaderCell rowSpan="3" style={{ textDecoration: 'underline' }}>
              Fieldwork/Practical 
            </Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Hours</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Occurrence</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">No. Staff</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Hour per Staff</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">TD:</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body style={{ textAlign: 'center' }}>
          {practical.map((rowData, index) => 
          (
            <TableRowComponent key={index} label={rowData[0]} rowData={rowData.slice(1)} />
          ))}
        </Table.Body>


        <Table.Header>
        <Table.Row style={{ fontSize: '16px', textAlign: 'center' }}>
            <Table.HeaderCell rowSpan="3" style={{ textDecoration: 'underline' }}>
              Project Unit 
            </Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Parameter</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Project?</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Student per project</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Projects</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">TD:</Table.HeaderCell>
          </Table.Row>
        </Table.Header>


        <Table.Body style={{ textAlign: 'center' }}>
          {projectUnit.map((rowData, index) => 
          (
            <TableRowComponent key={index} label={rowData[0]} rowData={rowData.slice(1)} />
          ))}
        </Table.Body>


        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="5" style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
              Teaching Related Duties
            </Table.HeaderCell>
            <Table.HeaderCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>TRD:</Table.HeaderCell>
          </Table.Row>
        </Table.Header>


        <Table.Body>
          {TRD.map((row, index) => (
            <Table.Row key={index}>
              <Table.Cell
                colSpan={row.colspan || 5}
                style={{ fontSize: '16px', textAlign: 'left', fontWeight: 'bold' }}
              >
                {row.label}
              </Table.Cell>
              <Table.Cell
                colSpan={row.colspan ? 1 : undefined}
                style={{ fontSize: '16px', textAlign: 'center' }}
              >
                {row.value}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>            

        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="5" style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
              Total TD + TRD (hours)
            </Table.HeaderCell>
            <Table.HeaderCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>{totalTDAndTRDHours}</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

      </Table>
    </div>
  );
};

export default TDRTable;