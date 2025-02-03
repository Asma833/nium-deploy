import React, { useState } from "react";
import { useDispatch } from 'react-redux';
import { authApi } from '../api/authApi';
import { logout } from '../store/authSlice';
import { toast } from "sonner";
import { ConfirmationAlert } from "@/components/ui/ConfirmationAlert";

interface LogoutButtonProps {
  className?: string;
  variant?: "primary" | "ghost" | "link";
  showIcon?: boolean;
}

const LogoutButton: React.FC<LogoutButtonProps> = ({
  className = "",
  variant = "primary",
  showIcon = true,
}) => {
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);

  const handleLogout = async () => {
    setIsLoading(true);
    try {
      await authApi.logoutUser();
      dispatch(logout());
      toast.success("Logged out successfully");
    } catch (error) {
      toast.error("Failed to logout");
    } finally {
      setIsLoading(false);
    }
  };

  const baseStyles =
    "flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors";
  const variantStyles = {
    primary: "bg-pink-600 text-white hover:bg-red-700",
    ghost: "bg-gray-500 hover:bg-gray-400",
    link: "text-gray-600 hover:text-gray-900",
  };

  return (
    <ConfirmationAlert
      title="Confirm Logout"
      description="Are you sure you want to logout from your account?"
      onConfirm={handleLogout}
    >
      <button
        disabled={isLoading}
        className={`${baseStyles} ${variantStyles[variant]} ${className}`}
      >
        {showIcon && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
            <polyline points="16 17 21 12 16 7" />
            <line x1="21" y1="12" x2="9" y2="12" />
          </svg>
        )}
        {isLoading ? "Logging out..." : "Logout"}
      </button>
    </ConfirmationAlert>
  );
};

export default LogoutButton;
