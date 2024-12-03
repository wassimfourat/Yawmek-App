import React from "react";
import Header from "./TaskManager/Header";
import TaskList from "./TaskManager/TaskList";
import BottomNav from "./TaskManager/BottomNav";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  category: "work" | "personal";
  date?: Date;
}

interface HomeProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onEditTask: (task: {
    id: string;
    title: string;
    category: "work" | "personal";
    date: Date;
  }) => void;
  onToggleComplete: (id: string) => void;
  onTogglePin: (id: string) => void;
  onDeleteTask: (id: string) => void;
}

const Home = ({
  tasks,
  setTasks,
  onEditTask,
  onToggleComplete,
  onTogglePin,
  onDeleteTask,
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
    <div className="w-screen h-screen bg-background flex flex-col items-center relative">
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
      />
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Home;
