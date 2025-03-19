
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import userService from "@/services/userService";

export const useBulkActions = (onSuccess: () => void) => {
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { toast } = useToast();

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
          await Promise.all(selectedRows.map(id => userService.resetPassword(id)));
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
      
      // Clear selection and trigger refresh
      setSelectedRows([]);
      onSuccess();
    } catch (err) {
      console.error(`Bulk action error (${action}):`, err);
      toast({
        title: "Əməliyyat xətası",
        description: "Əməliyyat zamanı xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  return { 
    selectedRows, 
    setSelectedRows, 
    handleBulkAction 
  };
};
