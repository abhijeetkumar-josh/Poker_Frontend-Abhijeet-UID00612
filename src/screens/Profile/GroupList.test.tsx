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

    const nextButton = screen.getByText(/>/i);
    const prevButton = screen.getByText(/</i);

    expect(prevButton).toHaveClass("disable");

    fireEvent.click(nextButton);

    expect(prevButton).not.toHaveClass("disable");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(6);
    expect(screen.getByText("Group 10")).toBeInTheDocument();

    expect(nextButton).toHaveClass("disable");

    fireEvent.click(prevButton);

    const itemsBack = screen.getAllByRole("listitem");
    expect(itemsBack).toHaveLength(9);
    expect(screen.getByText("Group 1")).toBeInTheDocument();
  });
});
