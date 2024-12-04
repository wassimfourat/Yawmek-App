import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { BellRing, ArrowUpDown, Globe, User, Settings2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import BottomNav from "./BottomNav";
import EditProfileDialog from "./EditProfileDialog";
import TaskStatistics from "./TaskStatistics";
import { timeZoneOptions, getUserTimeZone } from "@/lib/timezone";

type Priority = "high" | "medium" | "low";
type DefaultSort = "priority" | "date" | "title";

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
  onSortChange?: (sort: DefaultSort) => void;
  defaultSort?: DefaultSort;
  tasks?: Task[];
}

const Profile = ({
  onSortChange = () => {},
  defaultSort = "priority",
  tasks = [],
}: ProfileProps) => {
  const [notifications, setNotifications] = React.useState(true);
  const [timeZone, setTimeZone] = React.useState(getUserTimeZone());
  const [activeTab] = React.useState<"home" | "calendar" | "profile">(
    "profile",
  );
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
  const [user, setUser] = React.useState({
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
  });

  const handleTimeZoneChange = (value: string) => {
    setTimeZone(value);
    localStorage.setItem("timeZone", value);
  };

  const handleNotificationsChange = (enabled: boolean) => {
    setNotifications(enabled);
    localStorage.setItem("notifications", String(enabled));
  };

  const handleSaveProfile = (updatedUser: {
    name: string;
    email: string;
    avatar?: string;
  }) => {
    setUser(updatedUser);
    localStorage.setItem("user", JSON.stringify(updatedUser));
  };

  // Load saved preferences on mount
  React.useEffect(() => {
    const savedTimeZone = localStorage.getItem("timeZone");
    if (savedTimeZone) setTimeZone(savedTimeZone);

    const savedNotifications = localStorage.getItem("notifications");
    if (savedNotifications !== null) {
      setNotifications(savedNotifications === "true");
    }

    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col items-center relative">
      <div className="w-full max-w-md p-4 space-y-4 pb-[100px] overflow-auto">
        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center overflow-hidden">
              {user.avatar ? (
                <img
                  src={user.avatar}
                  alt={user.name}
                  className="w-full h-full object-cover"
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
        </Card>

        {/* Task Statistics */}
        <TaskStatistics tasks={tasks} />

        {/* App Settings Card */}
        <Card className="p-6 space-y-6">
          <div className="flex items-center gap-2">
            <Settings2 className="w-5 h-5 text-purple-600" />
            <h3 className="text-lg font-semibold text-foreground">
              App Settings
            </h3>
          </div>

          {/* Task Preferences */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Task Preferences
            </h4>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <ArrowUpDown className="w-5 h-5 text-purple-600" />
                <Label className="text-sm font-normal">Default Sort</Label>
              </div>
              <Select value={defaultSort} onValueChange={onSortChange}>
                <SelectTrigger className="w-[140px]">
                  <SelectValue placeholder="Priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="priority">Priority</SelectItem>
                  <SelectItem value="date">Due Date</SelectItem>
                  <SelectItem value="title">Title</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Globe className="w-5 h-5 text-purple-600" />
                <Label className="text-sm font-normal">Time Zone</Label>
              </div>
              <Select value={timeZone} onValueChange={handleTimeZoneChange}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Tunisia (UTC+1)" />
                </SelectTrigger>
                <SelectContent>
                  {timeZoneOptions.map((tz) => (
                    <SelectItem key={tz.value} value={tz.value}>
                      {tz.label} ({tz.offset})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <Separator />

          {/* Notifications */}
          <div className="space-y-4">
            <h4 className="text-sm font-medium text-muted-foreground">
              Notifications
            </h4>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <BellRing className="w-5 h-5 text-purple-600" />
                <Label className="text-sm font-normal">
                  Push Notifications
                </Label>
              </div>
              <Switch
                checked={notifications}
                onCheckedChange={handleNotificationsChange}
              />
            </div>
          </div>
        </Card>
      </div>

      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        user={user}
        onSave={handleSaveProfile}
      />

      <BottomNav activeTab={activeTab} onTabChange={() => {}} />
    </div>
  );
};

export default Profile;
