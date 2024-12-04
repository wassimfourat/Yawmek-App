import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Pin,
  Calendar as CalendarIcon,
  Pencil,
  Trash2,
  Flag,
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

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

const getPriorityColor = (priority: Priority) => {
  switch (priority) {
    case "high":
      return "text-red-500 dark:text-red-400";
    case "medium":
      return "text-yellow-500 dark:text-yellow-400";
    case "low":
      return "text-green-500 dark:text-green-400";
    default:
      return "text-gray-500";
  }
};

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
  const [isNotificationPopoverOpen, setIsNotificationPopoverOpen] =
    React.useState(false);
  const [selectedTime, setSelectedTime] = React.useState(
    notificationTime ? format(notificationTime, "HH:mm") : "09:00",
  );

  const handleDelete = () => {
    onDelete(id);
    setIsDeleteDialogOpen(false);
  };

  const handleNotificationToggle = (checked: boolean) => {
    if (checked) {
      const [hours, minutes] = selectedTime.split(":").map(Number);
      const newDate = new Date();
      newDate.setHours(hours, minutes);
      onToggleNotifications(id, true, newDate);
    } else {
      onToggleNotifications(id, false);
    }
  };

  const handleTimeChange = (time: string) => {
    setSelectedTime(time);
    const [hours, minutes] = time.split(":").map(Number);
    const newDate = new Date();
    newDate.setHours(hours, minutes);
    onToggleNotifications(id, true, newDate);
  };

  return (
    <>
      <div
        className={`w-[358px] bg-card flex flex-col gap-2 px-4 py-3 border ${pinned ? "border-purple-400 dark:border-purple-600" : "border-border"} rounded-lg transition-colors duration-200`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Checkbox
              checked={completed}
              onCheckedChange={() => onToggleComplete(id)}
              className="border-purple-300 data-[state=checked]:bg-purple-500 data-[state=checked]:border-purple-500"
            />
            <span
              className={`text-sm ${completed ? "text-muted-foreground line-through" : "text-foreground"}`}
            >
              {title}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`${getPriorityColor(priority)}`}>
                    <Flag className="h-4 w-4" fill="currentColor" />
                  </div>
                </TooltipTrigger>
                <TooltipContent>{`${priority} priority`}</TooltipContent>
              </Tooltip>

              <Popover
                open={isNotificationPopoverOpen}
                onOpenChange={setIsNotificationPopoverOpen}
              >
                <PopoverTrigger asChild>
                  <button
                    className={`p-1 rounded-full hover:bg-accent ${notifications ? "text-purple-600" : "text-muted-foreground hover:text-purple-600"}`}
                  >
                    <Bell className="h-4 w-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-[240px]">
                  <div className="grid gap-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Bell className="h-4 w-4 text-purple-600" />
                        <Label>Alarm</Label>
                      </div>
                      <Switch
                        checked={notifications}
                        onCheckedChange={handleNotificationToggle}
                      />
                    </div>
                    {notifications && (
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <Input
                          type="time"
                          value={selectedTime}
                          onChange={(e) => handleTimeChange(e.target.value)}
                          className="w-full"
                        />
                      </div>
                    )}
                  </div>
                </PopoverContent>
              </Popover>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsEditOpen(true)}
                    className="p-1 rounded-full hover:bg-accent text-muted-foreground hover:text-purple-600"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Edit task</TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => onTogglePin(id)}
                    className={`p-1 rounded-full hover:bg-accent ${pinned ? "text-purple-600" : "text-muted-foreground hover:text-purple-600"}`}
                  >
                    <Pin
                      className="h-4 w-4"
                      fill={pinned ? "currentColor" : "none"}
                    />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  {pinned ? "Unpin task" : "Pin task"}
                </TooltipContent>
              </Tooltip>

              <Tooltip>
                <TooltipTrigger asChild>
                  <button
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="p-1 rounded-full hover:bg-accent text-muted-foreground hover:text-red-600"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </TooltipTrigger>
                <TooltipContent>Delete task</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-9">
          {category && (
            <span
              className={`text-xs px-2 py-1 rounded-full ${category === "work" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300" : "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300"}`}
            >
              {category}
            </span>
          )}
          {date && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarIcon className="h-3 w-3" />
              {format(date, "MMM d, yyyy")}
            </div>
          )}
          {notifications && notificationTime && (
            <div className="flex items-center gap-1 text-xs text-purple-600">
              <Bell className="h-3 w-3" />
              {format(notificationTime, "HH:mm")}
            </div>
          )}
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
              onClick={handleDelete}
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
