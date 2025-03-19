
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Download, Plus, Search, X } from "lucide-react";

interface UserTableToolbarProps {
  search: string;
  onSearchChange: (value: string) => void;
  onExport: () => void;
  onAddUser: () => void;
}

export function UserTableToolbar({
  search,
  onSearchChange,
  onExport,
  onAddUser
}: UserTableToolbarProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0 mb-4">
      <div className="flex w-full max-w-sm items-center space-x-2">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="İstifadəçi axtar..."
            className="pl-8 w-full"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {search && (
            <button 
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-2.5 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>
      <div className="flex space-x-2">
        <Button 
          variant="outline" 
          size="sm"
          onClick={onExport}
        >
          <Download className="mr-2 h-4 w-4" />
          İxrac
        </Button>
        <Button 
          size="sm"
          onClick={onAddUser}
        >
          <Plus className="mr-2 h-4 w-4" />
          Yeni İstifadəçi
        </Button>
      </div>
    </div>
  );
}
