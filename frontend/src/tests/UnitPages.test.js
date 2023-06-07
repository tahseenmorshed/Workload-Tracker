import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import MainUnitTable from '../mainpages/UnitSummaryPage/MainUnitPage';
import { BrowserRouter } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const mockUnitData = {
  code: 'COMP101',
  name: 'Introduction to Programming',
  teachingWeeks: 12,
  creditPoints: 6,
  coordinator: 'John Doe',
  workloadParameter: 'Standard',
  studyPeriod: '2023 S1',
  plannedHeadCount: 100,
  location: 'Main Campus',
};

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useParams: jest.fn(),
}));

global.fetch = jest.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve(mockUnitData),
  }),
);

beforeEach(() => {
  useParams.mockReturnValue({ unitCode: 'COMP101' });
  fetch.mockClear();
});

test('renders Main component and fetched data', async () => {
  render(
    <BrowserRouter>
      <Main />
    </BrowserRouter>
  );

  await waitFor(() => expect(fetch).toHaveBeenCalledTimes(1));

  expect(screen.getByText('Introduction to Programming')).toBeInTheDocument();
  expect(screen.getByText('COMP101')).toBeInTheDocument();
  expect(screen.getByText('2023 S1')).toBeInTheDocument();
  expect(screen.getByText('John Doe')).toBeInTheDocument();
  expect(screen.getByText('Main Campus')).toBeInTheDocument();
  
});
