import React, { useState, useEffect } from 'react';
import { Segment, Header, Dropdown } from 'semantic-ui-react';

// UnitInformation component for displaying and editing unit details
const UnitInformation = (props) => {
  // Declare state for unit data, initializing with props
  const [unit, setUnit] = useState(props.unit);

// Update the unit state when props.unit changes
  useEffect(() => {
    setUnit(props.unit);
  }, [props.unit]);

  // Function to handle onBlur event on editable fields
  const handleFieldBlur = (field, e) => 
  {
    const newValue = e.target.textContent;
    const newUnit = { ...unit, [field]: newValue };
    setUnit(newUnit);
    props.onUnitChange(newUnit);
  };


  // Dropdown options for semester selection
  const semesterOptions = [
    { key: 's1', text: 'Semester 1', value: 'Semester 1' },
    { key: 's2', text: 'Semester 2', value: 'Semester 2' },
    { key: 't1', text: 'Trimester 1', value: 'Trimester 1' },
    { key: 't2', text: 'Trimester 2', value: 'Trimester 2' },
    { key: 't3', text: 'Trimester 3', value: 'Trimester 3' },
  ];

  // Dropdown options for location selection
  const locationOptions = [
    { key: 'bc', text: 'Bentley Campus', value: 'Bentley Campus' },
    { key: 'kc', text: 'Kalgoorie Campus', value: 'Kalgoorie Campus' },
    { key: 'pc', text: 'Perth City Campus', value: 'Perth City Campus' },
    { key: 'mi', text: 'Mursesk Institute', value: 'Mursesk Institute' },
    { key: 'gc', text: 'Geraldton Campus', value: 'Geraldton Campus' },
    { key: 'sc', text: 'Sarawak Campus', value: 'Sarawak Campus' },
    { key: 'sl', text: 'Sri Lanka Institute', value: 'Sri Lanka Institute' },
    { key: 'cm', text: 'Curtin Mauritius', value: 'Curtin Mauritius' },
    { key: 'di', text: 'Dubai Internl Academic City', value: 'Dubai Internl Academic City' },
    { key: 'ou', text: 'Open Universities', value: 'Open Universities' },
  ];

  // Dropdown options for parameter selection
  const parameterOptions = [
    { key: 'sd', text: 'Standard', value: 'Standard'},
    { key: 'an', text: 'Alternate', value: 'Alternate'},
  ];

  // Function to handle dropdown value change
  const handleDropdownChange = (field, value) => {
    const newUnit = { ...unit, [field]: value };
    setUnit(newUnit);
    props.onUnitChange(newUnit);

  };

  // Render the UnitInformation component
  return (
    <Segment
      size="medium"
      style={{
        borderWidth: '1px',
        borderColor: 'black',
        borderStyle: 'solid',
        width: '650px',
        height: '200px',
      }}
    >
      
      {/*<Header className="custom-head">Unit Information</Header>*/}
      <p>
          <span style={{ fontWeight: 'bold' }}>Unit Name:&nbsp;</span>
          <span contentEditable onBlur={(e) => handleFieldBlur('name', e)}>
            {unit.name}
          </span>
        </p>

      <div className="left-column">  
        {/* Display and edit Unit Coordinator */}
        <p>
          <span style={{ fontWeight: 'bold' }}>Unit Coordinator:&nbsp;</span>
          <span contentEditable onBlur={(e) => handleFieldBlur('coordinator', e)}>
            {unit.coordinator}
          </span>
        </p>
        {/* Display and edit Unit Coordinator */}
        <p>
          <span style={{ fontWeight: 'bold' }}>Unit Code:&nbsp;</span>
          <span contentEditable onBlur={(e) => handleFieldBlur('code', e)}>
            {unit.code}
          </span>
        </p>
        {/* Display and edit Teaching Weeks */}
        <p>
          <span style={{ fontWeight: 'bold' }}>Teaching Weeks:&nbsp;</span>
          <span contentEditable onBlur={(e) => handleFieldBlur('teachingWeeks', e)}>
            {unit.teachingWeeks}
          </span>
        </p>
        {/* Display and edit Credit Points */}
        <p>
          <span style={{ fontWeight: 'bold' }}>Credit Points:&nbsp;</span>
          <span contentEditable onBlur={(e) => handleFieldBlur('creditPoints', e)}>
            {unit.creditPoints}
          </span>
        </p>
      </div>

      <div className="right-column">
        {/* Display and edit Location using Dropdown */}
        <p>
          <span style={{ fontWeight: 'bold' }}>Location:&nbsp;</span>
          <Dropdown
            floating
            options={locationOptions}
            value={unit.location}
            onChange={(e, { value }) => handleDropdownChange('location', value)}
          />  
        </p>
        {/* Display and edit Predicted Headcount */}
        <p>
          <span style={{ fontWeight: 'bold' }}>Predicted Headcount:&nbsp;</span>
          <span contentEditable onBlur={(e) => handleFieldBlur('plannedHeadCount', e)}>
            {unit.plannedHeadCount}
          </span>
        </p>
        {/* Display and edit Parameter using Dropdown */}
        <p>
          <span style={{ fontWeight: 'bold' }}>Parameter:&nbsp;</span>
          <Dropdown
            floating
            options={parameterOptions}
            value={unit.workloadParameter}
            onChange={(e, { value }) => handleDropdownChange('workloadParameter', value)}
          />  
        </p>
        {/* Display and edit Semester using Dropdown */}
        <p>
        <span style={{ fontWeight: 'bold' }}>Semester:&nbsp;</span>
          <Dropdown
            floating
            options={semesterOptions}
            value={unit.studyPeriod}
            onChange={(e, { value }) => handleDropdownChange('studyPeriod', value)}
          />  
        </p>
      </div>
      </Segment>
  );
    }
    
export default UnitInformation;