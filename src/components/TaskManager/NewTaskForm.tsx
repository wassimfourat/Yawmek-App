import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NewTaskFormProps {
  onSubmit?: (task: {
    title: string;
    category: "work" | "personal";
    date: Date;
  }) => void;
  onCancel?: () => void;
}

const NewTaskForm = ({
  onSubmit = () => {},
  onCancel = () => {},
}: NewTaskFormProps) => {
  const [title, setTitle] = React.useState("");
  const [category, setCategory] = React.useState<"work" | "personal">("work");
  const [date, setDate] = React.useState<Date>(new Date());

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onSubmit({ title, category, date });
    setTitle("");
    setCategory("work");
    setDate(new Date());
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        placeholder="Enter task title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full"
      />

      <RadioGroup
        value={category}
        onValueChange={(value) => setCategory(value as "work" | "personal")}
        className="flex gap-4"
      >
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="work" id="work" />
          <label htmlFor="work" className="text-sm font-medium cursor-pointer">
            Work
          </label>
        </div>
        <div className="flex items-center space-x-2">
          <RadioGroupItem value="personal" id="personal" />
          <label
            htmlFor="personal"
            className="text-sm font-medium cursor-pointer"
          >
            Personal
          </label>
        </div>
      </RadioGroup>

      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant={"outline"}
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground",
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "MMM d, yyyy") : <span>Pick a date</span>}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            initialFocus
          />
        </PopoverContent>
      </Popover>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="px-6"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          className="bg-purple-600 hover:bg-purple-700 px-6"
          disabled={!title.trim()}
        >
          Add Task
        </Button>
      </div>
    </form>
  );
};

export default NewTaskForm;
