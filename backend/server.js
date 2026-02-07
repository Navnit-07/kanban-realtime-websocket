import express from "express";
import http from "http";
import { Server } from "socket.io";
import { v4 as uuidv4 } from "uuid";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: "*" },
  maxHttpBufferSize: 1e7 // 10MB limit for attachments
});

// In-memory task storage
let tasks = [];

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Sync tasks on connection
  socket.emit("sync:tasks", tasks);

  socket.on("task:create", (taskData) => {
    const newTask = {
      ...taskData,
      id: uuidv4(),
      createdAt: new Date().toISOString()
    };
    tasks.push(newTask);
    io.emit("task:created", newTask);
  });

  socket.on("task:update", (updatedTask) => {
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    if (index !== -1) {
      tasks[index] = { ...tasks[index], ...updatedTask };
      io.emit("task:updated", tasks[index]);
    }
  });

  socket.on("task:move", ({ taskId, newStatus }) => {
    const index = tasks.findIndex(t => t.id === taskId);
    if (index !== -1) {
      tasks[index].status = newStatus;
      io.emit("task:moved", tasks[index]);
    }
  });

  socket.on("task:delete", (taskId) => {
    tasks = tasks.filter(t => t.id !== taskId);
    io.emit("task:deleted", taskId);
  });

  socket.on("sync:tasks", () => {
    socket.emit("sync:tasks", tasks);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
