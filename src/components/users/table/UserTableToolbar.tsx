
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, FileDown } from "lucide-react";

interface UserTableToolbarProps {
  search: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onExport: () => void;
  onAddUser: () => void;
}

export const UserTableToolbar: React.FC<UserTableToolbarProps> = ({
  search,
  onSearchChange,
  onExport,
  onAddUser
}) => {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between mb-4 gap-2">
      <Input
        type="text"
        placeholder="Axtar..."
        value={search}
        onChange={onSearchChange}
        className="max-w-md"
      />
      <div className="flex items-center space-x-2">
        <Button onClick={onExport} variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          İxrac et
        </Button>
        <Button onClick={onAddUser}>
          <Plus className="mr-2 h-4 w-4" />
          Əlavə et
        </Button>
      </div>
    </div>
  );
};
