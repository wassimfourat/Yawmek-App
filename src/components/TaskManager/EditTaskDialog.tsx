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
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Switch } from "@/components/ui/switch";

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
    notifications?: boolean;
    notificationTime?: Date;
  };
  onSave?: (task: {
    id: string;
    title: string;
    category: "work" | "personal";
    priority: Priority;
    date: Date;
    notifications?: boolean;
    notificationTime?: Date;
  }) => void;
}

const EditTaskDialog = ({
  open = false,
  onOpenChange = () => {},
  task = {
    id: "",
    title: "",
    category: "work" as const,
    priority: "medium" as Priority,
    date: new Date(),
    notifications: false,
  },
  onSave = () => {},
}: EditTaskDialogProps) => {
  const [title, setTitle] = React.useState(task.title);
  const [category, setCategory] = React.useState<"work" | "personal">(
    task.category,
  );
  const [priority, setPriority] = React.useState<Priority>(task.priority);
  const [date, setDate] = React.useState<Date>(task.date);
  const [notifications, setNotifications] = React.useState(
    task.notifications || false,
  );
  const [notificationTime, setNotificationTime] =
    React.useState<string>("09:00");

  React.useEffect(() => {
    if (open) {
      setTitle(task.title);
      setCategory(task.category);
      setPriority(task.priority);
      setDate(task.date);
      setNotifications(task.notifications || false);
      setNotificationTime(
        task.notificationTime
          ? format(task.notificationTime, "HH:mm")
          : "09:00",
      );
    }
  }, [open, task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let notificationTimeDate;
    if (notifications) {
      const [hours, minutes] = notificationTime.split(":").map(Number);
      notificationTimeDate = new Date(date);
      notificationTimeDate.setHours(hours, minutes);
    }

    onSave({
      id: task.id,
      title,
      category,
      priority,
      date,
      notifications,
      notificationTime: notificationTimeDate,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogTitle>Edit Task</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Task Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter task title"
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
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="high" id="priority-high" />
                  <Label
                    htmlFor="priority-high"
                    className="cursor-pointer text-red-500"
                  >
                    High
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="medium" id="priority-medium" />
                  <Label
                    htmlFor="priority-medium"
                    className="cursor-pointer text-yellow-500"
                  >
                    Medium
                  </Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="low" id="priority-low" />
                  <Label
                    htmlFor="priority-low"
                    className="cursor-pointer text-green-500"
                  >
                    Low
                  </Label>
                </div>
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

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Notifications</Label>
                <Switch
                  checked={notifications}
                  onCheckedChange={setNotifications}
                />
              </div>

              {notifications && (
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <Input
                    type="time"
                    value={notificationTime}
                    onChange={(e) => setNotificationTime(e.target.value)}
                    className="w-full"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700"
              disabled={!title.trim()}
            >
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default EditTaskDialog;
