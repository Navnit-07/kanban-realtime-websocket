import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import TaskCard from "../../components/TaskCard";

// Mock dnd-kit since it depends on browser APIs not fully available in jsdom
vi.mock("@dnd-kit/sortable", () => ({
    useSortable: () => ({
        attributes: {},
        listeners: {},
        setNodeRef: () => { },
        transform: null,
        transition: null,
        isDragging: false,
    }),
    SortableContext: ({ children }) => <div>{children}</div>,
    verticalListSortingStrategy: {},
}));

vi.mock("@dnd-kit/utilities", () => ({
    CSS: {
        Translate: {
            toString: () => "",
        },
    },
}));

describe("TaskCard", () => {
    const mockTask = {
        id: "1",
        title: "Test Task",
        description: "Test Description",
        priority: "High",
        category: "Bug",
        status: "TODO",
        attachments: [],
    };

    it("renders task details correctly", () => {
        render(<TaskCard task={mockTask} onClick={() => { }} />);
        expect(screen.getByText("Test Task")).toBeInTheDocument();
        expect(screen.getByText("Test Description")).toBeInTheDocument();
        expect(screen.getByText("High")).toBeInTheDocument();
        expect(screen.getByText("Bug")).toBeInTheDocument();
    });

    it("calls onClick when clicked", () => {
        const handleClick = vi.fn();
        render(<TaskCard task={mockTask} onClick={handleClick} />);
        fireEvent.click(screen.getByTestId("task-card-1"));
        expect(handleClick).toHaveBeenCalledWith(mockTask);
    });
});
