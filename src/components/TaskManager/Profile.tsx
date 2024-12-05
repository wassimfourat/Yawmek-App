import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BellRing, Moon, Sun, User } from "lucide-react";
import BottomNav from "./BottomNav";
import EditProfileDialog from "./EditProfileDialog";
import TaskStatistics from "./TaskStatistics";
import { useTheme } from "@/lib/theme-provider";

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

interface ProfileProps {
  tasks?: Task[];
  onSortChange?: (sort: "priority" | "date" | "title") => void;
  defaultSort?: "priority" | "date" | "title";
}

const Profile = ({
  tasks = [],
  onSortChange = () => {},
  defaultSort = "priority",
}: ProfileProps) => {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = React.useState<
    "home" | "calendar" | "profile"
  >("profile");
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
  const [user, setUser] = React.useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "https://dummyimage.com/100x100/6366f1/ffffff.png&text=JD",
  });

  const handleSaveProfile = (updatedUser: {
    name: string;
    email: string;
    avatar?: string;
  }) => {
    setUser({
      ...updatedUser,
      avatar: updatedUser.avatar || user.avatar, // Keep existing avatar if none provided
    });
  };

  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col relative">
      <div className="flex-1 p-4 space-y-4 overflow-auto">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-100 flex-shrink-0">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <User className="w-full h-full p-2 text-purple-600" />
              )}
            </div>
            <div>
              <h2 className="text-xl font-semibold">{user.name}</h2>
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
        </Card>

        {/* Settings Card */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Settings</h3>
          <div className="space-y-4">
            {/* Theme Toggle */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === "dark" ? (
                  <Moon className="h-4 w-4" />
                ) : (
                  <Sun className="h-4 w-4" />
                )}
                <span>Theme</span>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              >
                {theme === "dark" ? "Light" : "Dark"}
              </Button>
            </div>

            {/* Sort Preference */}
            <div className="space-y-2">
              <Label>Default Sort</Label>
              <div className="flex gap-2">
                <Button
                  variant={defaultSort === "priority" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortChange("priority")}
                  className={defaultSort === "priority" ? "bg-purple-600" : ""}
                >
                  Priority
                </Button>
                <Button
                  variant={defaultSort === "date" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortChange("date")}
                  className={defaultSort === "date" ? "bg-purple-600" : ""}
                >
                  Date
                </Button>
                <Button
                  variant={defaultSort === "title" ? "default" : "outline"}
                  size="sm"
                  onClick={() => onSortChange("title")}
                  className={defaultSort === "title" ? "bg-purple-600" : ""}
                >
                  Title
                </Button>
              </div>
            </div>
          </div>
        </Card>

        {/* Statistics */}
        <TaskStatistics tasks={tasks} />
      </div>

      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        user={user}
        onSave={handleSaveProfile}
      />
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Profile;

