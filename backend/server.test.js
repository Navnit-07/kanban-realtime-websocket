import { createServer } from "http";
import { Server } from "socket.io";
import { io as Client } from "socket.io-client";
import { describe, it, beforeAll, afterAll, expect } from "vitest";

describe("Backend WebSocket Events", () => {
    let ioServer, clientSocket, httpServer;
    let tasks = [];

    beforeAll(async () => {
        return new Promise((resolve) => {
            httpServer = createServer();
            ioServer = new Server(httpServer);
            httpServer.listen(() => {
                const port = httpServer.address().port;
                clientSocket = new Client(`http://localhost:${port}`);
                ioServer.on("connection", (socket) => {
                    socket.on("task:create", (taskData) => {
                        const newTask = { ...taskData, id: "test-id", createdAt: new Date().toISOString() };
                        tasks.push(newTask);
                        ioServer.emit("task:created", newTask);
                    });

                    socket.on("task:move", ({ taskId, newStatus }) => {
                        const task = tasks.find(t => t.id === taskId);
                        if (task) {
                            task.status = newStatus;
                            ioServer.emit("task:moved", task);
                        }
                    });
                });
                clientSocket.on("connect", () => {
                    resolve();
                });
            });
        });
    });

    afterAll(() => {
        ioServer.close();
        clientSocket.close();
        httpServer.close();
    });

    it("should broadcast task:created when a task is created", async () => {
        const taskData = { title: "Test Task", status: "TODO", priority: "Low", category: "Bug" };

        await new Promise((resolve) => {
            clientSocket.once("task:created", (newTask) => {
                expect(newTask.title).toBe("Test Task");
                expect(newTask.id).toBe("test-id");
                resolve();
            });
            clientSocket.emit("task:create", taskData);
        });
    });

    it("should broadcast task:moved when a task is moved", async () => {
        const moveData = { taskId: "test-id", newStatus: "INPROGRESS" };

        await new Promise((resolve) => {
            clientSocket.once("task:moved", (movedTask) => {
                expect(movedTask.id).toBe("test-id");
                expect(movedTask.status).toBe("INPROGRESS");
                resolve();
            });
            clientSocket.emit("task:move", moveData);
        });
    });
});
