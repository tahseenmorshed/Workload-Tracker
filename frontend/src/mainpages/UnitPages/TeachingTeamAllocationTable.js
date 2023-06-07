import React from 'react';
import { useState } from 'react';
import { Table } from 'semantic-ui-react';

const TeachingTeamAllocationTable = ({unit}) => {
  console.log("TTAT: ", unit)

  const maxStaffMembers = 5;
  const filledStaffArray = [
    ...(unit?.teachingStaff || []),
    ...Array(maxStaffMembers - (unit?.teachingStaff?.length || 0)).fill({}),
  ];

const allocationTypes = ['Lecture', 'Seminar', 'Workshop', 'Tutorial', 'Computer Lab', 'Science Lab'];

const weekAllocation = filledStaffArray.map((staff) => {
  if (staff.tdAllocations) {
    const allocationByType = {};
    // Map each allocation to its type
    staff.tdAllocations.forEach((allocation) => {
      allocationByType[allocation.type] = allocation.total;
    });

    // Map each expected type to its total, or 0 if it doesn't exist
    return allocationTypes.map((type) => allocationByType[type] || 0);
  } else {
    // This staff member has no tdAllocations, so just fill in with 0.
    return Array(allocationTypes.length).fill(0);
  }
});

const transpose = (matrix) => {
  return matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));
};

/*
const transposedWeekAllocation = transpose(weekAllocation).map((row, index) => {
  // calculate sum of the row
  let sum = row.reduce((total, value) => total + value, 0);
  
  // retrieve corresponding standardTD item
  const standardTD = unit.standardTDs[row];
  // check if standardTD is available, then adjust sum
  if (standardTD) {
    sum = sum - standardTD.totalCount * standardTD.tuitionPatternHours * standardTD.duplicateClasses;
  }

  // return new row with adjusted sum appended
  return [...row, sum];
});*/ 

const standardTDsByType = (unit.standardTDs || []).reduce((map, td) => {
  map[td.type] = td;
  return map;
}, {});

const transposedWeekAllocation = transpose(weekAllocation).map((row, index) => {
  // calculate sum of the row
  let sum = row.reduce((total, value) => total + value, 0);
  
  // retrieve corresponding standardTD item
  const standardTD = standardTDsByType[allocationTypes[index]];
  // check if standardTD is available, then adjust sum
  if (standardTD) {
    sum -= standardTD.totalCount * standardTD.tuitionPatternHours * standardTD.duplicateClasses;
  }

  // return new row with adjusted sum appended
  return [...row, sum];
});

  console.log("Transposed week allocation:", transposedWeekAllocation)

  const fieldworkAllocations = filledStaffArray.map((staff) => {
    const allocation = staff.tdAllocations?.find((allocation) => allocation.type === 'Fieldwork');
    return allocation ? allocation.total : 0;
  });
  
  const practicalAllocations = filledStaffArray.map((staff) => {
    const allocation = staff.tdAllocations?.find((allocation) => allocation.type === 'Practical');
    return allocation ? allocation.total : 0;
  });
  
  /*
  const fieldworkSum = fieldworkAllocations.some((allocation) => allocation !== null)
  ? fieldworkAllocations.reduce((sum, allocation) => sum + (allocation || 0), 0) - (unit.fieldworks[0]?.noStaff * unit.fieldworks[0]?.hoursPerStaff || 0)
  : null;*/
  const fieldworkSum = fieldworkAllocations.some((allocation) => allocation !== null)
  ? fieldworkAllocations.reduce((sum, allocation) => sum + (allocation || 0), 0) - ((unit.fieldworks[0]?.noStaff || 0) * (unit.fieldworks[0]?.hoursPerStaff || 0))
  : null;

const practicalSum = practicalAllocations.some((allocation) => allocation !== null)
  ? practicalAllocations.reduce((sum, allocation) => sum + (allocation || 0), 0) - (unit.fieldworks[1]?.noStaff * unit.fieldworks[1]?.hoursPerStaff || 0)
  : null;

  const fieldworksByType = (unit.fieldworks || []).reduce((map, fw) => {
    map[fw.type] = fw;
    return map;
  }, {});
  
  
  const practicalFieldwork = [
    [
      ...fieldworkAllocations, 
      ...Array(maxStaffMembers - fieldworkAllocations.length).fill(null), 
      fieldworkAllocations.reduce((sum, allocation) => sum + (allocation || 0), 0) - 
      (fieldworksByType['Fieldwork']?.noStaff * fieldworksByType['Fieldwork']?.hoursPerStaff || 0)
    ],
    [
      ...practicalAllocations, 
      ...Array(maxStaffMembers - practicalAllocations.length).fill(null), 
      practicalAllocations.reduce((sum, allocation) => sum + (allocation || 0), 0) - 
      (fieldworksByType['Practical']?.noStaff * fieldworksByType['Practical']?.hoursPerStaff || 0)
    ],
  ];


const allocationTypesTRD = ["unitCoordination", "preparation", "consultation", "marking", "moderation", "coAssessorDuties", "other"];

const teachingDutiesData = filledStaffArray.map((staff) => {
  if (staff.trdAllocations) {
    const allocationByType = {};
    // Map each allocation to its type
    for (const type in staff.trdAllocations) {
      allocationByType[type] = staff.trdAllocations[type];
    }

    // Map each expected type to its total, or 0 if it doesn't exist
    return allocationTypesTRD.map((type) => allocationByType[type] || 0);
  } else {
    // This staff member has no trdAllocations, so just fill in with 0.
    return Array(allocationTypesTRD.length).fill(0);
  }
});

// transpose teachingDutiesData and calculate row sums
const transposedTeachingDutiesData = transpose(teachingDutiesData).map((row, index) => {
  // calculate sum of the row
  let sum = row.reduce((total, value) => total + value, 0);

  /* retrieve corresponding teachingRelatedDuties item
  const teachingRelatedDuties = unit.teachingRelatedDuties[allocationTypesTRD[index]];
  */
  const teachingRelatedDuties = unit && unit.teachingRelatedDuties
  ? unit.teachingRelatedDuties[allocationTypesTRD[index]]
  : null;


  // check if teachingRelatedDuties is available, then adjust sum
  if (teachingRelatedDuties) {
    sum -= teachingRelatedDuties;
  }

  // return new row with adjusted sum appended
  return [...row, sum];
});

  // Render cell content
  const renderCell = (value) => {
    if (value === null) return '';
    if (value === '-') return value;
    return value.toFixed(1);
  };

  // Cell styling
  const cellStyle = {
    textAlign: 'center',
    fontSize: '16px',
  };

  const sumsByType = weekAllocation.reduce((sums, allocations) => {
    allocations.forEach((value, index) => {
      sums[index] = (sums[index] || 0) + value;
    });
    return sums;
  }, []);

  console.log("Transposed teaching duties data: ", transposedTeachingDutiesData)

    // Define totalStaffAllocations array
  //const totalStaffAllocations = Array(6).fill(0);
  const [totalStaffAllocations,setTotalStaffAllocations] = useState([0,0,0,0,0,0])


  const StaffAllocations = Array(6).fill(0);
  // Add sums from transposedWeekAllocation
  transposedWeekAllocation.forEach(row => {
    row.forEach((value, index) => {
      totalStaffAllocations[index] += (value || 0);
    });
  });

  // Add sums from practicalFieldwork
  practicalFieldwork.forEach(row => {
    row.forEach((value, index) => {
      totalStaffAllocations[index] += (value || 0);
    });
  });

  // Add sums from transposedTeachingDutiesData
  transposedTeachingDutiesData.forEach(row => {
    row.forEach((value, index) => {
      totalStaffAllocations[index] += (value || 0);
    });
  });

  totalStaffAllocations[5] -= unit.projectUnit.parameter * unit.projectUnit.noProjects

  return (
    <div className="teaching-table-two">
      <Table compact celled striped structured>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell colSpan="7" style={{ textAlign: 'center', fontWeight: 'bold', fontSize: '16px' }}>Teaching Team Week Allocation</Table.HeaderCell>
          </Table.Row>
          <Table.Row style={{ fontSize: "16px", textAlign: "center" }}>
              {filledStaffArray.map((_, index) => (
                  <Table.HeaderCell key={index}>Staff {index + 1}</Table.HeaderCell>
                ))}
            <Table.HeaderCell>Allocation</Table.HeaderCell>
          </Table.Row>
          <Table.Row style={{ fontSize: '16px', textAlign: 'center' }}>
            {filledStaffArray.map((staff, index) => (
                <Table.HeaderCell key={index}>
                  {/*staff.user ? staff.user.name : 'N/A'*/}
                  {staff.staffName ? staff.staffName : 'N/A'}
                </Table.HeaderCell>
              ))}
            <Table.HeaderCell>Under/Over</Table.HeaderCell>

          </Table.Row>
        </Table.Header>
        <Table.Body>
          {/* Render week allocation rows */}
          {transposedWeekAllocation.map((row, rowIndex) => (
            <Table.Row key={rowIndex}>
              {row.map((cellValue, cellIndex) => (
                <Table.Cell
                  key={cellIndex}
                  style={
                    cellValue < 0
                      ? { ...cellStyle, color: 'red' }
                      : cellValue > 0
                      ? { ...cellStyle, color: 'blue' }
                      : { ...cellStyle, color: 'green' }
                  }
                >
                  {renderCell(cellValue)}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>

        <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan="6" style={{ textAlign: 'center', fontSize: '16px' }}>FieldWork/Practical</Table.HeaderCell>
            </Table.Row>
        </Table.Header>

        <Table.Body>
          {/* Render week allocation rows */}
          {practicalFieldwork.map((row, rowIndex) => (
            <Table.Row key={rowIndex}>
              {row.map((cellValue, cellIndex) => (
                <Table.Cell
                  key={cellIndex}
                  style={
                    cellValue < 0
                      ? { ...cellStyle, color: 'red' }
                      : cellValue > 0
                      ? { ...cellStyle, color: 'blue' }
                      : { ...cellStyle, color: 'green' }
                  }
                >
                  {renderCell(cellValue)}
                </Table.Cell>
              ))}
            </Table.Row>
          ))}
        </Table.Body>


        <Table.Header>
            <Table.Row>
                <Table.HeaderCell colSpan="6" style={{ textAlign: 'center', fontSize: '16px' }}>Teaching Related Duties</Table.HeaderCell>
            </Table.Row>
        </Table.Header>
   
    <Table.Body>
        {transposedTeachingDutiesData.map((row, rowIndex) => (
        <Table.Row key={rowIndex}>
            {row.map((cellValue, cellIndex) => (

            <Table.Cell
              key={cellIndex}
              style={
                cellValue < 0
                  ? { ...cellStyle, color: 'red' }
                  : cellValue > 0
                  ? { ...cellStyle, color: 'blue' }
                  : { ...cellStyle, color: 'green' }
              }
            >
              {renderCell(cellValue)}
            </Table.Cell>
            ))}
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

