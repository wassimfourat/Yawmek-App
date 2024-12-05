import React from "react";
import BottomNav from "./BottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Moon, Sun, User } from "lucide-react";
import { useTheme } from "@/lib/theme-provider";
import TaskStatistics from "./TaskStatistics";
import EditProfileDialog from "./EditProfileDialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
    <ScrollArea className="flex-1 custom-scrollbar">
      <div className="p-4 flex flex-col">
        <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>

        <div className="space-y-4 pb-20">
          <Card
            className="p-6 hover:bg-accent/50 cursor-pointer transition-colors"
            onClick={() => setIsEditProfileOpen(true)}
          >
            <div className="flex items-center gap-4">
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
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Preferences</h3>

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
        </div>

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
    </ScrollArea>
  );

  if (isStorybook) {
    return (
      <div className="w-[390px] h-[844px] bg-background flex flex-col relative">
        {content}
      </div>
    );
  }

  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col relative">
      {content}
      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Profile;
