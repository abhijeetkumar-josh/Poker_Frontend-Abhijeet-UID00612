import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import NewGame from "./NewGame";
import { vi } from "vitest";

import gameReducer from "../../store/gameSlice";
import authReducer from "../../store/authSlice";


import * as Services from "../../Services/Services";
vi.mock("../../Services/Services", () => ({
  SearchUser: vi.fn(),
  ValidateToken: vi.fn(),
}));

import * as gameSlice from "../../store/gameSlice";
vi.mock("../../store/gameSlice", async (importOriginal) => {
  const actual: any = await importOriginal();
  return {
    ...actual,
    submitPoker: vi.fn(),
  };
});


function renderWithStore(ui: React.ReactNode, preloadedState = {}) {
  const store = configureStore({
    reducer: {
      game: gameReducer,
      auth: authReducer,
    },
    preloadedState: {
      game: { creating: false, error: "" },
      auth: { email: "test@example.com" },
      ...preloadedState,
    },
  });

  return {
    store,
    ...render(<Provider store={store}>{ui}</Provider>),
  };
}

describe("NewGame Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test("renders form fields", () => {
    renderWithStore(<NewGame />);
    expect(screen.getByText(/Create New Game/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter game name")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText("Enter game description")
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText("Enter API Token")).toBeInTheDocument();
  });

  test("user can type game name and description", () => {
    renderWithStore(<NewGame />);

    const nameInput = screen.getByPlaceholderText(
      "Enter game name"
    ) as HTMLInputElement;
    const descInput = screen.getByPlaceholderText(
      "Enter game description"
    ) as HTMLTextAreaElement;

    fireEvent.change(nameInput, { target: { value: "My Poker Game" } });
    fireEvent.change(descInput, { target: { value: "This is a test game" } });

    expect(nameInput.value).toBe("My Poker Game");
    expect(descInput.value).toBe("This is a test game");
  });

  test("search user success shows Add User button", async () => {
    (Services.SearchUser as jest.Mock).mockResolvedValueOnce({
      status: 200,
      data: { email: "found@example.com", username: "FoundUser" },
    });

    renderWithStore(<NewGame />);

    const emailInput = screen.getByPlaceholderText("Enter user email");
    fireEvent.change(emailInput, { target: { value: "found@example.com" } });

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(screen.getByText("Add User")).toBeInTheDocument();
    });
  });

  test("search user fail shows Invite button", async () => {
    (Services.SearchUser as jest.Mock).mockRejectedValueOnce(
      new Error("Not found")
    );

    renderWithStore(<NewGame />);

    const emailInput = screen.getByPlaceholderText("Enter user email");
    fireEvent.change(emailInput, { target: { value: "notfound@example.com" } });

    fireEvent.click(screen.getByText("Search"));

    await waitFor(() => {
      expect(screen.getByText("Invite")).toBeInTheDocument();
    });
  });

  test("submit dispatches submitPoker with correct data", async () => {
    (Services.ValidateToken as jest.Mock).mockResolvedValueOnce({ status: 200 });

    renderWithStore(<NewGame />);

    fireEvent.change(screen.getByPlaceholderText("Enter game name"), {
      target: { value: "Game 1" },
    });
    fireEvent.change(screen.getByPlaceholderText("Enter game description"), {
      target: { value: "Desc" },
    });

    fireEvent.click(screen.getByText("Validate"));
    await waitFor(() => expect(Services.ValidateToken).toHaveBeenCalled());

    fireEvent.click(screen.getByText("Create Game"));

    await waitFor(() => {
      expect(gameSlice.submitPoker).toHaveBeenCalled();
    });
  });
});
