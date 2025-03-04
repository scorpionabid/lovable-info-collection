
import React from "react";
import { Badge } from "@/components/ui/badge";

interface UserPermissionsProps {
  permissions: string[];
}

export const UserPermissions = ({ permissions }: UserPermissionsProps) => {
  if (!permissions || permissions.length === 0) return null;
  
  return (
    <div>
      <h3 className="font-medium text-infoline-dark-blue mb-2">İcazələr</h3>
      <div className="flex flex-wrap gap-1">
        {permissions.map((permission, index) => (
          <Badge key={index} variant="outline" className="bg-infoline-lightest-gray">
            {permission}
          </Badge>
        ))}
      </div>
    </div>
  );
};
