import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Bell, Pencil, Pin, Flag } from "lucide-react";
import { format } from "date-fns";
import EditTaskDialog from "./EditTaskDialog";

type Priority = "high" | "medium" | "low";

interface TaskItemProps {
  id?: string;
  title?: string;
  completed?: boolean;
  pinned?: boolean;
  category?: "work" | "personal";
  priority?: Priority;
  date?: Date;
  notifications?: boolean;
  notificationTime?: Date;
  onToggleComplete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onToggleNotifications?: (id: string, enabled: boolean, time?: Date) => void;
  onEdit?: (task: {
    id: string;
    title: string;
    category: "work" | "personal";
    priority: Priority;
    date: Date;
    notifications?: boolean;
    notificationTime?: Date;
  }) => void;
  onDelete?: (id: string) => void;
}

const TaskItem = ({
  id = "1",
  title = "Sample Task",
  completed = false,
  pinned = false,
  category = "work",
  priority = "medium",
  date = new Date(),
  notifications = false,
  notificationTime,
  onToggleComplete = () => {},
  onTogglePin = () => {},
  onToggleNotifications = () => {},
  onEdit = () => {},
}: TaskItemProps) => {
  const [isEditOpen, setIsEditOpen] = React.useState(false);

  const getPriorityColor = (priority: Priority) => {
    switch (priority) {
      case "high":
        return "text-red-500";
      case "medium":
        return "text-yellow-500";
      case "low":
        return "text-green-500";
      default:
        return "text-gray-500";
    }
  };

  return (
    <>
      <div className="flex items-center gap-3 w-full bg-card rounded-lg border border-border p-3 relative dark:bg-[#1c1c1c]">
        <Checkbox
          checked={completed}
          onCheckedChange={() => onToggleComplete(id)}
          className="border-purple-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Flag
              className={`h-3 w-3 ${getPriorityColor(priority)}`}
              fill="currentColor"
            />
            <span
              className={`text-sm truncate ${completed ? "text-muted-foreground line-through" : "text-foreground"}`}
            >
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1">
            <span
              className={`text-xs px-2 py-0.5 rounded-full ${category === "work" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
            >
              {category}
            </span>
            {date && (
              <span className="text-xs text-muted-foreground">
                {format(date, "MMM d")}
              </span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() =>
              onToggleNotifications(id, !notifications, notificationTime)
            }
            className={`p-1.5 rounded-full ${notifications ? "text-purple-600" : "text-muted-foreground hover:text-purple-600"}`}
          >
            <Bell
              className="h-4 w-4"
              fill={notifications ? "currentColor" : "none"}
            />
          </button>
          <button
            onClick={() => setIsEditOpen(true)}
            className="p-1.5 rounded-full text-muted-foreground hover:text-purple-600"
          >
            <Pencil className="h-4 w-4" />
          </button>
          <button
            onClick={() => onTogglePin(id)}
            className={`p-1.5 rounded-full ${pinned ? "text-purple-600" : "text-muted-foreground hover:text-purple-600"}`}
          >
            <Pin className="h-4 w-4" fill={pinned ? "currentColor" : "none"} />
          </button>
        </div>
      </div>

      <EditTaskDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        task={{
          id,
          title,
          category,
          priority,
          date,
          notifications,
          notificationTime,
        }}
        onSave={onEdit}
      />
    </>
  );
};

export default TaskItem;
