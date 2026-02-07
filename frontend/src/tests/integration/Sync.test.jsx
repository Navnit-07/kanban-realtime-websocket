import { render, screen, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import KanbanBoard from "../../components/KanbanBoard";
import { useSocket } from "../../hooks/useSocket";

// Mock the useSocket hook
vi.mock("../../hooks/useSocket", () => ({
    useSocket: vi.fn(),
}));

describe("KanbanBoard Integration - Sync", () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it("shows loading screen initially", () => {
        useSocket.mockReturnValue({
            tasks: [],
            loading: true,
            createTask: vi.fn(),
            updateTask: vi.fn(),
            moveTask: vi.fn(),
            deleteTask: vi.fn(),
        });

        render(<KanbanBoard />);
        expect(screen.getByTestId("loading-screen")).toBeInTheDocument();
    });

    it("renders tasks after syncing", async () => {
        const mockTasks = [
            { id: "1", title: "Sync Task", status: "TODO", priority: "Low", category: "Feature", attachments: [] },
        ];
        useSocket.mockReturnValue({
            tasks: mockTasks,
            loading: false,
            createTask: vi.fn(),
            updateTask: vi.fn(),
            moveTask: vi.fn(),
            deleteTask: vi.fn(),
        });

        render(<KanbanBoard />);

        await waitFor(() => {
            expect(screen.getByText("Sync Task")).toBeInTheDocument();
        });
        expect(screen.getByTestId("column-TODO")).toBeInTheDocument();
    });
});
