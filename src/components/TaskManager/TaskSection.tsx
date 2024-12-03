import React from "react";
import TaskItem from "./TaskItem";
import { ChevronDown, ChevronUp } from "lucide-react";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  category: "work" | "personal";
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
    date: Date;
  }) => void;
  onDeleteTask?: (id: string) => void;
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
}: TaskSectionProps) => {
  return (
    <div className="w-[390px] bg-card p-4 space-y-3 border border-border rounded-lg">
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
        <div className="space-y-2">
          {tasks.map((task) => (
            <TaskItem
              key={task.id}
              {...task}
              onToggleComplete={onToggleComplete}
              onTogglePin={onTogglePin}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default TaskSection;
