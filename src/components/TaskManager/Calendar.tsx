import React from "react";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import "react-day-picker/dist/style.css";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import TaskItem from "./TaskItem";
import BottomNav from "./BottomNav";
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

  // Get tasks for each day to show indicators
  const getDayTasks = (day: Date) => {
    return tasks.filter(
      (task) => task.date?.toDateString() === day.toDateString(),
    );
  };

  // Custom modifiers for the calendar
  const modifiers = {
    taskDay: (day: Date) => getDayTasks(day).length > 0,
    taskDayCompleted: (day: Date) =>
      getDayTasks(day).every((task) => task.completed),
    taskDayPartial: (day: Date) => {
      const dayTasks = getDayTasks(day);
      return (
        dayTasks.some((task) => task.completed) &&
        dayTasks.some((task) => !task.completed)
      );
    },
  };

  // Custom modifier styles
  const modifiersStyles = {
    taskDay: {
      border: "2px solid var(--purple-500)",
    },
    taskDayCompleted: {
      backgroundColor: "var(--green-100)",
      color: "var(--green-900)",
    },
    taskDayPartial: {
      backgroundColor: "var(--yellow-100)",
      color: "var(--yellow-900)",
    },
  };

  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col items-center relative">
      <div className="w-full max-w-md p-4 space-y-4 pb-[100px] overflow-auto">
        <Card className="p-6 shadow-lg border-purple-100">
          <h2 className="text-xl font-semibold mb-4 text-purple-800">
            Calendar
          </h2>
          <CalendarComponent
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            className="rounded-md border-purple-100"
            modifiers={modifiers}
            modifiersStyles={modifiersStyles}
            classNames={{
              months:
                "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
              month: "space-y-4",
              caption: "flex justify-center pt-1 relative items-center",
              caption_label: "text-sm font-medium text-purple-900",
              nav: "space-x-1 flex items-center",
              nav_button:
                "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100",
              nav_button_previous: "absolute left-1",
              nav_button_next: "absolute right-1",
              table: "w-full border-collapse space-y-1",
              head_row: "flex justify-between w-full",
              head_cell:
                "text-purple-600 rounded-md w-9 font-normal text-[0.8rem] text-center",
              row: "flex w-full mt-2 justify-between",
              cell: "text-center text-sm p-0 relative rounded-md h-9 w-9 hover:bg-purple-100 focus-within:relative focus-within:z-20 flex items-center justify-center",
              day: "h-9 w-9 p-0 font-normal rounded-md aria-selected:opacity-100 hover:bg-purple-100 flex items-center justify-center",
              day_selected:
                "bg-purple-600 text-white hover:bg-purple-600 hover:text-white focus:bg-purple-600 focus:text-white",
              day_today: "bg-purple-100 text-purple-900",
              day_outside: "text-gray-400 opacity-50",
              day_disabled: "text-gray-400 opacity-50",
              day_range_middle:
                "aria-selected:bg-purple-50 aria-selected:text-purple-900",
              day_hidden: "invisible",
            }}
            components={{
              IconLeft: ({ ...props }) => (
                <ChevronLeft className="h-4 w-4 text-purple-600" />
              ),
              IconRight: ({ ...props }) => (
                <ChevronRight className="h-4 w-4 text-purple-600" />
              ),
            }}
          />
        </Card>

        <Card className="p-6 shadow-lg border-purple-100">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-purple-800">
              Tasks for {date?.toLocaleDateString()}
            </h2>
            <span className="text-sm text-purple-600 bg-purple-50 px-3 py-1 rounded-full">
              {selectedDateTasks.length} tasks
            </span>
          </div>
          <ScrollArea className="h-[300px]">
            <div className="space-y-3">
              {selectedDateTasks.map((task) => (
                <div key={task.id} className="px-0.5">
                  <TaskItem
                    {...task}
                    onToggleComplete={onToggleComplete}
                    onTogglePin={onTogglePin}
                    onEdit={onEditTask}
                    onDelete={onDeleteTask}
                    onToggleNotifications={onToggleNotifications}
                  />
                </div>
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
