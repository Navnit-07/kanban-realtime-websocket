# Real-time Kanban Board

A production-quality, real-time Kanban board built for high-performance team collaboration. This project features a robust WebSocket-driven synchronization engine, advanced task management, and a heavy emphasis on automated testing (Unit, Integration, and E2E).

## Key Features

- **Real-time Collaboration**: Instant synchronization across all connected clients using Socket.IO.
- **Interactive Drag & Drop**: Smooth, high-performance task movement between "To Do", "In Progress", and "Done" columns.
- **Advanced Task Management**:
  - **Priority Levels**: Low, Medium, High.
  - **Categories**: Bug, Feature, Enhancement.
  - **Attachments**: Support for image and PDF uploads with live previews.
- **Live Analytics Dashboard**: Dynamic charts (Recharts) visualizing task distribution and completion percentages.
- **Premium UI/UX**: Dark-themed, modern interface with glassmorphism effects, responsive layouts, and micro-animations.
- **Reliability**: Comprehensive test coverage ensuring stability across the entire stack.

## Technical Stack

- **Frontend**: React 19, Vite, @dnd-kit (Drag & Drop), Recharts (Analytics), Lucide-React (Icons).
- **Backend**: Node.js, Express, Socket.IO.
- **Testing**:
  - **Unit & Integration**: Vitest + React Testing Library.
  - **End-to-End**: Playwright.
- **Language**: JavaScript (ESM).

## Project Structure

The project is structured for a clear separation of concerns:

```
websocket-kanban-vitest-playwright
│── backend/                     # Node.js WebSocket server (ESM)
│   ├── server.js                 # Task management & sync logic
│   ├── server.test.js            # WebSocket event unit tests
│── frontend/                     # React application
│   ├── src/
│   │   ├── components/           # Modular UI components
│   │   ├── hooks/                # Custom hooks (e.g., useSocket)
│   │   ├── tests/                
│   │   │   ├── unit/             # Component unit tests (Vitest)
│   │   │   ├── integration/      # Socket synchronization tests
│   │   │   ├── e2e/              # Critical path testing (Playwright)
│   └── playwright.config.js      # E2E test configuration
```

## Getting Started

### Prerequisites

- Node.js (v18+)
- npm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Navnit-07/websocket-kanban-vitest-playwright-2026.git
   cd websocket-kanban-vitest-playwright-2026
   ```

2. **Setup Backend**:
   ```bash
   cd backend
   npm install
   npm start
   ```

3. **Setup Frontend**:
   ```bash
   cd ../frontend
   npm install
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Testing

Testing is the backbone of this project. To run the tests:

### Backend Tests
```bash
cd backend
npm run test
```

### Frontend Unit & Integration Tests
```bash
cd frontend
npm run test
```

### E2E Tests (Playwright)
```bash
cd frontend
npx playwright install chromium # One-time setup
npm run test:e2e
```

## Code Quality & Standards

- **Modular Design**: Components are highly reusable and decoupled from the business logic.
- **Custom Hooks**: WebSocket logic is abstracted into `useSocket` for cleaner component interfaces.
- **Test Driven**: The project follows a testing-first approach, ensuring that every WebSocket event and UI interaction is validated.
- **Modern Styling**: Pure Vanilla CSS design system for maximum performance and portability.

## License

This project is open-source and available under the MIT License.

---
Built with by [Navnit-07](https://github.com/Navnit-07)
