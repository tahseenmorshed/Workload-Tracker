import { render, screen, fireEvent } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import Sidebar from './Sidebar';

// Mock the localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock the API call for fetching units
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ code: 'U1', name: 'Unit 1' }, { code: 'U2', name: 'Unit 2' }]),
  }),
);

describe('Sidebar', () => {
  beforeEach(() => {
    localStorageMock.getItem.mockReturnValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEyMyIsImlhdCI6MTYxNjg5MDIwMn0.-ryGt1J7LO1hfKt_-KaqfPGGd_GxN7p3qoUKYF7K1y4'
    );
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders the Sidebar with menu items', () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );

    expect(screen.getByText('Admin')).toBeInTheDocument();
    expect(screen.getByText('Admin Unit Page')).toBeInTheDocument();
    expect(screen.getByText('Admin Staff Page')).toBeInTheDocument();
    expect(screen.getByText('Summary Page')).toBeInTheDocument();
    expect(screen.getByText('Unit Summary Page')).toBeInTheDocument();
    expect(screen.getByText('My Units')).toBeInTheDocument();
  });

  it('changes the selected menu item on click', () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );

    const adminUnitPageMenuItem = screen.getByTestId('menu-item-Admin Unit Page');
    const adminStaffPageMenuItem = screen.getByTestId('menu-item-Admin Staff Page');

    fireEvent.click(adminUnitPageMenuItem);
    expect(adminUnitPageMenuItem).toHaveClass('active');

    fireEvent.click(adminStaffPageMenuItem);
    expect(adminStaffPageMenuItem).toHaveClass('active');
    expect(adminUnitPageMenuItem).not.toHaveClass('active');
  });

  it('renders fetched units as menu items', async () => {
    render(
      <Router>
        <Sidebar />
      </Router>
    );

    const unit1MenuItem = await screen.findByText('Unit 1');
    const unit2MenuItem = await screen.findByText('Unit 2');

    expect(unit1MenuItem).toBeInTheDocument();
    expect(unit2MenuItem).toBeInTheDocument();
  });
  
  it('does not render the Sidebar when the user is not logged in', () => {
    localStorageMock.getItem.mockReturnValue(null);

    const { container } = render(
      <Router>
        <Sidebar />
      </Router>
    );

    expect(container.querySelector('.sidebar')).toBeNull();
  });

  it('renders the Sidebar when the user is logged in', () => {
    localStorageMock.getItem.mockReturnValue(
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1laWRlbnRpZmllciI6IjEyMyIsImlhdCI6MTYxNjg5MDIwMn0.-ryGt1J7LO1hfKt_-KaqfPGGd_GxN7p3qoUKYF7K1y4'
    );

    const { container } = render(
      <Router>
        <Sidebar />
      </Router>
    );

    expect(container.querySelector('.sidebar')).toBeInTheDocument();
  });
});
