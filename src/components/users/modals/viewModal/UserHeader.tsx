
import React from "react";
import { Mail } from "lucide-react";
import { User } from "@/services/api/userService";

interface UserHeaderProps {
  user: User;
}

export const UserHeader = ({ user }: UserHeaderProps) => {
  return (
    <div>
      <h2 className="text-xl font-bold text-infoline-dark-blue">
        {user.first_name} {user.last_name}
      </h2>
      <div className="flex items-center gap-1 text-infoline-dark-gray mt-1">
        <Mail className="h-4 w-4" />
        <span>{user.email}</span>
      </div>
    </div>
  );
};
