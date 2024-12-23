import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User, Moon, Sun, LogOut, Lock, Mail } from "lucide-react";
import BottomNav from "./BottomNav";
import TaskStatistics from "./TaskStatistics";
import { useTheme } from "@/lib/theme-provider";
import { ScrollArea } from "@/components/ui/scroll-area";
import EditProfileDialog from "./EditProfileDialog";
import SecuritySettingsDialog from "./SecuritySettingsDialog";
import { supabase } from "@/lib/supabase";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";

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
}

const Profile = ({ tasks = [] }: ProfileProps) => {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = React.useState<
    "home" | "calendar" | "profile"
  >("profile");
  const [isEditProfileOpen, setIsEditProfileOpen] = React.useState(false);
  const [securityDialogOpen, setSecurityDialogOpen] = React.useState(false);
  const [securityDialogType, setSecurityDialogType] = React.useState<
    "email" | "password"
  >("password");
  const [user, setUser] = React.useState({
    name: "",
    email: "",
    avatar: "",
  });

  useEffect(() => {
    getProfile();
  }, []);

  const getProfile = async () => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) throw new Error("No user found");

      const { data, error } = await supabase
        .from("users")
        .select("*")
        .eq("id", authUser.id)
        .single();

      if (error) throw error;

      setUser({
        name: data.full_name || "",
        email: authUser.email || "",
        avatar: data.avatar_url || "",
      });
    } catch (error) {
      console.error("Error loading user data:", error);
    }
  };

  const handleSaveProfile = async (updatedUser: {
    name: string;
    email: string;
    avatar?: string;
  }) => {
    try {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (!authUser) throw new Error("No user found");

      const { error } = await supabase
        .from("users")
        .update({
          full_name: updatedUser.name,
          avatar_url: updatedUser.avatar,
          updated_at: new Date().toISOString(),
        })
        .eq("id", authUser.id);

      if (error) throw error;

      setUser({
        ...user,
        name: updatedUser.name,
        avatar: updatedUser.avatar,
      });

      toast({
        title: "Profile Updated",
        description: "Your profile has been successfully updated.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      });
    }
  };

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/welcome");
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to sign out",
        variant: "destructive",
      });
    }
  };

  const openSecurityDialog = (type: "email" | "password") => {
    setSecurityDialogType(type);
    setSecurityDialogOpen(true);
  };

  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col relative">
      <ScrollArea className="flex-1 custom-scrollbar">
        <div className="p-4 space-y-4 pb-[100px]">
          {/* Profile Card */}
          <Card
            className="p-6 cursor-pointer hover:border-purple-500 transition-colors"
            onClick={() => setIsEditProfileOpen(true)}
          >
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
              <div className="flex-1">
                <h2 className="text-xl font-semibold">{user.name}</h2>
                <p className="text-sm text-muted-foreground">{user.email}</p>
              </div>
            </div>
          </Card>

          {/* Settings Card */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Settings</h3>
            <div className="space-y-4">
              {/* Security Settings */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4" />
                  <span>Email</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openSecurityDialog("email")}
                >
                  Change
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Lock className="h-4 w-4" />
                  <span>Password</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openSecurityDialog("password")}
                >
                  Change
                </Button>
              </div>

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

              {/* Logout Button */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-600"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          </Card>

          {/* Statistics */}
          <TaskStatistics tasks={tasks} />
        </div>
      </ScrollArea>

      <EditProfileDialog
        open={isEditProfileOpen}
        onOpenChange={setIsEditProfileOpen}
        user={user}
        onSave={handleSaveProfile}
      />

      <SecuritySettingsDialog
        open={securityDialogOpen}
        onOpenChange={setSecurityDialogOpen}
        type={securityDialogType}
      />

      <BottomNav activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Profile;
