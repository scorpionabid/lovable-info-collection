
import React from "react";
import { Check, Shield, Map, Building, School } from "lucide-react";

interface Role {
  id: string;
  name: string;
  description?: string;
}

interface RoleSelectionProps {
  roles: Role[];
  selectedRole: string;
  onRoleSelect: (roleId: string) => void;
}

export const RoleSelection = ({ roles, selectedRole, onRoleSelect }: RoleSelectionProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
      {roles.map((role) => {
        const isSelected = selectedRole === role.id;
        let Icon = School;
        
        // Determine icon based on role name
        if (role.name.includes("super")) Icon = Shield;
        else if (role.name.includes("region")) Icon = Map;
        else if (role.name.includes("sector")) Icon = Building;
        
        return (
          <div 
            key={role.id}
            className={`border rounded-lg p-4 cursor-pointer transition-all ${
              isSelected 
              ? "border-infoline-blue bg-infoline-blue/5 ring-1 ring-infoline-blue" 
              : "hover:border-infoline-light-gray"
            }`}
            onClick={() => onRoleSelect(role.id)}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`p-1.5 rounded-full ${isSelected ? "bg-infoline-blue text-white" : "bg-infoline-light-gray"}`}>
                <Icon className="h-4 w-4" />
              </div>
              
              {isSelected && (
                <Check className="h-4 w-4 text-infoline-blue" />
              )}
            </div>
            
            <h5 className="font-medium text-infoline-dark-blue mb-1">
              {role.name === 'superadmin' || role.name === 'super-admin' 
                ? 'SuperAdmin' 
                : role.name === 'region-admin'
                ? 'Region Admin'
                : role.name === 'sector-admin'
                ? 'Sektor Admin'
                : role.name === 'school-admin'
                ? 'Məktəb Admin'
                : role.name}
            </h5>
            <p className="text-xs text-infoline-dark-gray">{role.description || "Bu rol üçün təsvir yoxdur"}</p>
          </div>
        );
      })}
    </div>
  );
};
