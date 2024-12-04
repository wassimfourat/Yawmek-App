import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Pin,
  Calendar as CalendarIcon,
  Pencil,
  Trash2,
  Bell,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import EditTaskDialog from "./EditTaskDialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  onDelete = () => {},
}: TaskItemProps) => {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  return (
    <>
      <div className="w-full bg-card rounded-lg border border-border hover:border-purple-200 transition-colors">
        <div className="px-4 py-3">
          {/* Main Task Content */}
          <div className="flex items-center gap-3">
            <Checkbox
              checked={completed}
              onCheckedChange={() => onToggleComplete(id)}
              className="border-purple-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <div className="flex-1">
              <span
                className={`text-sm ${completed ? "text-muted-foreground line-through" : "text-foreground"}`}
              >
                {title}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded-full ${category === "work" ? "bg-blue-100 text-blue-800" : "bg-green-100 text-green-800"}`}
                >
                  {category}
                </span>
                {date && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <CalendarIcon className="h-3 w-3" />
                    {format(date, "MMM d, yyyy")}
                  </div>
                )}
                {notifications && notificationTime && (
                  <div className="flex items-center gap-1 text-xs text-purple-600">
                    <Clock className="h-3 w-3" />
                    {format(notificationTime, "HH:mm")}
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-1">
              {notifications && (
                <button
                  onClick={() => onToggleNotifications(id, !notifications)}
                  className="p-1.5 rounded-full hover:bg-accent text-purple-600"
                >
                  <Bell className="h-4 w-4" />
                </button>
              )}
              <button
                onClick={() => setIsEditOpen(true)}
                className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-purple-600"
              >
                <Pencil className="h-4 w-4" />
              </button>
              <button
                onClick={() => onTogglePin(id)}
                className={`p-1.5 rounded-full hover:bg-accent ${pinned ? "text-purple-600" : "text-muted-foreground hover:text-purple-600"}`}
              >
                <Pin
                  className="h-4 w-4"
                  fill={pinned ? "currentColor" : "none"}
                />
              </button>
              <button
                onClick={() => setIsDeleteDialogOpen(true)}
                className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
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

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be
              undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete(id);
                setIsDeleteDialogOpen(false);
              }}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TaskItem;
