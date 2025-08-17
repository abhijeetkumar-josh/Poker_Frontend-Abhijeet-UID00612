import { render, screen, fireEvent } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import Grouplist from './Grouplist';

const mockGroups = Array.from({ length: 15 }, (_, i) => ({
  id: i + 1,
  name: `Group ${i + 1}`,
}));

describe('Grouplist Component', () => {

  test('renders groups correctly', async () => {
    const store = configureStore({
      reducer: {
        poker: (state = { groups: mockGroups }) => state,
      },
    });

    render(
      <Provider store={store}>
        <Grouplist />
      </Provider>
    );

    const firstGroup = await screen.findByText('Group 1');
    expect(firstGroup).toBeInTheDocument();
    expect(screen.getByText('Group 9')).toBeInTheDocument();
  });

  test('pagination buttons work', async () => {
    const store = configureStore({
      reducer: {
        poker: (state = { groups: mockGroups }) => state,
      },
    });

    render(
      <Provider store={store}>
        <Grouplist />
      </Provider>
    );

    const nextBtn = screen.getByText(/next/i) as HTMLButtonElement;
    const prevBtn = screen.getByText(/prev/i) as HTMLButtonElement;

    expect(prevBtn).toHaveClass('disable');
    expect(nextBtn).not.toHaveClass('disable');

    fireEvent.click(nextBtn);

    expect(prevBtn).not.toHaveClass('disable');

    fireEvent.click(nextBtn);
    expect(nextBtn).toHaveClass('disable');
  });
});
