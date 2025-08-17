import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Signup from './Signup';
import { Provider } from 'react-redux';
import { configureStore, createSlice } from '@reduxjs/toolkit';
import { MemoryRouter } from 'react-router-dom';

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    loading1: false,
    error1: '',
  },
  reducers: {},
});

function renderWithStore() {
  const store = configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
  });

  return render(
    <Provider store={store}>
      <MemoryRouter>
        <Signup />
      </MemoryRouter>
    </Provider>
  );
}

describe('Signup Component', () => {
  test('renders all inputs and button', () => {
    renderWithStore();

    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^Password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Confirm Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
  });

  test('allows user to fill form and submit', async () => {
    renderWithStore();

    fireEvent.change(screen.getByPlaceholderText(/Username/i), { target: { value: 'myuser' } });
    fireEvent.change(screen.getByPlaceholderText(/Email/i), { target: { value: 'myuser@example.com' } });
    fireEvent.change(screen.getByPlaceholderText(/^Password$/i), { target: { value: 'pass123' } });
    fireEvent.change(screen.getByPlaceholderText(/Confirm Password/i), { target: { value: 'pass123' } });

    fireEvent.click(screen.getByRole('button', { name: /signup/i }));

    await waitFor(() => {
      expect(screen.getByRole('button', { name: /signup/i })).toBeInTheDocument();
    });
  });

  test('shows error message when error1 in state', () => {
    const storeWithError = configureStore({
      reducer: {
        auth: () => ({ loading1: false, error1: 'Some error occurred' }),
      },
    });

    render(
      <Provider store={storeWithError}>
        <MemoryRouter>
          <Signup />
        </MemoryRouter>
      </Provider>
    );

    expect(screen.getByText(/some error occurred/i)).toBeInTheDocument();
  });
});
