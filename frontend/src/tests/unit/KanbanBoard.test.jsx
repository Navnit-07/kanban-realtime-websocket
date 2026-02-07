import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import KanbanBoard from "../../components/KanbanBoard";
import { useSocket } from "../../hooks/useSocket";

// Mock the useSocket hook
vi.mock("../../hooks/useSocket", () => ({
  useSocket: vi.fn(),
}));

describe("KanbanBoard", () => {
  it("renders the board layout correctly", () => {
    useSocket.mockReturnValue({
      tasks: [],
      loading: false,
      createTask: vi.fn(),
      updateTask: vi.fn(),
      moveTask: vi.fn(),
      deleteTask: vi.fn(),
    });

    render(<KanbanBoard />);
    expect(screen.getByTestId("column-TODO")).toBeInTheDocument();
    expect(screen.getByTestId("column-INPROGRESS")).toBeInTheDocument();
    expect(screen.getByTestId("column-DONE")).toBeInTheDocument();
  });
});
