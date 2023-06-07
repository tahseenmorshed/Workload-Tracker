import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import MainTable from './MainTable';

describe('MainTable', () => {
  beforeEach(() => {
    render(<MainTable />);
  });

  test('renders UnitInformation component', () => {
    expect(screen.getByText(/unit information/i)).toBeInTheDocument();
  });

  test('renders TDRTable component', () => {
    expect(screen.getByText(/teaching delivery requirements/i)).toBeInTheDocument();
  });

  test('renders TeachingTeamAllocationTable component', () => {
    expect(screen.getByText(/teaching team week allocation/i)).toBeInTheDocument();
  });

  test('opens confirmation modal on clicking Save button', () => {
    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);
    expect(screen.getByText(/confirm save/i)).toBeInTheDocument();
  });

  test('closes confirmation modal on clicking Cancel button', () => {
    const saveButton = screen.getByText(/save/i);
    fireEvent.click(saveButton);

    const cancelButton = screen.getByText(/cancel/i);
    fireEvent.click(cancelButton);
    expect(screen.queryByText(/confirm save/i)).not.toBeInTheDocument();
  });
});

describe('MainTable validation', () => {
    test('shows error modal when unit information is incomplete', () => {
      const { getByText } = render(<MainTable />);
  
      const saveButton = getByText('Save');
      fireEvent.click(saveButton);
  
      const errorModal = screen.getByText(
        'Please fill out all fields for Unit Information'
      );
      expect(errorModal).toBeInTheDocument();
    });
  
    test('does not show error modal when unit information is complete', () => {
      const { getByText, getByPlaceholderText } = render(<MainTable />);
  
      const coordinator = getByPlaceholderText('Enter coordinator');
      fireEvent.change(coordinator, { target: { value: 'Coordinator' } });
  
      const code = getByPlaceholderText('Enter unit code');
      fireEvent.change(code, { target: { value: 'ABC123' } });
  
      const teachingWeeks = getByPlaceholderText('Enter teaching weeks');
      fireEvent.change(teachingWeeks, { target: { value: '12' } });
  
      const creditPoints = getByPlaceholderText('Enter credit points');
      fireEvent.change(creditPoints, { target: { value: '6' } });
  
      const location = getByPlaceholderText('Enter location');
      fireEvent.change(location, { target: { value: 'Location' } });
  
      const workloadParameter = getByPlaceholderText('Enter workload parameter');
      fireEvent.change(workloadParameter, { target: { value: '100' } });
  
      const plannedHeadCount = getByPlaceholderText('Enter planned head count');
      fireEvent.change(plannedHeadCount, { target: { value: '150' } });
  
      const studyPeriod = getByPlaceholderText('Enter study period');
      fireEvent.change(studyPeriod, { target: { value: 'SP1' } });
  
      const saveButton = getByText('Save');
      fireEvent.click(saveButton);
  
      const errorModal = screen.queryByText(
        'Please fill out all fields for Unit Information'
      );
      expect(errorModal).not.toBeInTheDocument();
    });

    describe('MainTable updateUnit', () => {
        test('updates unit as expected', () => {
          const initialUnit = {
            coordinator: 'Coordinator',
            code: 'ABC123',
            teachingWeeks: '12',
            creditPoints: '6',
            location: 'Location',
            workloadParameter: '100',
            plannedHeadCount: '150',
            studyPeriod: 'SP1',
          };
      
          const expectedUpdatedUnit = {
            coordinator: 'New Coordinator',
            code: 'XYZ456',
            teachingWeeks: '14',
            creditPoints: '8',
            location: 'New Location',
            workloadParameter: '200',
            plannedHeadCount: '300',
            studyPeriod: 'SP2',
          };
      
          const updatedUnit = updateUnit(initialUnit);
      
          expect(updatedUnit).toEqual(expectedUpdatedUnit);
        });
      });

      describe('TeachingStaff structureTeachingStaff', () => {
        test('structures teaching staff correctly', () => {
          const unstructuredData = [
            const teachingStaff = () => {
                return {
                    user: {
                        name: "Jane Smith", 
                        role: "RoleHere", // Add appropriate role
                        email: "jane.smith@example.com", // Add appropriate email
                        staffID: "12345", // Add appropriate staff ID
                    }

                    tdAllocations: [
                        {
                          total: 5,
                          type: "Lecture"
                        }
                      ]
                }
            }
          ];
      
          const expectedTeachingStaff = [
            "teachingStaff": [
                {
                  "user": {
                    "name": "Jane Smith",
                  },
                  "tdAllocations": [
                    {
                      "total": 5,
                      "type": "Lecture"
                    }
                  ]
                }
              ]          ];
      
          const structuredTeachingStaff = structureTeachingStaff(unstructuredData);
      
          expect(structuredTeachingStaff).toEqual(expectedTeachingStaff);
        });
      });
  });