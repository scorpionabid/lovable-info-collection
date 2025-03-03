
import { useState } from "react";
import { 
  UserPlus, 
  UserX, 
  RefreshCw, 
  Download, 
  Upload, 
  Filter, 
  Search, 
  MoreHorizontal, 
  Trash,
  Settings,
  Lock,
  CheckCircle,
  Users as UsersIcon,
  Eye
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { UserTable } from "./UserTable";
import { UserModal } from "./UserModal";
import { UserFilterPanel } from "./UserFilterPanel";
import { useToast } from "@/hooks/use-toast";

export const UsersOverview = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { toast } = useToast();

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCreateUser = () => {
    setIsCreatingUser(true);
  };

  const handleImportUsers = () => {
    toast({
      title: "İstifadəçi idxalı",
      description: "İstifadəçi idxalı funksiyası hazırlanır",
    });
  };

  const handleExportUsers = () => {
    toast({
      title: "İstifadəçi ixracı",
      description: "İstifadəçi ixracı funksiyası hazırlanır",
    });
  };

  const handleBulkAction = (action: string) => {
    if (selectedRows.length === 0) {
      toast({
        title: "Xəbərdarlıq",
        description: "Heç bir istifadəçi seçilməyib",
        variant: "destructive",
      });
      return;
    }

    toast({
      title: "Əməliyyat yerinə yetirilir",
      description: `${action} əməliyyatı ${selectedRows.length} istifadəçi üçün tətbiq ediləcək`,
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-infoline-dark-gray" />
            <Input
              placeholder="İstifadəçi axtar..."
              className="pl-9 border-infoline-light-gray"
            />
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={toggleFilters}
            className="flex items-center gap-1"
          >
            <Filter size={16} />
            <span>Filtrlər</span>
          </Button>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleImportUsers}
            className="flex items-center gap-1"
          >
            <Upload size={16} />
            <span>İdxal et</span>
          </Button>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleExportUsers}
            className="flex items-center gap-1"
          >
            <Download size={16} />
            <span>İxrac et</span>
          </Button>
          <Button 
            onClick={handleCreateUser}
            size="sm" 
            className="flex items-center gap-1 bg-infoline-blue hover:bg-infoline-dark-blue"
          >
            <UserPlus size={16} />
            <span>Yeni istifadəçi</span>
          </Button>
        </div>
      </div>

      {showFilters && <UserFilterPanel onClose={() => setShowFilters(false)} />}

      {selectedRows.length > 0 && (
        <div className="bg-infoline-light-blue/10 p-3 rounded-lg border border-infoline-light-blue flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UsersIcon size={16} className="text-infoline-blue" />
            <span className="text-sm font-medium">{selectedRows.length} istifadəçi seçilib</span>
          </div>
          <div className="flex gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <span>Çoxlu əməliyyat</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Çoxlu əməliyyatlar</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("Blokla")}>
                  <UserX className="mr-2 h-4 w-4" />
                  <span>Blokla</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("Aktivləşdir")}>
                  <CheckCircle className="mr-2 h-4 w-4" />
                  <span>Aktivləşdir</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleBulkAction("Şifrə sıfırla")}>
                  <Lock className="mr-2 h-4 w-4" />
                  <span>Şifrə sıfırla</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleBulkAction("Sil")} className="text-red-600">
                  <Trash className="mr-2 h-4 w-4" />
                  <span>Sil</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Button 
              variant="outline" 
              size="sm" 
              className="flex items-center gap-1"
              onClick={() => setSelectedRows([])}
            >
              <span>Seçimi təmizlə</span>
            </Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <UserTable onSelectedRowsChange={setSelectedRows} selectedRows={selectedRows} />
      </div>

      {isCreatingUser && (
        <UserModal onClose={() => setIsCreatingUser(false)} />
      )}
    </div>
  );
};
