import React from "react";
import CategoryTabs from "./CategoryTabs";
import AddTaskButton from "./AddTaskButton";

interface HeaderProps {
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
  onAddTask?: (task: {
    title: string;
    category: "work" | "personal";
    date: Date;
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
    <div className="w-[390px] h-[60px] bg-card flex items-center justify-between px-4 shadow-sm border-b border-border">
      <CategoryTabs
        onCategoryChange={onCategoryChange}
        selectedCategory={selectedCategory}
      />
      <AddTaskButton
        onAddTask={onAddTask}
        isOpen={isAddTaskOpen}
        onOpenChange={onOpenChange}
      />
    </div>
  );
};

export default Header;
