import React from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import "react-day-picker/dist/style.css";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskItem from "./TaskItem";
import BottomNav from "./BottomNav";

type Priority = "high" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  category: "work" | "personal";
  priority: Priority;
  date?: Date;
  notifications: boolean;
  notificationTime?: Date;
}

interface CalendarProps {
  tasks?: Task[];
  onToggleComplete?: (id: string) => void;
  onTogglePin?: (id: string) => void;
  onEditTask?: (task: {
    id: string;
    title: string;
    category: "work" | "personal";
    priority: Priority;
    date: Date;
  }) => void;
  onDeleteTask?: (id: string) => void;
  onToggleNotifications?: (id: string, enabled: boolean, time?: Date) => void;
}

const Calendar = ({
  tasks = [],
  onToggleComplete = () => {},
  onTogglePin = () => {},
  onEditTask = () => {},
  onDeleteTask = () => {},
  onToggleNotifications = () => {},
}: CalendarProps) => {
  const [date, setDate] = React.useState<Date>(new Date());
  const [activeTab, setActiveTab] = React.useState<
    "home" | "calendar" | "profile"
  >("calendar");

  const selectedDateTasks = tasks.filter(
    (task) => task.date?.toDateString() === date?.toDateString(),
  );

  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col items-center">
      <div className="w-[390px] p-4 space-y-4 pb-[100px] overflow-auto">
        <Card className="p-4 shadow-lg border-purple-100">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">
            Calendar
          </h2>
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border-purple-100"
            classNames={{
              head_cell: "text-purple-600 font-semibold",
              cell: "text-center text-sm p-0 relative [&:has([aria-selected])]:bg-purple-50 first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
              day: "h-9 w-9 p-0 font-normal aria-selected:opacity-100",
              day_selected:
                "bg-purple-600 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white",
              day_today: "bg-purple-100 text-purple-900",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-400 opacity-50",
              day_range_middle:
                "aria-selected:bg-purple-50 aria-selected:text-purple-900",
              day_hidden: "invisible",
              nav_button: "text-purple-600 hover:bg-purple-50",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              caption: "text-purple-800 font-semibold",
            }}
          />
        </Card>

        <Card className="p-4 shadow-lg border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-purple-800">
              Tasks for {date?.toLocaleDateString()}
            </h2>
            <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              {selectedDateTasks.length} tasks
            </span>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3 pr-4">
              {selectedDateTasks.map((task) => (
                <TaskItem
                  key={task.id}
                  {...task}
                  onToggleComplete={onToggleComplete}
                  onTogglePin={onTogglePin}
                  onEdit={onEditTask}
                  onDelete={onDeleteTask}
                  onToggleNotifications={onToggleNotifications}
                />
              ))}
              {selectedDateTasks.length === 0 && (
                <div className="text-center py-8 text-gray-500 bg-purple-50/50 rounded-lg">
                  <p className="text-sm">No tasks scheduled for this date</p>
                  <p className="text-xs mt-1 text-purple-600">
                    Select a different date or add a new task
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </Card>
      </div>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Calendar;
