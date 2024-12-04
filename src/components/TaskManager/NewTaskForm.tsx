import React from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Bell, Clock } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface NewTaskFormProps {
  onSubmit?: (task: {
    title: string;
    category: "work" | "personal";
    date: Date;
    notifications: boolean;
    notificationTime?: Date;
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
  const [notifications, setNotifications] = React.useState(false);
  const [notificationTime, setNotificationTime] = React.useState("09:00");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    let notificationDate;
    if (notifications) {
      const [hours, minutes] = notificationTime.split(":").map(Number);
      notificationDate = new Date(date);
      notificationDate.setHours(hours, minutes);
    }

    onSubmit({
      title,
      category,
      date,
      notifications,
      notificationTime: notificationDate,
    });

    setTitle("");
    setCategory("work");
    setDate(new Date());
    setNotifications(false);
    setNotificationTime("09:00");
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

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-purple-600" />
            <Label>Set Alarm</Label>
          </div>
          <Switch checked={notifications} onCheckedChange={setNotifications} />
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
