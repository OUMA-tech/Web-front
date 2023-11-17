import React from 'react';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import Login from './Login';
import { MemoryRouter } from 'react-router-dom';

// Mock useNavigate
const mockedNavigate = jest.fn();
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'), // import and retain the original functionalities
  useNavigate: () => mockedNavigate, // mock useNavigate
}));
// Mock useNavigate and fetch
global.fetch = jest.fn((url, options) => {
  // check url and fetching method
  if (url === 'http://localhost:5005/user/auth/login' && options.method === 'POST') {
    const body = JSON.parse(options.body);

    // check email and password
    if (body.email === 'expected-email@example.com' && body.password === 'correct-password') {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ token: 'test-token' }),
      });
    } else {
      return Promise.resolve({
        ok: false,
        json: () => Promise.resolve({ error: 'login failed' }),
      });
    }
  }
});
beforeEach(() => {
  fetch.mockClear();
  mockedNavigate.mockClear();
});

describe('Login Component', () => {
  // Test case: Can type into email and password fields
  it('allows entering email and password', () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
    const emailInput = screen.getByLabelText(/email/i);
    const passwordInput = screen.getByLabelText(/password/i);
    fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
    fireEvent.change(passwordInput, { target: { value: 'password123' } });
    expect(emailInput.value).toBe('test@example.com');
    expect(passwordInput.value).toBe('password123');
  });

  // Test case: Button click triggers login function with fetch
  test('button click triggers login function with fetch', async () => {
    render(
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    );
  
    // Simulate user input
    fireEvent.change(screen.getByLabelText(/email/i), { target: { value: 'test@example.com' } });
    fireEvent.change(screen.getByLabelText(/password/i), { target: { value: 'password123' } });
  
    // Click the login button
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
  
    // Wait for fetch to be called and for navigation to occur
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledTimes(1);
      expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.any(Object));
      
    });
    // Check if navigation to '/dashboard' occurred
    expect(mockedNavigate).toHaveBeenCalledWith('/dashboard');
  });

  // Additional test cases can be added here to cover more functionalities
});
