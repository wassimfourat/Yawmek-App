import React from "react";
import TaskItem from "./TaskItem";
import { ChevronDown, ChevronUp } from "lucide-react";

type Priority = "high" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  category: "work" | "personal";
  priority: Priority;
  date?: Date;
}

interface TaskSectionProps {
  title?: string;
  tasks?: Task[];
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
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

const TaskSection = ({
  title = "Active Tasks",
  tasks = [],
  isCollapsed = false,
  onToggleCollapse = () => {},
  onToggleComplete = () => {},
  onTogglePin = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
  onToggleNotifications = () => {},
}: TaskSectionProps) => {
  return (
    <div className="w-full bg-card rounded-lg border border-border shadow-sm">
      <div className="p-4">
        <div
          className="flex items-center justify-between cursor-pointer"
          onClick={onToggleCollapse}
        >
          <h2 className="text-lg font-semibold text-foreground">{title}</h2>
          <button className="p-1 hover:bg-accent rounded-full text-muted-foreground">
            {isCollapsed ? (
              <ChevronDown className="h-5 w-5" />
            ) : (
              <ChevronUp className="h-5 w-5" />
            )}
          </button>
        </div>

        {!isCollapsed && (
          <div className="mt-4 space-y-3">
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                {...task}
                onToggleComplete={onToggleComplete}
                onTogglePin={onTogglePin}
                onEdit={onEditTask}
                onDelete={onDeleteTask}
                onToggleNotifications={onToggleNotifications}
              />
            ))}
            {tasks.length === 0 && (
              <div className="text-center py-4 text-muted-foreground">
                No tasks available
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskSection;
