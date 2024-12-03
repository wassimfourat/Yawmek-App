import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BellRing, Moon, Sun, User } from "lucide-react";
import BottomNav from "./BottomNav";
import EditProfileDialog from "./EditProfileDialog";
import { useTheme } from "@/lib/theme-provider";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  category: "work" | "personal";
  date?: Date;
}

interface ProfileProps {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
  tasks?: Task[];
}

const Profile = ({
  user = {
    name: "John Doe",
    email: "john@example.com",
  },
  tasks = [],
}: ProfileProps) => {
  const { theme, setTheme } = useTheme();
  const [notifications, setNotifications] = React.useState(true);
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);

  // Calculate task statistics
  const completedTasksCount = tasks.filter((task) => task.completed).length;
  const activeTasksCount = tasks.filter((task) => !task.completed).length;

  const handleSaveProfile = (updatedUser: {
    name: string;
    email: string;
    avatar?: string;
  }) => {
    // Here you would typically update the user data in your backend
    console.log("Updated user:", updatedUser);
  };

  return (
    <div className="w-screen h-screen bg-background flex flex-col items-center pb-[100px]">
      <div className="w-full max-w-md p-4 space-y-4">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-16 h-16 rounded-full"
                />
              ) : (
                <User className="w-8 h-8 text-purple-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground">
                {user.name}
              </h2>
              <p className="text-sm text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="mt-4 w-full"
            onClick={() => setIsEditProfileOpen(true)}
          >
            Edit Profile
          </Button>
          <EditProfileDialog
            open={isEditProfileOpen}
            onOpenChange={setIsEditProfileOpen}
            user={user}
            onSave={handleSaveProfile}
          />
        </Card>

        {/* Settings Card */}
        <Card className="p-6 space-y-6">
          <h3 className="text-lg font-semibold text-foreground">Settings</h3>

          <div className="space-y-4">
            {/* Dark Mode */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                {theme === "dark" ? (
                  <Moon className="w-5 h-5 text-purple-600" />
                ) : (
                  <Sun className="w-5 h-5 text-purple-600" />
                )}
                <Label htmlFor="dark-mode" className="text-foreground">
                  Dark Mode
                </Label>
              </div>
              <Switch
                id="dark-mode"
                checked={theme === "dark"}
                onCheckedChange={(checked) =>
                  setTheme(checked ? "dark" : "light")
                }
              />
            </div>

            <Separator />

            {/* Notifications */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BellRing className="w-5 h-5 text-purple-600" />
                <Label htmlFor="notifications" className="text-foreground">
                  Notifications
                </Label>
              </div>
              <Switch
                id="notifications"
                checked={notifications}
                onCheckedChange={setNotifications}
              />
            </div>
          </div>
        </Card>

        {/* Stats Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 text-foreground">
            Task Statistics
          </h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Completed Tasks
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {completedTasksCount}
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <p className="text-sm text-purple-600 dark:text-purple-400">
                Active Tasks
              </p>
              <p className="text-2xl font-semibold text-foreground">
                {activeTasksCount}
              </p>
            </div>
          </div>
        </Card>
      </div>
      <BottomNav activeTab="profile" />
    </div>
  );
};

export default Profile;
