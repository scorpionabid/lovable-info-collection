
import { useToast } from "@/hooks/use-toast";
import { User } from "@/services/api/userService";
import { utils, writeFile } from "xlsx";

export const useUserExport = () => {
  const { toast } = useToast();

  const exportUsers = (users: User[]) => {
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

  return { exportUsers };
};
