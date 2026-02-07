import React, { useState } from "react";
import {
    DndContext,
    DragOverlay,
    closestCorners,
    KeyboardSensor,
    PointerSensor,
    useSensor,
    useSensors,
    defaultDropAnimationSideEffects,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import { Plus } from "lucide-react";

import Column from "./Column";
import TaskCard from "./TaskCard";
import TaskModal from "./TaskModal";
import Dashboard from "./Dashboard";
import { useSocket } from "../hooks/useSocket";

const columns = [
    { id: "TODO", title: "To Do" },
    { id: "INPROGRESS", title: "In Progress" },
    { id: "DONE", title: "Done" },
];

const KanbanBoard = () => {
    const { tasks, loading, createTask, updateTask, moveTask, deleteTask } = useSocket();
    const [activeTask, setActiveTask] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTask, setEditingTask] = useState(null);

    const sensors = useSensors(
        useSensor(PointerSensor, {
            activationConstraint: {
                distance: 5,
            },
        }),
        useSensor(KeyboardSensor, {
            coordinateGetter: sortableKeyboardCoordinates,
        })
    );

    const handleDragStart = (event) => {
        const { active } = event;
        const task = tasks.find((t) => t.id === active.id);
        setActiveTask(task);
    };

    const handleDragOver = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        if (activeId === overId) return;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverAColumn = over.data.current?.type === "Column";

        if (isActiveATask && isOverAColumn) {
            const task = tasks.find((t) => t.id === activeId);
            if (task && task.status !== overId) {
                moveTask(activeId, overId);
            }
        }
    };

    const handleDragEnd = (event) => {
        const { active, over } = event;
        if (!over) return;

        const activeId = active.id;
        const overId = over.id;

        const isActiveATask = active.data.current?.type === "Task";
        const isOverATask = over.data.current?.type === "Task";

        if (isActiveATask && isOverATask) {
            const activeTask = tasks.find(t => t.id === activeId);
            const overTask = tasks.find(t => t.id === overId);

            if (activeTask && overTask && activeTask.status !== overTask.status) {
                moveTask(activeId, overTask.status);
            }
        }

        setActiveTask(null);
    };

    const handleAddTask = () => {
        setEditingTask(null);
        setIsModalOpen(true);
    };

    const handleEditTask = (task) => {
        setEditingTask(task);
        setIsModalOpen(true);
    };

    const handleSaveTask = (taskData) => {
        if (editingTask) {
            updateTask(taskData);
        } else {
            createTask(taskData);
        }
    };

    if (loading) {
        return (
            <div className="loading-screen" data-testid="loading-screen">
                <div className="spinner"></div>
                <p className="mt-4 text-secondary">Syncing tasks...</p>
            </div>
        );
    }

    return (
        <div className="kanban-wrapper">
            <Dashboard tasks={tasks} />

            <div className="flex justify-between items-center mb-6">
                <button
                    onClick={handleAddTask}
                    className="btn btn-primary flex items-center gap-2"
                    data-testid="btn-add-task"
                >
                    <Plus size={18} />
                    Add Task
                </button>
            </div>

            <DndContext
                sensors={sensors}
                collisionDetection={closestCorners}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragEnd={handleDragEnd}
            >
                <div className="kanban-container">
                    {columns.map((col) => (
                        <Column
                            key={col.id}
                            title={col.title}
                            status={col.id}
                            tasks={tasks.filter((t) => t.status === col.id)}
                            onTaskClick={handleEditTask}
                        />
                    ))}
                </div>

                <DragOverlay dropAnimation={{
                    sideEffects: defaultDropAnimationSideEffects({
                        styles: {
                            active: {
                                opacity: "0.5",
                            },
                        },
                    }),
                }}>
                    {activeTask ? (
                        <TaskCard task={activeTask} />
                    ) : null}
                </DragOverlay>
            </DndContext>

            <TaskModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleSaveTask}
                onDelete={deleteTask}
                task={editingTask}
            />
        </div>
    );
};

export default KanbanBoard;
