
import React from "react";
import { Calendar, Map, Building, School, UserCheck } from "lucide-react";
import { User } from "@/services/userService";
import { UserDetailsItem } from "./UserDetailsItem";
import { formatDate, getRoleIcon, getRoleName } from "./userViewUtils";

interface UserDetailsProps {
  user: User;
}

export const UserDetails = ({ user }: UserDetailsProps) => {
  const RoleIcon = getRoleIcon(user.roles?.name || user.role);

  return (
    <div className="space-y-3">
      <UserDetailsItem 
        icon={RoleIcon}
        label="İstifadəçi rolu"
        value={getRoleName(user)}
      />
      
      {user.region_id && (
        <UserDetailsItem 
          icon={Map}
          label="Region"
          value={`Region ID: ${user.region_id}`}
        />
      )}
      
      {user.sector_id && (
        <UserDetailsItem 
          icon={Building}
          label="Sektor"
          value={`Sektor ID: ${user.sector_id}`}
        />
      )}
      
      {user.school_id && (
        <UserDetailsItem 
          icon={School}
          label="Məktəb"
          value={`Məktəb ID: ${user.school_id}`}
        />
      )}
      
      <UserDetailsItem 
        icon={Calendar}
        label="Son aktivlik"
        value={formatDate(user.last_login)}
      />
      
      <UserDetailsItem 
        icon={UserCheck}
        label="Status"
        value={user.is_active ? "Aktiv" : "Qeyri-aktiv"}
      />
    </div>
  );
};
