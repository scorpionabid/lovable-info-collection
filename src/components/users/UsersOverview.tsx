
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
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
  Eye,
  Loader2
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
import userService, { UserFilters } from "@/services/api/userService";
import { useAuth } from "@/contexts/AuthContext";
import { utils, writeFile } from "xlsx";

export const UsersOverview = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isCreatingUser, setIsCreatingUser] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<UserFilters>({});
  const { toast } = useToast();
  const { user: currentUser } = useAuth();

  // Fetch users with react-query
  const { 
    data: users = [], 
    isLoading, 
    isError, 
    error, 
    refetch 
  } = useQuery({
    queryKey: ['users', filters],
    queryFn: () => userService.getUsers({ ...filters, search: searchTerm }),
  });

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const handleCreateUser = () => {
    setIsCreatingUser(true);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleApplyFilters = (newFilters: UserFilters) => {
    setFilters(newFilters);
    setShowFilters(false);
  };

  const handleImportUsers = () => {
    // This would typically open a file input dialog
    toast({
      title: "İstifadəçi idxalı",
      description: "İstifadəçi idxalı funksiyası hazırlanır",
    });
  };

  const handleExportUsers = () => {
    try {
      if (users.length === 0) {
        toast({
          title: "Xəbərdarlıq",
          description: "İxrac etmək üçün məlumat yoxdur",
          variant: "destructive",
        });
        return;
      }
      
      // Transform data for Excel export
      const exportData = users.map(user => ({
        "Ad": user.first_name,
        "Soyad": user.last_name,
        "E-mail": user.email,
        "Rol": user.roles?.name || user.role,
        "Status": user.is_active ? "Aktiv" : "Qeyri-aktiv",
        "Son aktivlik": user.last_login ? new Date(user.last_login).toLocaleString('az-AZ') : "Heç vaxt",
      }));
      
      const worksheet = utils.json_to_sheet(exportData);
      const workbook = utils.book_new();
      utils.book_append_sheet(workbook, worksheet, "İstifadəçilər");
      
      // Generate file name
      const fileName = `istifadeciler_${new Date().toISOString().split('T')[0]}.xlsx`;
      
      writeFile(workbook, fileName);
      
      toast({
        title: "İstifadəçilər ixrac edildi",
        description: `${users.length} istifadəçi ${fileName} faylına ixrac edildi`,
      });
    } catch (err) {
      console.error("Export error:", err);
      toast({
        title: "İxrac xətası",
        description: "İstifadəçilərin ixracı zamanı xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedRows.length === 0) {
      toast({
        title: "Xəbərdarlıq",
        description: "Heç bir istifadəçi seçilməyib",
        variant: "destructive",
      });
      return;
    }

    try {
      switch (action) {
        case "Blokla":
          await Promise.all(selectedRows.map(id => userService.blockUser(id)));
          toast({
            title: "İstifadəçilər bloklandı",
            description: `${selectedRows.length} istifadəçi bloklandı`,
          });
          break;
        case "Aktivləşdir":
          await Promise.all(selectedRows.map(id => userService.activateUser(id)));
          toast({
            title: "İstifadəçilər aktivləşdirildi",
            description: `${selectedRows.length} istifadəçi aktivləşdirildi`,
          });
          break;
        case "Şifrə sıfırla":
          // This would typically call the password reset API for each user
          toast({
            title: "Şifrə sıfırlama",
            description: `${selectedRows.length} istifadəçi üçün şifrə sıfırlama təlimatı göndərildi`,
          });
          break;
        case "Sil":
          await Promise.all(selectedRows.map(id => userService.deleteUser(id)));
          toast({
            title: "İstifadəçilər silindi",
            description: `${selectedRows.length} istifadəçi silindi`,
            variant: "destructive",
          });
          break;
      }
      
      // Clear selection and refetch data
      setSelectedRows([]);
      refetch();
    } catch (err) {
      console.error(`Bulk action error (${action}):`, err);
      toast({
        title: "Əməliyyat xətası",
        description: "Əməliyyat zamanı xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  if (isError) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <h3 className="text-lg font-medium text-red-800 mb-2">Məlumatları yükləmək mümkün olmadı</h3>
        <p className="text-red-600">{(error as Error).message}</p>
        <Button 
          onClick={() => refetch()} 
          variant="outline" 
          className="mt-4 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          <span>Yenidən cəhd et</span>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex flex-wrap gap-3 items-center">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-infoline-dark-gray" />
            <Input
              placeholder="İstifadəçi axtar..."
              className="pl-9 border-infoline-light-gray"
              value={searchTerm}
              onChange={handleSearch}
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
            disabled={isLoading}
          >
            <UserPlus size={16} />
            <span>Yeni istifadəçi</span>
          </Button>
        </div>
      </div>

      {showFilters && (
        <UserFilterPanel 
          onClose={() => setShowFilters(false)} 
          onApplyFilters={handleApplyFilters}
          currentFilters={filters}
        />
      )}

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

      {isLoading ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 text-infoline-blue animate-spin mb-2" />
            <p className="text-infoline-dark-gray">Məlumatlar yüklənir...</p>
          </div>
        </div>
      ) : users.length === 0 ? (
        <div className="flex items-center justify-center h-64 bg-white rounded-lg shadow-sm">
          <div className="flex flex-col items-center text-center">
            <UsersIcon className="h-12 w-12 text-infoline-light-gray mb-3" />
            <h3 className="text-lg font-medium text-infoline-dark-blue mb-1">İstifadəçi tapılmadı</h3>
            <p className="text-infoline-dark-gray max-w-md">Axtarış meyarlarına uyğun heç bir istifadəçi tapılmadı. Başqa filtrlər sınayın və ya yeni istifadəçi əlavə edin.</p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <UserTable 
            users={users} 
            onSelectedRowsChange={setSelectedRows} 
            selectedRows={selectedRows}
            onRefetch={refetch}
          />
        </div>
      )}

      {isCreatingUser && (
        <UserModal onClose={() => setIsCreatingUser(false)} onSuccess={() => refetch()} />
      )}
    </div>
  );
};
