import React from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import NewTaskForm from "./NewTaskForm";

interface AddTaskButtonProps {
  onAddTask?: (task: {
    title: string;
    category: "work" | "personal";
    date: Date;
  }) => void;
  isOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const AddTaskButton = ({
  onAddTask = () => {},
  isOpen,
  onOpenChange = () => {},
}: AddTaskButtonProps) => {
  const [open, setOpen] = React.useState(false);

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    onOpenChange?.(newOpen);
  };

  const handleSubmit = (task: {
    title: string;
    category: "work" | "personal";
    date: Date;
  }) => {
    onAddTask(task);
    handleOpenChange(false);
  };

  return (
    <Dialog open={isOpen ?? open} onOpenChange={handleOpenChange}>
      <Button
        variant="ghost"
        size="icon"
        className="w-[40px] h-[40px] rounded-full bg-purple-100 hover:bg-purple-200"
        onClick={() => handleOpenChange(true)}
      >
        <Plus className="h-5 w-5 text-purple-800" />
      </Button>
      <DialogContent className="sm:max-w-[358px]">
        <DialogTitle className="text-lg font-semibold mb-4">
          Add New Task
        </DialogTitle>
        <NewTaskForm
          onSubmit={handleSubmit}
          onCancel={() => handleOpenChange(false)}
        />
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskButton;
