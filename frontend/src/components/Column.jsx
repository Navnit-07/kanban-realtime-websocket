import React from "react";
import { useDroppable } from "@dnd-kit/core";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";

const Column = ({ title, status, tasks, onTaskClick }) => {
    const { setNodeRef } = useDroppable({
        id: status,
        data: {
            type: "Column",
            status,
        },
    });

    return (
        <div ref={setNodeRef} className="kanban-column" data-testid={`column-${status}`}>
            <div className="column-header">
                <h3 className="column-title">{title}</h3>
                <span className="task-count">{tasks.length}</span>
            </div>

            <div className="tasks-container">
                <SortableContext items={tasks.map(t => t.id)} strategy={verticalListSortingStrategy}>
                    {tasks.map((task) => (
                        <TaskCard key={task.id} task={task} onClick={onTaskClick} />
                    ))}
                </SortableContext>
            </div>
        </div>
    );
};

export default Column;
