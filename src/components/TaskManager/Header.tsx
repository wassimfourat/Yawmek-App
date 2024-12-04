import React from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import NewTaskForm from "./NewTaskForm";

interface HeaderProps {
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
  onAddTask?: (task: {
    title: string;
    category: "work" | "personal";
    date: Date;
    notifications: boolean;
    notificationTime?: Date;
  }) => void;
  isAddTaskOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const Header = ({
  onCategoryChange = () => {},
  selectedCategory = "all",
  onAddTask = () => {},
  isAddTaskOpen = false,
  onOpenChange = () => {},
}: HeaderProps) => {
  return (
    <div className="w-full px-4 py-2 flex items-center justify-between">
      <div className="flex gap-2">
        <Button
          variant={selectedCategory === "all" ? "default" : "ghost"}
          className={`rounded-full ${selectedCategory === "all" ? "bg-purple-100 hover:bg-purple-200 text-purple-900" : ""}`}
          onClick={() => onCategoryChange("all")}
        >
          All
        </Button>
        <Button
          variant={selectedCategory === "work" ? "default" : "ghost"}
          className={`rounded-full ${selectedCategory === "work" ? "bg-purple-100 hover:bg-purple-200 text-purple-900" : ""}`}
          onClick={() => onCategoryChange("work")}
        >
          Work
        </Button>
        <Button
          variant={selectedCategory === "personal" ? "default" : "ghost"}
          className={`rounded-full ${selectedCategory === "personal" ? "bg-purple-100 hover:bg-purple-200 text-purple-900" : ""}`}
          onClick={() => onCategoryChange("personal")}
        >
          Personal
        </Button>
      </div>

      <Dialog open={isAddTaskOpen} onOpenChange={onOpenChange}>
        <Button
          size="icon"
          variant="ghost"
          className="h-10 w-10 rounded-full bg-purple-100 hover:bg-purple-200"
          onClick={() => onOpenChange(true)}
        >
          <Plus className="h-5 w-5 text-purple-900" />
        </Button>
        <DialogContent>
          <NewTaskForm
            onSubmit={onAddTask}
            onCancel={() => onOpenChange(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
