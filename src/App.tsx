import { Suspense, useState } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Calendar from "./components/TaskManager/Calendar";
import Profile from "./components/TaskManager/Profile";
import routes from "tempo-routes";
import { ThemeProvider } from "./lib/theme-provider";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  category: "work" | "personal";
  date?: Date;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      completed: false,
      pinned: true,
      category: "work",
      date: new Date(),
    },
    {
      id: "2",
      title: "Buy groceries",
      completed: false,
      pinned: false,
      category: "personal",
      date: new Date(),
    },
    {
      id: "3",
      title: "Send weekly report",
      completed: true,
      pinned: false,
      category: "work",
      date: new Date(),
    },
  ]);

  const handleToggleComplete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, completed: !task.completed } : task,
      ),
    );
  };

  const handleTogglePin = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, pinned: !task.pinned } : task,
      ),
    );
  };

  const handleEditTask = (editedTask: {
    id: string;
    title: string;
    category: "work" | "personal";
    date: Date;
  }) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === editedTask.id
          ? {
              ...task,
              title: editedTask.title,
              category: editedTask.category,
              date: editedTask.date,
            }
          : task,
      ),
    );
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="task-app-theme">
      <Suspense fallback={<p>Loading...</p>}>
        <>
          <Routes>
            <Route
              path="/"
              element={
                <Home
                  tasks={tasks}
                  setTasks={setTasks}
                  onEditTask={handleEditTask}
                  onToggleComplete={handleToggleComplete}
                  onTogglePin={handleTogglePin}
                  onDeleteTask={handleDeleteTask}
                />
              }
            />
            <Route
              path="/calendar"
              element={
                <Calendar
                  tasks={tasks}
                  onToggleComplete={handleToggleComplete}
                  onTogglePin={handleTogglePin}
                  onEditTask={handleEditTask}
                  onDeleteTask={handleDeleteTask}
                />
              }
            />
            <Route path="/profile" element={<Profile tasks={tasks} />} />
          </Routes>
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
