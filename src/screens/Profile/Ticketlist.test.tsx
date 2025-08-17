import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Ticketlist from './Ticketlist';
import { Filter } from '../../Services/Services';
import {vi} from 'vitest';


vi.mock('../../Services/Services', () => ({
  Filter: vi.fn(),
}));


const mockTickets = Array.from({ length: 10 }, (_, i) => ({
  id: i + 1,
  summary: `Ticket ${i + 1}`,
  description: `Description ${i + 1}`,
  estimate: i + 1,
}));

describe('Ticketlist Component', () => {
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        poker: (state = { estimates: mockTickets }) => state,
      },
    });
  });

  it('renders tickets correctly', async () => {
    render(
      <Provider store={store}>
        <Ticketlist />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByText('Ticket 1')).toBeInTheDocument();
      expect(screen.getByText('Description 1')).toBeInTheDocument();
    });

    const ticketElements = screen.getAllByRole('listitem');
    expect(ticketElements.length).toBe(6);
  });

  it('pagination buttons work', async () => {
    render(
      <Provider store={store}>
        <Ticketlist />
      </Provider>
    );

    await waitFor(() => screen.getByText('Ticket 1'));

    const nextButton = screen.getByText(/next/i);
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText('Ticket 7')).toBeInTheDocument();
    });

    const prevButton = screen.getByText(/prev/i);
    fireEvent.click(prevButton);

    await waitFor(() => {
      expect(screen.getByText('Ticket 1')).toBeInTheDocument();
    });
  });

  it('filter form calls Filter service', async () => {
    (Filter as jest.Mock).mockResolvedValue([
      { id: 999, summary: 'Filtered Ticket', description: 'Filtered Desc', estimate: 5 },
    ]);

    render(
      <Provider store={store}>
        <Ticketlist />
      </Provider>
    );

    const typeSelect = screen.getByLabelText('Type:');
    const dateInput = screen.getByLabelText('Date:');
    const submitButton = screen.getByText(/apply filters/i);

    fireEvent.change(typeSelect, { target: { value: '1' } });
    fireEvent.change(dateInput, { target: { value: '2025-08-18' } });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('Filtered Ticket')).toBeInTheDocument();
    });
  });
});
