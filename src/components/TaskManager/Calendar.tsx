import React from "react";
import BottomNav from "./BottomNav";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import TaskItem from "./TaskItem";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
    notifications?: boolean;
    notificationTime?: Date;
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
  const [activeTab, setActiveTab] = React.useState<
    "home" | "calendar" | "profile"
  >("calendar");
  const [selectedDate, setSelectedDate] = React.useState<Date>(new Date());

  const tasksForSelectedDate = tasks.filter((task) => {
    if (!task.date) return false;
    const taskDate = new Date(task.date);
    return (
      taskDate.getDate() === selectedDate.getDate() &&
      taskDate.getMonth() === selectedDate.getMonth() &&
      taskDate.getFullYear() === selectedDate.getFullYear()
    );
  });

  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col relative">
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-4 flex flex-col">
          <h1 className="text-2xl font-bold text-center mb-6">Calendar</h1>

          <div className="bg-card rounded-lg p-6 border border-border mb-6">
            <CalendarComponent
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              className="w-full"
              showOutsideDays={false}
              fixedWeeks
              components={{
                IconLeft: () => <ChevronLeft className="h-4 w-4" />,
                IconRight: () => <ChevronRight className="h-4 w-4" />,
              }}
              classNames={{
                months: "w-full",
                month: "w-full space-y-4",
                caption: "relative flex justify-center items-center",
                caption_label: "text-sm font-medium",
                nav: "space-x-1 flex items-center",
                nav_button:
                  "absolute top-1/2 -translate-y-1/2 h-7 w-7 bg-transparent p-0 text-muted-foreground hover:text-foreground transition-colors disabled:pointer-events-none disabled:opacity-50",
                nav_button_previous: "left-1",
                nav_button_next: "right-1",
                table: "w-full border-collapse",
                head_row: "flex w-full",
                head_cell:
                  "text-muted-foreground w-9 font-normal text-[0.8rem] rounded-md",
                row: "flex w-full mt-2",
                cell: "text-center text-sm relative p-0 [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20 h-9 w-9",
                day: "h-9 w-9 p-0 font-normal text-sm rounded-md aria-selected:opacity-100 hover:bg-accent hover:text-accent-foreground",
                day_range_end: "day-range-end",
                day_selected:
                  "bg-purple-600 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white",
                day_today: "bg-accent text-accent-foreground",
                day_outside: "day-outside text-muted-foreground opacity-50",
                day_disabled: "text-muted-foreground opacity-50",
                day_hidden: "invisible",
              }}
            />
          </div>

          <div className="flex-1">
            <h2 className="text-lg font-semibold mb-4">
              Tasks for {selectedDate.toLocaleDateString()}
            </h2>
            <div className="space-y-3 pb-20">
              {tasksForSelectedDate.map((task) => (
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
              {tasksForSelectedDate.length === 0 && (
                <div className="text-center py-4 text-muted-foreground">
                  No tasks for this date
                </div>
              )}
            </div>
          </div>
        </div>
      </ScrollArea>
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Calendar;
