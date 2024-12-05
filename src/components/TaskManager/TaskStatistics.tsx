import React from "react";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { PieChart } from "lucide-react";

type Priority = "high" | "medium" | "low";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  category: "work" | "personal";
  priority: Priority;
  date?: Date;
}

interface TaskStatisticsProps {
  tasks: Task[];
}

const TaskStatistics = ({ tasks }: TaskStatisticsProps) => {
  // Calculate basic statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((task) => task.completed).length;
  const completionRate =
    totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  // Calculate category distribution
  const workTasks = tasks.filter((task) => task.category === "work").length;
  const personalTasks = tasks.filter(
    (task) => task.category === "personal",
  ).length;
  const workPercentage = totalTasks > 0 ? (workTasks / totalTasks) * 100 : 0;
  const personalPercentage =
    totalTasks > 0 ? (personalTasks / totalTasks) * 100 : 0;

  // Calculate priority distribution
  const priorityDistribution = {
    high: tasks.filter((task) => task.priority === "high").length,
    medium: tasks.filter((task) => task.priority === "medium").length,
    low: tasks.filter((task) => task.priority === "low").length,
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center gap-2">
        <PieChart className="w-5 h-5 text-purple-600" />
        <h3 className="text-lg font-semibold text-foreground">
          Task Statistics
        </h3>
      </div>

      {/* Completion Rate */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">Completion Rate</span>
          <span className="text-sm font-medium">
            {completionRate.toFixed(0)}%
          </span>
        </div>
        <Progress value={completionRate} className="h-2" />
      </div>

      {/* Category Distribution */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">
          Category Distribution
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Work</span>
              <span className="text-sm font-medium">
                {workPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress
              value={workPercentage}
              className="h-2 bg-blue-100 [&>[role=progressbar]]:bg-blue-600"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Personal</span>
              <span className="text-sm font-medium">
                {personalPercentage.toFixed(0)}%
              </span>
            </div>
            <Progress
              value={personalPercentage}
              className="h-2 bg-green-100 [&>[role=progressbar]]:bg-green-600"
            />
          </div>
        </div>
      </div>

      {/* Priority Distribution */}
      <div className="space-y-4">
        <h4 className="text-sm font-medium text-muted-foreground">
          Priority Distribution
        </h4>
        <div className="space-y-3">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">High Priority</span>
              <span className="text-sm font-medium">
                {priorityDistribution.high}
              </span>
            </div>
            <Progress
              value={(priorityDistribution.high / totalTasks) * 100}
              className="h-2 bg-red-100 [&>[role=progressbar]]:bg-red-600"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Medium Priority</span>
              <span className="text-sm font-medium">
                {priorityDistribution.medium}
              </span>
            </div>
            <Progress
              value={(priorityDistribution.medium / totalTasks) * 100}
              className="h-2 bg-yellow-100 [&>[role=progressbar]]:bg-yellow-600"
            />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm">Low Priority</span>
              <span className="text-sm font-medium">
                {priorityDistribution.low}
              </span>
            </div>
            <Progress
              value={(priorityDistribution.low / totalTasks) * 100}
              className="h-2 bg-green-100 [&>[role=progressbar]]:bg-green-600"
            />
          </div>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 gap-4 pt-2">
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Total Tasks
          </p>
          <p className="text-2xl font-semibold text-foreground">{totalTasks}</p>
        </div>
        <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
          <p className="text-sm text-purple-600 dark:text-purple-400">
            Completed
          </p>
          <p className="text-2xl font-semibold text-foreground">
            {completedTasks}
          </p>
        </div>
      </div>
    </Card>
  );
};

export default TaskStatistics;
