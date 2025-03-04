
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { User } from "@/services/api/userService";
import { getInitials, getRoleColor, getRoleName } from "./userViewUtils";

interface UserAvatarProps {
  user: User;
}

export const UserAvatar = ({ user }: UserAvatarProps) => {
  return (
    <div className="flex flex-col items-center">
      <Avatar className="h-24 w-24">
        <AvatarImage src="" />
        <AvatarFallback className="bg-infoline-light-blue text-white text-xl">
          {getInitials(user.first_name, user.last_name)}
        </AvatarFallback>
      </Avatar>

      <div className="mt-4 text-center">
        <Badge className={`${getRoleColor(user.roles?.name || user.role)} font-normal`}>
          {getRoleName(user)}
        </Badge>
      </div>
    </div>
  );
};
