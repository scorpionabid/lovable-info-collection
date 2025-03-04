
import React from "react";
import { LucideIcon } from "lucide-react";

interface UserDetailsItemProps {
  icon: LucideIcon;
  label: string;
  value: React.ReactNode;
}

export const UserDetailsItem = ({ icon: Icon, label, value }: UserDetailsItemProps) => {
  return (
    <div className="flex items-center gap-2">
      <Icon className="h-5 w-5 text-infoline-blue" />
      <div>
        <p className="text-sm text-infoline-dark-gray">{label}</p>
        <p className="font-medium text-infoline-dark-blue">{value}</p>
      </div>
    </div>
  );
};
