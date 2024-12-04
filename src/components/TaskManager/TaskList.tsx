import React from "react";
import TaskSection from "./TaskSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBar from "./SearchBar";

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

interface TaskListProps {
  activeTasks?: Task[];
  completedTasks?: Task[];
  onToggleComplete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onEditTask?: (task: {
    id: string;
    title: string;
    category: "work" | "personal";
    priority: Priority;
    date: Date;
  }) => void;
  onDeleteTask?: (id: string) => void;
  onToggleNotifications?: (id: string, enabled: boolean, time?: Date) => void;
}

const TaskList = ({
  activeTasks = [],
  completedTasks = [],
  onToggleComplete = () => {},
  onTogglePin = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
  onToggleNotifications = () => {},
}: TaskListProps) => {
  const [activeCollapsed, setActiveCollapsed] = React.useState(false);
  const [completedCollapsed, setCompletedCollapsed] = React.useState(false);
  const [searchQuery, setSearchQuery] = React.useState("");

  // Filter tasks based on search query
  const filterTasks = (tasks: Task[]) => {
    if (!searchQuery) return tasks;
    const query = searchQuery.toLowerCase();
    return tasks.filter(
      (task) =>
        task.title.toLowerCase().includes(query) ||
        task.category.toLowerCase().includes(query) ||
        task.priority.toLowerCase().includes(query),
    );
  };

  // Sort tasks by priority and pinned status
  const sortedActiveTasks = [...filterTasks(activeTasks)].sort((a, b) => {
    // First sort by pinned status
    if (a.pinned !== b.pinned) {
      return a.pinned ? -1 : 1;
    }

    // Then sort by priority
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority] - priorityOrder[b.priority];
  });

  const filteredCompletedTasks = filterTasks(completedTasks);

  return (
    <div className="w-[390px] h-[684px] bg-background">
      <div className="px-4 py-2">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <ScrollArea className="h-[calc(100%-48px)] px-4">
        <div className="space-y-4">
          <TaskSection
            title={`Active Tasks (${sortedActiveTasks.length})`}
            tasks={sortedActiveTasks}
            isCollapsed={activeCollapsed}
            onToggleCollapse={() => setActiveCollapsed(!activeCollapsed)}
            onToggleComplete={onToggleComplete}
            onTogglePin={onTogglePin}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onToggleNotifications={onToggleNotifications}
          />
          <TaskSection
            title={`Completed Tasks (${filteredCompletedTasks.length})`}
            tasks={filteredCompletedTasks}
            isCollapsed={completedCollapsed}
            onToggleCollapse={() => setCompletedCollapsed(!completedCollapsed)}
            onToggleComplete={onToggleComplete}
            onTogglePin={onTogglePin}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
            onToggleNotifications={onToggleNotifications}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default TaskList;
