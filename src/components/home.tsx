import React from "react";
import Header from "./TaskManager/Header";
import TaskList from "./TaskManager/TaskList";
import BottomNav from "./TaskManager/BottomNav";
import { ScrollArea } from "@/components/ui/scroll-area";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/components/ui/use-toast";

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
  const { toast } = useToast();

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
  };

  const handleTaskSubmit = async (newTask: {
    title: string;
    category: "work" | "personal";
    date: Date;
    notifications: boolean;
    notificationTime?: Date;
  }) => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from("tasks")
        .insert([
          {
            user_id: user.id,
            title: newTask.title,
            category: newTask.category,
            due_date: newTask.date.toISOString(),
            completed: false,
            pinned: false,
            priority: "medium",
            notifications: newTask.notifications,
            notification_time: newTask.notificationTime?.toISOString(),
          },
        ])
        .select()
        .single();

      if (error) throw error;

      const formattedTask = {
        ...data,
        date: new Date(data.due_date),
        notificationTime: data.notification_time
          ? new Date(data.notification_time)
          : undefined,
      };

      setTasks((prevTasks) => [formattedTask, ...prevTasks]);
      setIsAddTaskOpen(false);

      toast({
        title: "Task Created",
        description: "Your task has been successfully created.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create task",
        variant: "destructive",
      });
    }
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
    <div className="w-[390px] h-[844px] bg-background flex flex-col relative">
      <Header
        selectedCategory={selectedCategory}
        onCategoryChange={handleCategoryChange}
        onAddTask={handleTaskSubmit}
        isAddTaskOpen={isAddTaskOpen}
        onOpenChange={setIsAddTaskOpen}
      />
      <ScrollArea className="flex-1 custom-scrollbar">
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
      </ScrollArea>
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default Home;
