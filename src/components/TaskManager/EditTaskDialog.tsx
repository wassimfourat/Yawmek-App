import React from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Flag } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

type Priority = "high" | "medium" | "low";

interface EditTaskDialogProps {
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  task?: {
    id: string;
    title: string;
    category: "work" | "personal";
    priority: Priority;
    date: Date;
  };
  onSave?: (task: {
    id: string;
    title: string;
    category: "work" | "personal";
    priority: Priority;
    date: Date;
  }) => void;
}

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

const EditTaskDialog = ({
  open = false,
  onOpenChange = () => {},
  task = {
    id: "",
    title: "",
    category: "work" as const,
    priority: "medium" as Priority,
    date: new Date(),
  },
  onSave = () => {},
}: EditTaskDialogProps) => {
  const [title, setTitle] = React.useState(task.title);
  const [category, setCategory] = React.useState<"work" | "personal">(
    task.category,
  );
  const [priority, setPriority] = React.useState<Priority>(task.priority);
  const [date, setDate] = React.useState<Date>(task.date);

  React.useEffect(() => {
    if (open) {
      setTitle(task.title);
      setCategory(task.category);
      setPriority(task.priority);
      setDate(task.date);
    }
  }, [open, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ id: task.id, title, category, priority, date });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[358px]">
        <DialogTitle className="text-lg font-semibold mb-4">
          Edit Task
        </DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                placeholder="Enter task title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label>Category</Label>
              <RadioGroup
                value={category}
                onValueChange={(value) =>
                  setCategory(value as "work" | "personal")
                }
                className="flex gap-4"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="work" id="edit-work" />
                  <Label htmlFor="edit-work" className="cursor-pointer">
                    Work
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="personal" id="edit-personal" />
                  <Label htmlFor="edit-personal" className="cursor-pointer">
                    Personal
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Priority</Label>
              <RadioGroup
                value={priority}
                onValueChange={(value) => setPriority(value as Priority)}
                className="flex gap-4"
              >
                {(["high", "medium", "low"] as Priority[]).map((p) => (
                  <div key={p} className="flex items-center space-x-2">
                    <RadioGroupItem value={p} id={`priority-${p}`} />
                    <Label
                      htmlFor={`priority-${p}`}
                      className={`cursor-pointer flex items-center gap-1 ${getPriorityColor(p)}`}
                    >
                      <Flag className="h-4 w-4" fill="currentColor" />
                      <span className="capitalize">{p}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label>Due Date</Label>
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
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
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
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="w-24"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="w-24 bg-purple-600 hover:bg-purple-700"
              disabled={!title.trim()}
            >
              Save
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
