import React from "react";
import TaskSection from "./TaskSection";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  category: "work" | "personal";
  date?: Date;
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
    date: Date;
  }) => void;
  onDeleteTask?: (id: string) => void;
}

const TaskList = ({
  activeTasks = [],
  completedTasks = [],
  onToggleComplete = () => {},
  onTogglePin = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
}: TaskListProps) => {
  const [activeCollapsed, setActiveCollapsed] = React.useState(false);
  const [completedCollapsed, setCompletedCollapsed] = React.useState(false);

  return (
    <div className="w-[390px] h-[684px] bg-gray-50">
      <ScrollArea className="h-full px-4 py-2">
        <div className="space-y-4">
          <TaskSection
            title="Active Tasks"
            tasks={activeTasks}
            isCollapsed={activeCollapsed}
            onToggleCollapse={() => setActiveCollapsed(!activeCollapsed)}
            onToggleComplete={onToggleComplete}
            onTogglePin={onTogglePin}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
          <TaskSection
            title="Completed Tasks"
            tasks={completedTasks}
            isCollapsed={completedCollapsed}
            onToggleCollapse={() => setCompletedCollapsed(!completedCollapsed)}
            onToggleComplete={onToggleComplete}
            onTogglePin={onTogglePin}
            onEditTask={onEditTask}
            onDeleteTask={onDeleteTask}
          />
        </div>
      </ScrollArea>
    </div>
  );
};

export default TaskList;
