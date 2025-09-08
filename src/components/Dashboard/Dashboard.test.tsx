import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter ,Routes,Route} from 'react-router-dom';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Dashboard from './Dashboard.tsx';
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
      reducer: { auth: () => ({ isAuthenticated: true, loading: false }),
                 poker:() => ({pokers:[
        {
            "id": 33,
            "role": 2,
            "poker": {
                "pokerid": 2,
                "game_name": "Poker Game 1",
                "game_description": "Description for Poker Game 1",
            },
            "accept": true
        },
        {
            "id": 53,
            "role": 3,
            "pokerid": 3,
            "game_name": "Poker Game 2",
            "game_description": "Description for Poker Game 2",
            "accept": true
        },
        {
            "id": 73,
            "role": 1,
            "poker": {
                "pokerid": 4,
                "game_name": "Poker Game 3",
                "game_description": "Description for Poker Game 3",
            },
            "accept": true
        },
        {
            "id": 93,
            "role": 1,
            "poker": {
                "pokerid": 5,
                "game_name": "Poker Game 4",
                "game_description": "Description for Poker Game 4",
            },
            "accept": true
        },
        {
            "id": 673,
            "role": 0,
            "pokerid": 34,
            "game_name": "Poker Game 13",
            "game_description": "Description for Poker Game 13",
            "accept": false
        },
    ]
    }),
  },
});

describe('Dashboard Component', () => {
  test('Dashboard pokerboard UI', async () => {
    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    ); 

    expect( await screen.findByText(`Your Pokerboard's`)).toBeInTheDocument();
    expect( await screen.findByText(`Poker Game 2`)).toBeInTheDocument();
  });

  test('Dashboard invitations UI', async () => {
    render(
      <Provider store={mockStore}>
        <Dashboard />
      </Provider>
    ); 

    expect(await screen.findByText('Invitations')).toBeInTheDocument();
    expect(await screen.findByText('Poker Game 13')).toBeInTheDocument();
  });
});


