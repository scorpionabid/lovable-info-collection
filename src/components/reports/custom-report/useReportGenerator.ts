
import { useState } from 'react';
import * as reportService from "@/services/supabase/reportService";
import { toast } from "sonner";

export const useReportGenerator = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (categoryId: string, regionIds: string[] = []) => {
    if (!categoryId) {
      setError("Zəhmət olmasa kateqoriya seçin");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Pass only the categoryId parameter to match the function signature
      const data = await reportService.generateCustomReport(categoryId);
      
      setReportData(data);
      toast.success("Hesabat uğurla yaradıldı");
    } catch (err) {
      console.error("Hesabat yaradilarkən xəta baş verdi:", err);
      setError("Hesabat yaradilarkən xəta baş verdi");
      toast.error("Hesabat yaradilarkən xəta baş verdi");
    } finally {
      setIsLoading(false);
    }
  };

  return {
    reportData,
    isLoading,
    error,
    generateReport,
  };
};
