import { render, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import Login from '../pages/Login';
import { BrowserRouter } from 'react-router-dom'
import { screen, configure } from '@testing-library/react'
import userEvent from '@testing-library/user-event'; 
import jwt from 'jsonwebtoken'
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute'

describe('LoginPage', () => {
    beforeEach(() => {
            render(<BrowserRouter><Login/></BrowserRouter>);
    });

    //TEST 1
    test('renders the login form', () => {
        const loginForm = screen.getByTestId('login-form');
        expect(loginForm).toBeInTheDocument();

        const usernameInput = screen.getByTestId(/username/i);
        expect(usernameInput).toBeInTheDocument();

        const passwordInput = screen.getByTestId(/password/i);
        expect(passwordInput).toBeInTheDocument();

        const submitButton = screen.getByRole('button', { name: /login/i });
        expect(submitButton).toBeInTheDocument();
    });


    //TEST 2
    test('submits the form with valid input values', async () => {
        // Mock the fetch function to simulate a successful login
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: true,
            text: () => Promise.resolve('fake-token'),
          })
        );
    
        // fill the input fields
        const usernameInput = screen.getByTestId('username-input');
        const passwordInput = screen.getByTestId('password-input');
    
        await userEvent.type(usernameInput, 'test-user');
        await userEvent.type(passwordInput, 'test-password');

        // press submit button
        const submitButton = screen.getByRole('button', { name: /login/i });
        userEvent.click(submitButton);

        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
    
        // checking the fetch function is called with expected values
        expect(global.fetch).toHaveBeenCalledWith('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: 'test-user', password: 'test-password' }),
        });
    
        global.fetch.mockRestore();
      });


      //TEST 3
      test('displays an error message when the server returns a non-OK response', async () => {
        //mocking the api call with a 401 response
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            status: 400,
          })
        );
      
        // Fill in the input fields
        const usernameInput = screen.getByTestId('username-input');
        const passwordInput = screen.getByTestId('password-input');
      
        await userEvent.type(usernameInput, 'test-user');
        await userEvent.type(passwordInput, 'test-password');
      
        const submitButton = screen.getByRole('button', { name: /login/i });
        userEvent.click(submitButton);
      
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
      
        expect(global.fetch).toHaveBeenCalledWith('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: 'test-user', password: 'test-password' }),
        });
      
        // checking the error message is displayed as expected
        const errorMessage = await screen.findByText('Incorrect username or password');
        expect(errorMessage).toBeInTheDocument();
      
        // Clean up the mock fetch function
        global.fetch.mockRestore();
    });

    //TEST 4
    test('displays an error message when the user inputs incorrect credentials', async () => {
        // mocking the api call for an incorrect login form
        global.fetch = jest.fn(() =>
          Promise.resolve({
            ok: false,
            status: 401,
            json: () => Promise.resolve({ error: 'Invalid credentials' }),
          })
        );
      
        const usernameInput = screen.getByTestId('username-input');
        const passwordInput = screen.getByTestId('password-input');
      
        await userEvent.type(usernameInput, 'incorrect-username');
        await userEvent.type(passwordInput, 'incorrect-password');
      
        const submitButton = screen.getByRole('button', { name: /login/i });
        userEvent.click(submitButton);
      
        await waitFor(() => expect(global.fetch).toHaveBeenCalled());
      
        expect(global.fetch).toHaveBeenCalledWith('/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ username: 'incorrect-username', password: 'incorrect-password' }),
        });
      
        const errorMessage = await screen.findByText('Incorrect username or password');
        expect(errorMessage).toBeInTheDocument();
      
        global.fetch.mockRestore();
    });

    //TEST 5
    const TestComponent = () => <div>Protected Content</div>;

    //mocking the json web tokens
    const secret = 'test-secret'; 

    const adminToken = jwt.sign(
    {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Admin',
    },
    secret,
    { expiresIn: '1h' }
    );

    const staffToken = jwt.sign(
    {
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': 'Staff',
    },
    secret,
    { expiresIn: '1h' }
    );

    // test scenarios
    const scenarios = [
        {
          name: 'authenticated admin user',
          token: adminToken,
          expectedRoles: 'Admin',
          shouldSeeContent: true,
        },
        {
          name: 'authenticated staff user',
          token: staffToken,
          expectedRoles: 'Admin',
          shouldSeeContent: false,
        },
        {
          name: 'unauthenticated user',
          token: null,
          expectedRoles: 'Admin',
          shouldSeeContent: false,
        },
      ];

    // mocking the localStorage for testing
    const mockLocalStorage = (token) => {
    return {
        getItem: (key) => {
        return key === 'token' ? token : null;
        },
    };
    };

    scenarios.forEach(({ name, token, expectedRoles, shouldSeeContent }) => {
    test(`renders protected content only for ${name}`, () => {
        // Set up localStorage mock
        Object.defineProperty(window, 'localStorage', {
        value: mockLocalStorage(token),
        writable: true,
        });

        render(
        <Routes initialEntries={['/protected']}>
            <Route
            path="/protected"
            element={
                <ProtectedRoute expectedRoles={expectedRoles} element={<TestComponent />} />
            }
            />
        </Routes>
            );

            if (shouldSeeContent) {
            const protectedContent = screen.getByText('Protected Content');
            expect(protectedContent).toBeInTheDocument();
            } else {
            const protectedContent = screen.queryByText('Protected Content');
            expect(protectedContent).not.toBeInTheDocument();
            }
        });
    });
});
