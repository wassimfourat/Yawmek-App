import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Welcome = () => {
  const navigate = useNavigate();

  return (
    <div className="w-[390px] h-[844px] bg-background flex flex-col items-center justify-center p-6">
      <div className="w-24 h-24 bg-purple-100 rounded-full flex items-center justify-center mb-8">
        {/* Replace with your app logo */}
        <svg
          className="w-12 h-12 text-purple-600"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
          />
        </svg>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2">Task Manager</h1>
      <p className="text-muted-foreground text-center mb-8">
        Organize your tasks efficiently
      </p>

      <div className="w-full space-y-4">
        <Button
          className="w-full bg-purple-600 hover:bg-purple-700"
          size="lg"
          onClick={() => navigate("/signin")}
        >
          Sign In
        </Button>
        <Button
          variant="outline"
          className="w-full"
          size="lg"
          onClick={() => navigate("/signup")}
        >
          Create Account
        </Button>
      </div>
    </div>
  );
};

export default Welcome;
