import React, { useState } from 'react';
import { Table } from 'semantic-ui-react';

// TeachingTeamAllocationTable component renders a table for managing teaching team allocations
const TeachingTeamAllocationTable = ({standardAllocationData, setStandardAllocationData, onSave, staffNames, setStaffNames, practicalFieldworkAllocation, 
setPracticalFieldworkAllocation, projectUnitsAllocation, setProjectUnitsAllocation, teachingDutiesAllocation, setTeachingDutiesAllocation, 
unit, standardContactData, practicalData, teachingRelatedDuties, projectUnitData}) => {

  // Function to render cell content based on its value
  const renderCell = (value) => {
    if (value === null) return '';
    if (value === '-') return value;
    return value;
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
  

  const calculateTotalStaffAllocation = (colIndex) => {
    let sum = 0;
    for (let rowIndex = 0; rowIndex < standardAllocationData.length; rowIndex++) {
      let value = standardAllocationData[colIndex][rowIndex];
      if (typeof value === 'number') {
        sum += value;
      }
    }

    for (let rowIndex = 0; rowIndex < practicalFieldworkAllocation.length; rowIndex++) {
      let value = practicalFieldworkAllocation[colIndex][rowIndex];
      if (typeof value === 'number') {
        sum += value;
      }
    }

    for (let rowIndex = 0; rowIndex < 7; rowIndex++) {
      let value = teachingDutiesAllocation[colIndex][rowIndex];
      if (typeof value === 'number') {
        sum += value;
      }
    }

    if (colIndex == 5){
      const allocationSum= calculateTotalStaffAllocation(0)+calculateTotalStaffAllocation(1)+calculateTotalStaffAllocation(2)+calculateTotalStaffAllocation(3)+calculateTotalStaffAllocation(4)
      return allocationSum-calculateTotalTD()-calculateTotalTRD();
    }

    return sum;
  };

  const [totalStaffAllocations, setTotalStaffAllocations] = useState([
    [calculateTotalStaffAllocation(0)],
    [calculateTotalStaffAllocation(1)],
    [calculateTotalStaffAllocation(2)],
    [calculateTotalStaffAllocation(3)],
    [calculateTotalStaffAllocation(4)],
    [calculateTotalStaffAllocation(5)],
  ])
  
  //Function to handle cell blur event for standard contact data
  const handleCellBlur = (data, setData, rowIndex, columnIndex, e) => {
    const newValue = e.target.textContent;
    const newData = [...data];
    newData[columnIndex][rowIndex] = newValue === '' ? null : parseFloat(newValue);

    const sum = standardAllocationData[0][rowIndex]+standardAllocationData[1][rowIndex]+standardAllocationData[2][rowIndex]
                  +standardAllocationData[3][rowIndex]+standardAllocationData[4][rowIndex] - standardContactData[rowIndex][5];; 
    newData[5][rowIndex] = sum;

    setData(newData);

    setTotalStaffAllocations([
      [calculateTotalStaffAllocation(0)],
      [calculateTotalStaffAllocation(1)],
      [calculateTotalStaffAllocation(2)],
      [calculateTotalStaffAllocation(3)],
      [calculateTotalStaffAllocation(4)],
      [calculateTotalStaffAllocation(5)],
    ])

    console.log("new data:" ,newData)
  };
  
  /*
  const handleCellBlur = (data, setData, rowIndex, columnIndex, e) => {
    const newValue = e.target.textContent;
    const newData = [...data];
  
    // Ensure the column index and row index are valid
    if (newData[columnIndex] && newData[columnIndex][rowIndex]) {
      newData[columnIndex][rowIndex] = newValue === '' ? null : parseFloat(newValue);
    }
  
    const sum =
      (standardAllocationData[0][rowIndex] || 0) +
      (standardAllocationData[1][rowIndex] || 0) +
      (standardAllocationData[2][rowIndex] || 0) +
      (standardAllocationData[3][rowIndex] || 0) +
      (standardAllocationData[4][rowIndex] || 0) -
      (standardContactData[rowIndex][5] || 0);
  
    newData[5][rowIndex] = sum;
  
    setData(newData);
  
    setTotalStaffAllocations([
      [calculateTotalStaffAllocation(0)],
      [calculateTotalStaffAllocation(1)],
      [calculateTotalStaffAllocation(2)],
      [calculateTotalStaffAllocation(3)],
      [calculateTotalStaffAllocation(4)],
      [calculateTotalStaffAllocation(5)],
    ]);
  
    console.log("new data:", newData);
  };*/
  
  
  const handleCellBlurPractical = (data, setData, rowIndex, columnIndex, e) => {
    const newValue = e.target.textContent;
    const newData = [...data];
    newData[columnIndex][rowIndex] = newValue === '' ? null : parseFloat(newValue);

    const sum = practicalFieldworkAllocation[0][rowIndex]+practicalFieldworkAllocation[1][rowIndex]+practicalFieldworkAllocation[2][rowIndex]
                  +practicalFieldworkAllocation[3][rowIndex]+practicalFieldworkAllocation[4][rowIndex] - practicalData[rowIndex][5];; 
    newData[5][rowIndex] = sum;

    //newData[5][rowIndex] = practicalData[rowIndex][5];
    setData(newData);
    setTotalStaffAllocations([
      [calculateTotalStaffAllocation(0)],
      [calculateTotalStaffAllocation(1)],
      [calculateTotalStaffAllocation(2)],
      [calculateTotalStaffAllocation(3)],
      [calculateTotalStaffAllocation(4)],
      [calculateTotalStaffAllocation(5)],
    ])
  };

  const handleCellBlurTRD = (data, setData, rowIndex, columnIndex, e) => {
    const newValue = e.target.textContent;
    const newData = [...data];
    newData[columnIndex][rowIndex] = newValue === '' ? null : parseFloat(newValue);

    const sum = teachingDutiesAllocation[0][rowIndex]+teachingDutiesAllocation[1][rowIndex]+teachingDutiesAllocation[2][rowIndex]
                  +teachingDutiesAllocation[3][rowIndex]+teachingDutiesAllocation[4][rowIndex]; 
    newData[5][rowIndex] = sum - teachingRelatedDuties[rowIndex];

    //newData[5][rowIndex] = practicalData[rowIndex][5];
    setData(newData);
    setTotalStaffAllocations([
      [calculateTotalStaffAllocation(0)],
      [calculateTotalStaffAllocation(1)],
      [calculateTotalStaffAllocation(2)],
      [calculateTotalStaffAllocation(3)],
      [calculateTotalStaffAllocation(4)],
      [calculateTotalStaffAllocation(5)],
    ])
  };

  const handleStaffNameBlur = (staffIndex, e) => {
    const newStaffName = e.target.textContent; 
    const newStaffNames = [...staffNames]; 
    newStaffNames[staffIndex] = newStaffName;
    setStaffNames(newStaffNames); 

    const newStandardAllocationData = [...standardAllocationData]; 
    setStandardAllocationData(newStandardAllocationData); 

    const newPracticalFieldworkAllocation = [...practicalFieldworkAllocation]; 
    setPracticalFieldworkAllocation(newPracticalFieldworkAllocation); 

    const newProjectUnitAllocation = [...projectUnitsAllocation]; 
    setProjectUnitsAllocation(newProjectUnitAllocation); 

    const newTeachingDutiesAllocation = [...teachingDutiesAllocation];
    setTeachingDutiesAllocation(newTeachingDutiesAllocation); 
  }


  // Define the cell style object for table cell
  const cellStyle = {
    textAlign: 'center',
    fontSize: '16px',
  };

  // Render the table with headers and rows for different allocation categories
  return (
    <div className="teaching-table-two">
      <Table compact celled striped structured>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="7" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>Teaching Team Week Allocation</Table.HeaderCell>
          </Table.Row>
          <Table.Row style={{ fontSize: '16px', textAlign: 'center' }}>
            <Table.HeaderCell>Staff 1</Table.HeaderCell>
            <Table.HeaderCell>Staff 2</Table.HeaderCell>
            <Table.HeaderCell>Staff 3</Table.HeaderCell>
            <Table.HeaderCell>Staff 4</Table.HeaderCell>
            <Table.HeaderCell>Staff 5</Table.HeaderCell>
            <Table.HeaderCell>Allocation</Table.HeaderCell>
          </Table.Row>
          <Table.Row style={{ fontSize: '16px', textAlign: 'center' }}>
            <Table.HeaderCell contentEditable data-placeholder="Enter staff name" onBlur={(e) => handleStaffNameBlur(0, e)}></Table.HeaderCell>
            <Table.HeaderCell contentEditable data-placeholder="Enter staff name" onBlur={(e) => handleStaffNameBlur(1, e)}></Table.HeaderCell>
            <Table.HeaderCell contentEditable data-placeholder="Enter staff name" onBlur={(e) => handleStaffNameBlur(2, e)}></Table.HeaderCell>
            <Table.HeaderCell contentEditable data-placeholder="Enter staff name" onBlur={(e) => handleStaffNameBlur(3, e)}></Table.HeaderCell>
            <Table.HeaderCell contentEditable data-placeholder="Enter staff name" onBlur={(e) => handleStaffNameBlur(4, e)}></Table.HeaderCell>
            <Table.HeaderCell>Under/Over</Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        
        <Table.Body>
          {/* Iterate through columns in the standardAllocationData array */}
          {standardAllocationData[0].map((_, columnIndex) => (
            <Table.Row key={columnIndex}>
              {/* Iterate through rows in each column, rendering each cell */}
              {standardAllocationData.map((row, rowIndex) => {
                const cellValue = row[columnIndex];
                return (
                  <Table.Cell
                  key={rowIndex}
                  // Apply appropriate style based on cell value
                  style={
                    cellValue < 0 ? { ...cellStyle, color: 'red' } : cellStyle
                  }
                  // Make the cell editable
                  contentEditable
                  // When cell loses focus, update the corresponding weekAllocationData state
                  onBlur={(e) =>
                    handleCellBlur(standardAllocationData, setStandardAllocationData, columnIndex, rowIndex, e)
                  }
                >
                  {/* Render cell content using renderCell function */}
                  {renderCell(cellValue)}
                </Table.Cell>
              );
            })}
          </Table.Row>
        ))}

        </Table.Body>

        <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan="6" style={{ textAlign: 'center', fontSize: '16px' }}>FieldWork/Practical</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
          {/* Iterate through columns in the standardAllocationData array */}
          {practicalFieldworkAllocation[0].map((_, columnIndex) => (
            <Table.Row key={columnIndex}>
              {/* Iterate through rows in each column, rendering each cell */}
              {practicalFieldworkAllocation.map((row, rowIndex) => {
                const cellValue = row[columnIndex];
                return (
                  <Table.Cell
                  key={rowIndex}
                  // Apply appropriate style based on cell value
                  style={
                    cellValue < 0 ? { ...cellStyle, color: 'red' } : cellStyle
                  }
                  // Make the cell editable
                  contentEditable
                  // When cell loses focus, update the corresponding weekAllocationData state
                  onBlur={(e) =>
                    handleCellBlurPractical(practicalFieldworkAllocation, setPracticalFieldworkAllocation, columnIndex, rowIndex, e)
                  }
                >
                  {/* Render cell content using renderCell function */}
                  {renderCell(cellValue)}
                </Table.Cell>
              );
            })}
          </Table.Row>
        ))}
        </Table.Body>

        <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan="6" style={{ textAlign: 'center', fontSize: '16px' }}>Project Unit</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan="6" style={{ textAlign: 'center', fontSize: '16px' }}>Teaching Related Duties</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
   
    <Table.Body>
          {/* Iterate through columns in the standardAllocationData array */}
          {teachingDutiesAllocation[0].map((_, columnIndex) => (
            <Table.Row key={columnIndex}>
              {/* Iterate through rows in each column, rendering each cell */}
              {teachingDutiesAllocation.map((row, rowIndex) => {
                const cellValue = row[columnIndex];
                return (
                  <Table.Cell
                  key={rowIndex}
                  // Apply appropriate style based on cell value
                  style={
                    cellValue < 0 ? { ...cellStyle, color: 'red' } : cellStyle
                  }
                  // Make the cell editable
                  contentEditable
                  // When cell loses focus, update the corresponding weekAllocationData state
                  onBlur={(e) =>
                    handleCellBlurTRD(teachingDutiesAllocation, setTeachingDutiesAllocation, columnIndex, rowIndex, e)
                  }
                >
                  {/* Render cell content using renderCell function */}
                  {renderCell(cellValue)}
                </Table.Cell>
              );
            })}
          </Table.Row>
        ))}
        </Table.Body>


        <Table.Header>
          <Table.Row>
              <Table.HeaderCell colSpan="6" style={{ textAlign: 'center', fontSize: '16px' }}>Total Allocation</Table.HeaderCell>
          </Table.Row>
      </Table.Header>

      <Table.Body>
        <Table.Row>
            {totalStaffAllocations.map((allocation, index) => (
                <Table.Cell
                    key={index}
                    style={
                        allocation < 0
                        ? { ...cellStyle, color: 'red', fontSize: '20px' }
                        : allocation > 0
                        ? { ...cellStyle, color: 'blue', fontSize: '20px' }
                        : { ...cellStyle, color: 'green', fontSize: '20px' }
                    }
                >
                    {renderCell(allocation)}
                </Table.Cell>
            ))}
        </Table.Row>
    </Table.Body>

    </Table>
</div>
);
};
export default TeachingTeamAllocationTable;