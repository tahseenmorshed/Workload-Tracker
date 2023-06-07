import { Table, Dropdown } from 'semantic-ui-react';
import React, { useState } from 'react';
import './styles.css';

// TableRowComponent renders a table row with content-editable cells
// and a dropdown option for a specific cell if the row is related to a project unit
const TableRowComponent = ({ label, rowData, onCellChange, dropdownOptions, isProjectUnit}) => 
(
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
  {rowData.map((cell, index) => 
  (
    isProjectUnit && index === 1 ? 
    (
      <Table.Cell key={index} style={{ fontSize: '16px' }}>
        <Dropdown
          floating
          upward
          options={dropdownOptions}
          value={cell}
          onChange={(e, { value }) => onCellChange(index, value)}
        />
      </Table.Cell>
    ) : 
    (
      <Table.Cell
        key={index}
        style={{ fontSize: '16px' }}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => onCellChange(index, e.target.textContent)}
      >
        {cell}
      </Table.Cell>
    )
  ))}
</Table.Row>
);

// TDRTable is a functional component that renders a table for managing teaching-related information
const TDRTable = ({standardContactData, setStandardContactData, onSave, practicalData, setPracticalData, projectUnitData, setProjectUnitData, teachingRelatedDuties, setTeachingRelatedDuties}) => 
{
  /*
  const projectUnit = 
  [
    ['Project Unit', '', '', '', '', ''],
  ];*/

  const projectUnitOptions = 
  [
    { key: 'yes', text: 'Yes', value: 'Yes' },
    { key: 'no', text: 'No', value: 'No' },
    ];


  const calculateSum = (row) => 
  {
    const sum = parseFloat(row[1]) * parseFloat(row[3]) * parseFloat(row[4]);
    return isNaN(sum) ? 0 : sum.toFixed(1);
  };

  const calculatePracticalSum = (row) =>
  {
    const sum = parseFloat(row[3]) * parseFloat(row[4]); 
    return isNaN(sum) ? 0: sum.toFixed(1);
  }

  const calculateProjectUnitTD = (row) =>
  {
    const sum = parseFloat(row[1]) * parseFloat(row[4]);
    return isNaN(sum) ? 0: sum.toFixed(1);
  }

   // Functions for handling changes in different sections of the table
  const handleStandardContactChange = (rowIndex, cellIndex, value) => 
  {
    const newData = [...standardContactData];
    newData[rowIndex][cellIndex + 1] = value;

    // Update the 5th index with the sum of 1st, 3rd, and 4th indices
    newData[rowIndex][5] = calculateSum(newData[rowIndex]);

    setStandardContactData(newData);
  };

  const handlePracticalChange = (rowIndex, cellIndex, value) => 
  {
    const newData = [...practicalData];
    newData[rowIndex][cellIndex + 1] = value;
    newData[rowIndex][5] = calculatePracticalSum(newData[rowIndex]);
    setPracticalData(newData);
  };

  const handleProjectUnitChange = (rowIndex, cellIndex, value) => 
  {
    const newData = [...projectUnitData];
    newData[rowIndex][cellIndex + 1] = value;
    newData[rowIndex][5] = calculateProjectUnitTD(newData[rowIndex]);
    setProjectUnitData(newData);
  };

  const handleTRDChange = (index, value) => {
    const newValues = [...teachingRelatedDuties];
    newValues[index] = value;
    setTeachingRelatedDuties(newValues);
  };

  const calculateTotalTD = () => {
    const standardTotal = standardContactData.reduce(
      (acc, row) => acc + (row[5] ? parseFloat(row[5]) : 0),
      0
    );
    const practicalTotal = practicalData.reduce(
      (acc, row) => acc + (row[5] ? parseFloat(row[5]) : 0),
      0
    );
    const projectTotal = projectUnitData.reduce(
      (acc, row) => acc + (row[5] ? parseFloat(row[5]) : 0),
      0
    );

    return standardTotal + practicalTotal + projectTotal;
  };

  const calculateTotalTRD = () => {
    return teachingRelatedDuties.reduce((acc, curr) => {
      return acc + (isNaN(parseFloat(curr)) ? 0 : parseFloat(curr));
    }, 0);
  };


// Render the table with headers and rows for different teaching-related categories
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

        {/*Maps the standard contact data and ensures that the cells can be edited*/} 
        <Table.Body style={{textAlign: 'center'}}>
          {standardContactData.map((rowData, index) => (
            <TableRowComponent
              key={index}
              label={rowData[0]}
              rowData={rowData.slice(1)}
              onCellChange={(cellIndex, value) =>
                handleStandardContactChange(index, cellIndex, value) 
              }
            />
          ))}
        </Table.Body>

        <Table.Header>
        <Table.Row style={{ fontSize: '16px', textAlign: 'center' }}>
            <Table.HeaderCell rowSpan="3" style={{ textDecoration: 'underline' }}>
              Fieldwork/Practical 
            </Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Hours</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Occurrence</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">No. of Staff</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Hours per Staff</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">TD:</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        {/*Maps the practical data and ensures that the cells can be edited*/}
        <Table.Body style={{textAlign: 'center'}}>
          {practicalData.map((rowData, index) => (
          <TableRowComponent
            key={index}
            label={rowData[0]}
            rowData={rowData.slice(1)}
            onCellChange={(cellIndex, value) =>
              handlePracticalChange(index, cellIndex, value)
            }
          />
          ))}
        </Table.Body>

        <Table.Header>
        <Table.Row style={{ fontSize: '16px', textAlign: 'center' }}>
            <Table.HeaderCell rowSpan="3" style={{ textDecoration: 'underline' }}>
              Project Unit 
            </Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Parameter</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Project?</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Student</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">Projects</Table.HeaderCell>
            <Table.HeaderCell rowSpan="3">TD:</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        
        {/*Maps the project unit data and ensures that the cells can be edited*/}
        <Table.Body style={{textAlign: 'center'}}>
          {projectUnitData.map((rowData, index) => (
          <TableRowComponent
          key={index}
          label={rowData[0]}
          rowData={rowData.slice(1)}
          onCellChange={(cellIndex, value) =>
            handleProjectUnitChange(index, cellIndex, value) 
          }
          dropdownOptions={projectUnitOptions}
          isProjectUnit={true}
          />
          ))}
        </Table.Body>

        {/*Creates the TDR section of the table*/}
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="5" style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
              Teaching Related Duties
            </Table.HeaderCell>
            <Table.HeaderCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>TRD:</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
        <Table.Row>
                      <Table.Cell colSpan="5" style={{ fontSize: '16px', textAlign: 'left', fontWeight: 'bold' }}>Unit Coordination</Table.Cell>
                      <Table.Cell contentEditable colSpan="1" style={{ fontSize: '16px', textAlign: 'center' }} onBlur={(e) => handleTRDChange(0, e.target.textContent)}></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                      <Table.Cell colSpan="5" style={{ fontSize: '16px', textAlign: 'left', fontWeight: 'bold' }}>Preparation</Table.Cell>
                      <Table.Cell contentEditable colSpan="1" style={{ fontSize: '16px', textAlign: 'center' }} onBlur={(e) => handleTRDChange(1, e.target.textContent)}></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                      <Table.Cell colSpan="5" style={{ fontSize: '16px', textAlign: 'left', fontWeight: 'bold' }}>Consultation</Table.Cell>
                      <Table.Cell contentEditable colSpan="1" style={{ fontSize: '16px', textAlign: 'center' }} onBlur={(e) => handleTRDChange(2, e.target.textContent)}></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                      <Table.Cell colSpan="5" style={{ fontSize: '16px', textAlign: 'left', fontWeight: 'bold' }}>Marking</Table.Cell>
                      <Table.Cell contentEditable colSpan="1" style={{ fontSize: '16px', textAlign: 'center' }} onBlur={(e) => handleTRDChange(3, e.target.textContent)}></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                      <Table.Cell colSpan="5" style={{ fontSize: '16px', textAlign: 'left', fontWeight: 'bold' }}>Moderation</Table.Cell>
                      <Table.Cell contentEditable colSpan="1" style={{ fontSize: '16px', textAlign: 'center' }} onBlur={(e) => handleTRDChange(4, e.target.textContent)}></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                      <Table.Cell colSpan="5" style={{ fontSize: '16px', textAlign: 'left', fontWeight: 'bold' }}>Co-assessor duties</Table.Cell>
                      <Table.Cell contentEditable colSpan="1" style={{ fontSize: '16px', textAlign: 'center' }} onBlur={(e) => handleTRDChange(5, e.target.textContent)}></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                      <Table.Cell colSpan="5" style={{ fontSize: '16px', textAlign: 'left', fontWeight: 'bold' }}>Other e.g.</Table.Cell>
                      <Table.Cell contentEditable colSpan="1" style={{ fontSize: '16px', textAlign: 'center' }} onBlur={(e) => handleTRDChange(6, e.target.textContent)}></Table.Cell>
                  </Table.Row>
                  <Table.Row>
                      <Table.Cell colSpan="5" style={{ fontSize: '16px', textAlign: 'left', fontWeight: 'bold' }}>Total Teaching Related Duties:</Table.Cell>
                      <Table.Cell colSpan="1" style={{ fontSize: '16px', textAlign: 'center' }}>{calculateTotalTRD()}</Table.Cell>
                  </Table.Row>
              </Table.Body>

              <Table.Header>
            <Table.Row>
                  <Table.HeaderCell colSpan="5" style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>
                    Total TD + TRD (hours)
                  </Table.HeaderCell>
                <Table.HeaderCell style={{ textAlign: 'center', fontSize: '16px', fontWeight: 'bold' }}>{calculateTotalTRD()+calculateTotalTD()}</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

      </Table>
    </div>
  );
};

export default TDRTable;