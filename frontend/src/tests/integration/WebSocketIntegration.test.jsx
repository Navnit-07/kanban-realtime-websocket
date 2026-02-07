import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import KanbanBoard from "../../components/KanbanBoard";
import { useSocket } from "../../hooks/useSocket";

vi.mock("../../hooks/useSocket", () => ({
  useSocket: vi.fn(),
}));

describe("WebSocket Integration", () => {
  const mockCreateTask = vi.fn();

  beforeEach(() => {
    useSocket.mockReturnValue({
      tasks: [],
      loading: false,
      createTask: mockCreateTask,
      updateTask: vi.fn(),
      moveTask: vi.fn(),
      deleteTask: vi.fn(),
    });
  });

  it("calls createTask when adding a new task", async () => {
    render(<KanbanBoard />);

    // Open modal
    fireEvent.click(screen.getByTestId("btn-add-task"));

    // Fill form
    fireEvent.change(screen.getByTestId("input-title"), { target: { value: "New Task" } });
    fireEvent.change(screen.getByTestId("input-description"), { target: { value: "Description" } });

    // Save
    fireEvent.click(screen.getByTestId("btn-save"));

    expect(mockCreateTask).toHaveBeenCalledWith(expect.objectContaining({
      title: "New Task",
      description: "Description",
    }));
  });
});
