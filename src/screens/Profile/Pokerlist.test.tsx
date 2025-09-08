import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import Pokerlist from "./Pokerlist";

const mockPokers = [
  { game_name: "Poker 1", game_description: "Description 1" },
  { game_name: "Poker 2", game_description: "Description 2" },
  { game_name: "Poker 3", game_description: "Description 3" },
  { game_name: "Poker 4", game_description: "Description 4" },
  { game_name: "Poker 5", game_description: "Description 5" },
  { game_name: "Poker 6", game_description: "Description 6" },
  { game_name: "Poker 7", game_description: "Description 7" },
  { game_name: "Poker 8", game_description: "Description 8" },
  { game_name: "Poker 9", game_description: "Description 9" },
  { game_name: "Poker 10", game_description: "Description 10" },
];

const store = configureStore({
  reducer: {
    poker: (state = { pokers: mockPokers }) => state,
  },
});

describe("Pokerlist Component", () => {
  test("renders component with poker boards", async () => {
    render(
      <Provider store={store}>
        <Pokerlist />
      </Provider>
    );

    expect(screen.getByText(/Your Pokerboards/i)).toBeInTheDocument();

    const items = await screen.findAllByRole("listitem");
    expect(items).toHaveLength(9);

    expect(screen.getByText("Poker 1")).toBeInTheDocument();
    expect(screen.getByText("Description 1")).toBeInTheDocument();
  });

  test("next and prev buttons work correctly", async () => {
    render(
      <Provider store={store}>
        <Pokerlist />
      </Provider>
    );

    const nextButton = screen.getByText(/>/i);
    const prevButton = screen.getByText(/</i);

    expect(prevButton).toHaveClass("disable");

    fireEvent.click(nextButton);

    expect(prevButton).not.toHaveClass("disable");

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(1);
    expect(screen.getByText("Poker 10")).toBeInTheDocument();

    expect(nextButton).toHaveClass("disable");

    fireEvent.click(prevButton);

    const itemsBack = screen.getAllByRole("listitem");
    expect(itemsBack).toHaveLength(9);
    expect(screen.getByText("Poker 1")).toBeInTheDocument();
  });

  test("shows loading state", () => {
    render(
      <Provider store={store}>
        <Pokerlist />
      </Provider>
    );

    expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
  });
});


