import { Suspense, useState } from "react";
import { useRoutes, Routes, Route } from "react-router-dom";
import Home from "./components/home";
import Calendar from "./components/TaskManager/Calendar";
import Profile from "./components/TaskManager/Profile";
import routes from "tempo-routes";
import { ThemeProvider } from "./lib/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";

type Priority = "high" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  category: "work" | "personal";
  priority: Priority;
  date?: Date;
  notifications: boolean;
  notificationTime?: Date;
}

interface User {
  name: string;
  email: string;
  avatar?: string;
}

function App() {
  const { toast } = useToast();
  const [user, setUser] = useState<User>({
    name: "John Doe",
    email: "john@example.com",
  });

  const [tasks, setTasks] = useState<Task[]>([
    {
      id: "1",
      title: "Complete project proposal",
      completed: false,
      pinned: true,
      category: "work",
      priority: "high",
      date: new Date(),
      notifications: true,
      notificationTime: new Date(),
    },
    {
      id: "2",
      title: "Buy groceries",
      completed: false,
      pinned: false,
      category: "personal",
      priority: "medium",
      date: new Date(),
      notifications: false,
    },
    {
      id: "3",
      title: "Send weekly report",
      completed: true,
      pinned: false,
      category: "work",
      priority: "low",
      date: new Date(),
      notifications: true,
      notificationTime: new Date(),
    },
  ]);

  const handleUpdateUser = (updatedUser: User) => {
    setUser(updatedUser);
    toast({
      title: "Profile Updated",
      description: "Your profile has been updated successfully.",
      variant: "success",
    });
  };

  const handleToggleNotifications = (
    taskId: string,
    enabled: boolean,
    notificationTime?: Date,
  ) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          toast({
            title: enabled ? "Notifications Enabled" : "Notifications Disabled",
            description: `${enabled ? "You will receive notifications for" : "Notifications turned off for"}: ${task.title}`,
          });
          return { ...task, notifications: enabled, notificationTime };
        }
        return task;
      }),
    );
  };

  const handleToggleComplete = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const newCompleted = !task.completed;
          toast({
            title: newCompleted ? "Task Completed" : "Task Uncompleted",
            description: task.title,
            variant: newCompleted ? "success" : "default",
          });
          return { ...task, completed: newCompleted };
        }
        return task;
      }),
    );
  };

  const handleTogglePin = (taskId: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === taskId) {
          const newPinned = !task.pinned;
          toast({
            title: newPinned ? "Task Pinned" : "Task Unpinned",
            description: task.title,
          });
          return { ...task, pinned: newPinned };
        }
        return task;
      }),
    );
  };

  const handleEditTask = (editedTask: {
    id: string;
    title: string;
    category: "work" | "personal";
    priority: Priority;
    date: Date;
    notifications?: boolean;
    notificationTime?: Date;
  }) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => {
        if (task.id === editedTask.id) {
          toast({
            title: "Task Updated",
            description: editedTask.title,
          });
          return {
            ...task,
            ...editedTask,
          };
        }
        return task;
      }),
    );
  };

  const handleDeleteTask = (taskId: string) => {
    const taskToDelete = tasks.find((task) => task.id === taskId);
    setTasks((prevTasks) => {
      const newTasks = prevTasks.filter((task) => task.id !== taskId);
      if (taskToDelete) {
        toast({
          title: "Task Deleted",
          description: taskToDelete.title,
          variant: "destructive",
        });
      }
      return newTasks;
    });
  };

  return (
    <ThemeProvider defaultTheme="light" storageKey="task-app-theme">
      <Suspense fallback={<p>Loading...</p>}>
        <div className="flex justify-center min-h-screen w-screen bg-background">
          <div className="w-[390px] relative">
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
                    onToggleNotifications={handleToggleNotifications}
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
                    onToggleNotifications={handleToggleNotifications}
                  />
                }
              />
              <Route
                path="/profile"
                element={
                  <Profile
                    tasks={tasks}
                    user={user}
                    onUpdateUser={handleUpdateUser}
                  />
                }
              />
            </Routes>
          </div>
          <Toaster />
          {import.meta.env.VITE_TEMPO === "true" && useRoutes(routes)}
        </div>
      </Suspense>
    </ThemeProvider>
  );
}

export default App;
