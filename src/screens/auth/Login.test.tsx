import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter ,Routes,Route} from 'react-router-dom';
import Login from './Login.tsx';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';

const renderWithStore = (store) => {
  return render(
    <Provider store={store}>
      <MemoryRouter initialEntries={['/login']}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/newgame" element={<div>New Game Page</div>} />
        </Routes>
      </MemoryRouter>
    </Provider>
  );
};

describe('Login Component', () => {
  test('shows email is not valid when user enters wrong email format', async () => {
    const mockStore = configureStore({
      reducer: { auth: () => ({ isAuthenticated: false, loading: false, error: 'Invalid credentials' }) },
    });

    renderWithStore(mockStore);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'wrongformat' },
    });
    fireEvent.change(screen.getByPlaceholderText(/Password/i), {
      target: { value: 'somepassword' },
    });
    fireEvent.click(screen.getByTestId('login-Button'));

    expect(await screen.findByText('Invalid credentials')).toBeInTheDocument();
  });

  test('shows error when password is empty', async () => {
    const mockStore = configureStore({
      reducer: { auth: () => ({ isAuthenticated: false, loading: false, error: 'Password required' }) },
    });

    renderWithStore(mockStore);

    fireEvent.change(screen.getByPlaceholderText(/Email/i), {
      target: { value: 'some@gmail.com' },
    });
    fireEvent.click(screen.getByTestId('login-Button'));

    expect(await screen.findByText('Password required')).toBeInTheDocument();
  });
});

