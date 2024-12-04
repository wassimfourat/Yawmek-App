import React from "react";
import Header from "./TaskManager/Header";
import TaskList from "./TaskManager/TaskList";
import BottomNav from "./TaskManager/BottomNav";

type Priority = "high" | "medium" | "low";
type DefaultSort = "priority" | "date" | "title";

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

interface HomeProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onEditTask: (task: {
    id: string;
    title: string;
    category: "work" | "personal";
    priority: Priority;
    date: Date;
  }) => void;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDeleteTask: (id: string) => void;
  onToggleNotifications: (id: string, enabled: boolean, time?: Date) => void;
  defaultSort: DefaultSort;
}

const Home = ({
  tasks,
  setTasks,
  onEditTask,
  onToggleComplete,
  onTogglePin,
  onDeleteTask,
  onToggleNotifications,
  defaultSort,
}: HomeProps) => {
  const [selectedCategory, setSelectedCategory] = React.useState("all");
  const [isAddTaskOpen, setIsAddTaskOpen] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<
    "home" | "calendar" | "profile"
  >("home");

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleTaskSubmit = (newTask: {
    title: string;
    category: "work" | "personal";
    date: Date;
    notifications: boolean;
    notificationTime?: Date;
  }) => {
    setTasks((prevTasks) => [
      ...prevTasks,
      {
        id: Date.now().toString(),
        title: newTask.title,
        category: newTask.category,
        date: newTask.date,
        completed: false,
        pinned: false,
        priority: "medium",
        notifications: newTask.notifications,
        notificationTime: newTask.notificationTime,
      },
    ]);
    setIsAddTaskOpen(false);
  };

  const handleTabChange = (tab: "home" | "calendar" | "profile") => {
    setActiveTab(tab);
  };

  const filteredTasks = tasks.filter((task) => {
    if (selectedCategory === "all") return true;
    return task.category === selectedCategory;
  });

  const activeTasks = filteredTasks.filter((task) => !task.completed);
  const completedTasks = filteredTasks.filter((task) => task.completed);

  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col items-center">
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onAddTask={handleTaskSubmit}
        isAddTaskOpen={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
      />
      <TaskList
        activeTasks={activeTasks}
        completedTasks={completedTasks}
        onToggleComplete={onToggleComplete}
        onTogglePin={onTogglePin}
        onEditTask={onEditTask}
        onDeleteTask={onDeleteTask}
        onToggleNotifications={onToggleNotifications}
        defaultSort={defaultSort}
      />
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Home;
