import React from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CategoryTabsProps {
  onCategoryChange?: (category: string) => void;
  selectedCategory?: string;
}

const CategoryTabs = ({
  onCategoryChange = () => {},
  selectedCategory = "all",
}: CategoryTabsProps) => {
  return (
    <div className="bg-card w-[300px] h-[40px] flex items-center justify-center">
      <Tabs
        defaultValue={selectedCategory}
        onValueChange={onCategoryChange}
        className="w-full"
      >
        <TabsList className="w-full grid grid-cols-3 bg-muted">
          <TabsTrigger
            value="all"
            className="data-[state=active]:bg-purple-200 dark:data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-300"
          >
            All
          </TabsTrigger>
          <TabsTrigger
            value="work"
            className="data-[state=active]:bg-purple-200 dark:data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-300"
          >
            Work
          </TabsTrigger>
          <TabsTrigger
            value="personal"
            className="data-[state=active]:bg-purple-200 dark:data-[state=active]:bg-purple-900/50 data-[state=active]:text-purple-800 dark:data-[state=active]:text-purple-300"
          >
            Personal
          </TabsTrigger>
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CategoryTabs;
