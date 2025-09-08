import { render, screen, fireEvent } from '@testing-library/react';
import Login from './Login.tsx';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { vi } from 'vitest';
import { useNavigate } from 'react-router-dom';

vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: vi.fn(),
  };
});

const mockNavigate = vi.fn();

beforeEach(() => {
  (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
});

vi.mock("../../Services/Services", () => ({
  loadPublicKey: vi.fn(),
}));


const mockStore = configureStore({
  reducer: { auth: () => ({ isAuthenticated: false, loading: false, error:'Email is not valid'}) },
});

describe("Login Component", () => {
  test('shows email is not valid when user enters wrong email format', async () => {
    render(
      <Provider store={mockStore}>
        <Login />
      </Provider>
    ); 
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'wrongformat' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'somepassword' },
    });
    fireEvent.click(screen.getByTestId('login-Button'));

    expect(await screen.findByText('Email is not valid')).toBeInTheDocument();
  });

  test('shows error when password is empty', async () => {
    const mockStore = configureStore({
       reducer: { auth: () => ({ isAuthenticated: false, loading: false, error:'passwords must be 8 character long'}) },
    });
    render(
      <Provider store={mockStore}>
        <Login />
      </Provider>
    );
    
    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'some@gmail.com' },
    });
    fireEvent.click(screen.getByTestId('login-Button'));

    expect(await screen.findByText('passwords must be 8 character long')).toBeInTheDocument();
  });

});

