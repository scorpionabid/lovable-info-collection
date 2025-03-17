
import { useState } from 'react';
import * as reportService from "@/services/supabase/reportService";
import { toast } from "sonner";
import { logger } from '@/utils/logger';

// Create a logger for report generation
const reportLogger = logger.createLogger('reportGenerator');

export const useReportGenerator = () => {
  const [reportData, setReportData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const generateReport = async (categoryId: string, regionIds: string[] = []) => {
    if (!categoryId) {
      const errorMsg = "Zəhmət olmasa kateqoriya seçin";
      setError(errorMsg);
      reportLogger.warn('Report generation failed - missing categoryId');
      return;
    }

    reportLogger.info('Generating custom report', { categoryId, regionCount: regionIds.length });
    setIsLoading(true);
    setError(null);
    
    const requestStartTime = Date.now();

    try {
      // Log the report generation request
      reportLogger.info('Sending report generation request', { 
        categoryId, 
        regionIds: regionIds.length > 0 ? regionIds : 'all' 
      });
      
      // Pass only the categoryId parameter to match the function signature
      const data = await reportService.generateCustomReport(categoryId);
      
      // Log successful response
      reportLogger.info('Report generated successfully', {
        duration: Date.now() - requestStartTime,
        dataSize: data ? Object.keys(data).length : 0,
        hasData: !!data
      });
      
      setReportData(data);
      toast.success("Hesabat uğurla yaradıldı");
    } catch (err) {
      // Log error details
      reportLogger.error("Report generation failed", err);
      
      const errorMessage = err instanceof Error 
        ? err.message 
        : "Hesabat yaradilarkən xəta baş verdi";
        
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
      reportLogger.info('Report generation completed', { 
        duration: Date.now() - requestStartTime,
        success: !error,
        hasData: !!reportData
      });
    }
  };

  return {
    reportData,
    isLoading,
    error,
    generateReport,
  };
};
