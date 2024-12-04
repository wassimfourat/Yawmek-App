import React from "react";
import TaskSection from "./TaskSection";
import { ScrollArea } from "@/components/ui/scroll-area";
import SearchBar from "./SearchBar";

type Priority = "high" | "medium" | "low";
type SortOption = "priority" | "date" | "title";

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
  defaultSort?: SortOption;
}

const TaskList = ({
  activeTasks = [],
  completedTasks = [],
  onToggleComplete = () => {},
  onTogglePin = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
  onToggleNotifications = () => {},
  defaultSort = "priority",
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

  // Sort tasks based on selected option
  const sortTasks = (tasks: Task[]) => {
    const priorityOrder = { high: 0, medium: 1, low: 2 };

    return [...tasks].sort((a, b) => {
      // Always prioritize pinned tasks
      if (a.pinned !== b.pinned) {
        return a.pinned ? -1 : 1;
      }

      switch (defaultSort) {
        case "priority":
          return priorityOrder[a.priority] - priorityOrder[b.priority];

        case "date":
          if (!a.date || !b.date) return 0;
          return new Date(a.date).getTime() - new Date(b.date).getTime();

        case "title":
          return a.title.localeCompare(b.title);

        default:
          return 0;
      }
    });
  };

  const sortedActiveTasks = sortTasks(filterTasks(activeTasks));
  const sortedCompletedTasks = sortTasks(filterTasks(completedTasks));

  return (
    <div className="w-[390px] h-[684px] bg-background">
      <div className="px-4 py-2">
        <SearchBar value={searchQuery} onChange={setSearchQuery} />
      </div>
      <ScrollArea className="h-[calc(100%-56px)] px-4">
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
            title={`Completed Tasks (${sortedCompletedTasks.length})`}
            tasks={sortedCompletedTasks}
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
