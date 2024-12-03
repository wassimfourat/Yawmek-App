import React from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { Pin, Calendar as CalendarIcon, Pencil, Trash2 } from "lucide-react";
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

interface TaskItemProps {
  id?: string;
  title?: string;
  completed?: boolean;
  pinned?: boolean;
  category?: "work" | "personal";
  date?: Date;
  onToggleComplete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onEdit?: (task: {
    id: string;
    title: string;
    category: "work" | "personal";
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
  date = new Date(),
  onToggleComplete = () => {},
  onTogglePin = () => {},
  onEdit = () => {},
  onDelete = () => {},
}: TaskItemProps) => {
  const [isEditOpen, setIsEditOpen] = React.useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);

  const handleDelete = () => {
    onDelete(id);
    setIsDeleteDialogOpen(false);
  };

  return (
    <>
      <div className="w-[358px] bg-card flex flex-col gap-2 px-4 py-3 border border-border rounded-lg">
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
            <button
              onClick={() => setIsEditOpen(true)}
              className="p-1 rounded-full hover:bg-accent text-muted-foreground hover:text-purple-600"
            >
              <Pencil className="h-4 w-4" />
            </button>
            <button
              onClick={() => onTogglePin(id)}
              className={`p-1 rounded-full hover:bg-accent ${pinned ? "text-purple-600" : "text-muted-foreground"}`}
            >
              <Pin className="h-4 w-4" />
            </button>
            <button
              onClick={() => setIsDeleteDialogOpen(true)}
              className="p-1 rounded-full hover:bg-accent text-muted-foreground hover:text-red-600"
            >
              <Trash2 className="h-4 w-4" />
            </button>
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
        </div>
      </div>

      <EditTaskDialog
        open={isEditOpen}
        onOpenChange={setIsEditOpen}
        task={{ id, title, category, date }}
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
