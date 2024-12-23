import { Suspense, useState, useEffect } from "react";
import {
  useRoutes,
  Routes,
  Route,
  Navigate,
  useNavigate,
  useLocation,
} from "react-router-dom";
import Home from "./components/home";
import Calendar from "./components/TaskManager/Calendar";
import Profile from "./components/TaskManager/Profile";
import Welcome from "./components/Auth/Welcome";
import SignIn from "./components/Auth/SignIn";
import SignUp from "./components/Auth/SignUp";
import ForgotPassword from "./components/Auth/ForgotPassword";
import ResetPassword from "./components/Auth/ResetPassword";
import routes from "tempo-routes";
import { ThemeProvider } from "./lib/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "./lib/supabase";

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

function App() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    // Handle OAuth callback
    if (location.hash && location.hash.includes("access_token")) {
      const params = new URLSearchParams(location.hash.substring(1));
      const accessToken = params.get("access_token");
      if (accessToken) {
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session) {
            setSession(session);
            navigate("/");
          }
        });
      }
    }

    // Check active sessions and set up an auth listener
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) {
        fetchTasks(session.user.id);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) {
        fetchTasks(session.user.id);
        if (
          location.pathname === "/signin" ||
          location.pathname === "/signup"
        ) {
          navigate("/");
        }
      } else {
        setTasks([]);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [location, navigate]);

  const fetchTasks = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      setTasks(
        data.map((task) => ({
          ...task,
          date: task.due_date ? new Date(task.due_date) : undefined,
          notificationTime: task.notification_time
            ? new Date(task.notification_time)
            : undefined,
        })),
      );
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast({
        title: "Error",
        description: "Failed to load tasks",
        variant: "destructive",
      });
    }
  };

  const handleToggleComplete = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const { error } = await supabase
        .from("tasks")
        .update({ completed: !task.completed })
        .eq("id", taskId);

      if (error) throw error;

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleTogglePin = async (taskId: string) => {
    try {
      const task = tasks.find((t) => t.id === taskId);
      if (!task) return;

      const { error } = await supabase
        .from("tasks")
        .update({ pinned: !task.pinned })
        .eq("id", taskId);

      if (error) throw error;

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleEditTask = async (editedTask: {
    id: string;
    title: string;
    category: "work" | "personal";
    priority: Priority;
    date: Date;
    notifications?: boolean;
    notificationTime?: Date;
  }) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          title: editedTask.title,
          category: editedTask.category,
          priority: editedTask.priority,
          due_date: editedTask.date?.toISOString(),
          notifications: editedTask.notifications,
          notification_time: editedTask.notificationTime?.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", editedTask.id);

      if (error) throw error;

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update task",
        variant: "destructive",
      });
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    try {
      const { error } = await supabase.from("tasks").delete().eq("id", taskId);

      if (error) throw error;

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
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete task",
        variant: "destructive",
      });
    }
  };

  const handleToggleNotifications = async (
    taskId: string,
    enabled: boolean,
    notificationTime?: Date,
  ) => {
    try {
      const { error } = await supabase
        .from("tasks")
        .update({
          notifications: enabled,
          notification_time: notificationTime?.toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq("id", taskId);

      if (error) throw error;

      setTasks((prevTasks) =>
        prevTasks.map((task) => {
          if (task.id === taskId) {
            toast({
              title: enabled
                ? "Notifications Enabled"
                : "Notifications Disabled",
              description: `${enabled ? "You will receive notifications for" : "Notifications turned off for"}: ${task.title}`,
            });
            return { ...task, notifications: enabled, notificationTime };
          }
          return task;
        }),
      );
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update notifications",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <ThemeProvider defaultTheme="light" storageKey="task-app-theme">
      <Suspense fallback={<p>Loading...</p>}>
        <div className="flex justify-center min-h-screen w-screen bg-background">
          <div className="w-[390px] relative">
            <Routes>
              {/* Public Routes */}
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              {/* Protected Routes */}
              {session ? (
                <>
                  <Route
                    path="/"
                    element={
                      <Home
                        tasks={tasks}
                        setTasks={setTasks}
                        defaultSort="priority"
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
                  <Route path="/profile" element={<Profile tasks={tasks} />} />
                </>
              ) : (
                <Route path="*" element={<Navigate to="/welcome" replace />} />
              )}
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
