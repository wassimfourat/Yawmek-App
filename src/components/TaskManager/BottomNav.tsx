import React from "react";
import { HomeIcon, CalendarIcon, UserIcon } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface BottomNavProps {
  activeTab?: "home" | "calendar" | "profile";
  onTabChange?: (tab: "home" | "calendar" | "profile") => void;
}

const BottomNav = ({
  activeTab = "home",
  onTabChange = () => {},
}: BottomNavProps) => {
  const navigate = useNavigate();

  const handleTabClick = (tab: "home" | "calendar" | "profile") => {
    onTabChange(tab);
    if (tab === "home") navigate("/");
    if (tab === "calendar") navigate("/calendar");
    if (tab === "profile") navigate("/profile");
  };

  return (
    <div className="fixed bottom-0 w-[390px] h-[84px] bg-card border-t border-border flex items-center justify-around px-6">
      <button
        onClick={() => handleTabClick("home")}
        className={`flex flex-col items-center space-y-1 ${activeTab === "home" ? "text-purple-600" : "text-muted-foreground"} hover:text-purple-600`}
      >
        <HomeIcon className="h-6 w-6" />
        <span className="text-xs font-medium">Home</span>
      </button>

      <button
        onClick={() => handleTabClick("calendar")}
        className={`flex flex-col items-center space-y-1 ${activeTab === "calendar" ? "text-purple-600" : "text-muted-foreground"} hover:text-purple-600`}
      >
        <CalendarIcon className="h-6 w-6" />
        <span className="text-xs font-medium">Calendar</span>
      </button>

      <button
        onClick={() => handleTabClick("profile")}
        className={`flex flex-col items-center space-y-1 ${activeTab === "profile" ? "text-purple-600" : "text-muted-foreground"} hover:text-purple-600`}
      >
        <UserIcon className="h-6 w-6" />
        <span className="text-xs font-medium">Profile</span>
      </button>
    </div>
  );
};

export default BottomNav;
