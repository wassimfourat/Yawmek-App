import React from "react";
import BottomNav from "./BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import TaskStatistics from "./TaskStatistics";
import EditProfileDialog from "./EditProfileDialog";

type DefaultSort = "priority" | "date" | "title";

interface Task {
  id: string;
  title: string;
  completed: boolean;
  pinned: boolean;
  category: "work" | "personal";
  priority: "high" | "medium" | "low";
  date?: Date;
}

interface ProfileProps {
  onSortChange?: (sort: DefaultSort) => void;
  defaultSort?: DefaultSort;
  tasks?: Task[];
  isStorybook?: boolean;
}

const Profile = ({
  onSortChange = () => {},
  defaultSort = "priority",
  tasks = [],
  isStorybook = false,
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

  const content = (
    <div className="w-full max-w-md p-4 space-y-4 pb-[100px] overflow-auto">
      <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>

      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full overflow-hidden bg-purple-100">
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
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-sm text-muted-foreground">{user.email}</p>
          </div>
          <Button variant="outline" onClick={() => setIsEditProfileOpen(true)}>
            Edit
          </Button>
        </div>
      </Card>

      <Card className="p-6 space-y-4">
        <h3 className="text-lg font-semibold">Preferences</h3>

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
      </Card>

      <TaskStatistics tasks={tasks} />

      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        user={user}
        onSave={(updatedUser) => {
          setUser(updatedUser);
          setIsEditProfileOpen(false);
        }}
      />
    </div>
  );

  if (isStorybook) {
    return (
      <div className="w-[420px] h-[900px] bg-background flex flex-col items-center relative">
        {content}
      </div>
    );
  }

  return (
    <div className="w-[420px] h-[900px] bg-background flex flex-col items-center relative">
      {content}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Profile;
