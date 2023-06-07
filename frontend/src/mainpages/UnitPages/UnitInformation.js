import React from 'react';
import { Segment, Header } from 'semantic-ui-react';

const UnitInformation = ({ unit }) => {
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
      <Header className="custom-head">Unit Information</Header>

      <div className="left-column">
        <p>
          <span style={{ fontWeight: 'bold' }}>Unit Coordinator:</span> {unit.coordinator}
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>Unit Code:</span> {unit.code}
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>Teaching Weeks:</span> {unit.teachingWeeks}
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>Credit Points:</span> {unit.creditPoints}
        </p>
      </div>

      <div className="right-column">
        <p>
          <span style={{ fontWeight: 'bold' }}>Location:</span> {unit.location}
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>Predicted Headcount:</span> {unit.plannedHeadCount}
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>Parameter:</span> {unit.workloadParameter}
        </p>
        <p>
          <span style={{ fontWeight: 'bold' }}>Semester:</span> {unit.studyPeriod}
        </p>
      </div>
    </Segment>
  );
};

export default UnitInformation;