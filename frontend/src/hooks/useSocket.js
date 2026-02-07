import { useEffect, useState, useCallback, useRef } from "react";
import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "https://kanban-realtime-websocket.onrender.com";

export const useSocket = () => {
    const socketRef = useRef(null);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const socket = io(SOCKET_SERVER_URL);
        socketRef.current = socket;

        socket.on("connect", () => {
            console.log("Connected to WebSocket");
            socket.emit("sync:tasks");
        });

        socket.on("sync:tasks", (syncedTasks) => {
            setTasks(syncedTasks);
            setLoading(false);
        });

        socket.on("task:created", (newTask) => {
            setTasks((prev) => [...prev, newTask]);
        });

        socket.on("task:updated", (updatedTask) => {
            setTasks((prev) =>
                prev.map((t) => (t.id === updatedTask.id ? updatedTask : t))
            );
        });

        socket.on("task:moved", (movedTask) => {
            setTasks((prev) =>
                prev.map((t) => (t.id === movedTask.id ? movedTask : t))
            );
        });

        socket.on("task:deleted", (taskId) => {
            setTasks((prev) => prev.filter((t) => t.id !== taskId));
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    const createTask = useCallback((taskData) => {
        socketRef.current?.emit("task:create", taskData);
    }, []);

    const updateTask = useCallback((task) => {
        socketRef.current?.emit("task:update", task);
    }, []);

    const moveTask = useCallback((taskId, newStatus) => {
        socketRef.current?.emit("task:move", { taskId, newStatus });
    }, []);

    const deleteTask = useCallback((taskId) => {
        socketRef.current?.emit("task:delete", taskId);
    }, []);

    return { tasks, loading, createTask, updateTask, moveTask, deleteTask };
};
