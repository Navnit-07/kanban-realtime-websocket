import React from "react";
import KanbanBoard from "./components/KanbanBoard";

function App() {
  return (
    <main className="App">
      <header>
        <h1>Real-time Kanban Board</h1>
        <p className="text-secondary">Streamline your workflow with real-time updates</p>
      </header>
      <section className="mt-8">
        <KanbanBoard />
      </section>
    </main>
  );
}

export default App;
