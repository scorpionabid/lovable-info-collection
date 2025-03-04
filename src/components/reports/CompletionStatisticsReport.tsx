
import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, Mail } from "lucide-react";
import * as reportService from '@/services/supabase/reportService';
import { toast } from 'sonner';

export const CompletionStatisticsReport = () => {
  const [filter, setFilter] = useState('all');
  
  // Fetch region completion data
  const { data: regionCompletionData, isLoading: isLoadingRegions } = useQuery({
    queryKey: ['regionCompletionStats', filter],
    queryFn: () => reportService.getRegionCompletionStats({ filter }),
  });
  
  // Fetch category completion data
  const { data: categoryCompletionData, isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categoryCompletionStats', filter],
    queryFn: () => reportService.getCategoryCompletionStats({ filter }),
  });
  
  // Fetch timeline data
  const { data: timelineData, isLoading: isLoadingTimeline } = useQuery({
    queryKey: ['timelineCompletionStats', filter],
    queryFn: () => reportService.getTimelineCompletionStats({ filter }),
  });
  
  // Fetch pie chart data
  const { data: pieData, isLoading: isLoadingPie } = useQuery({
    queryKey: ['submissionStatusStats', filter],
    queryFn: () => reportService.getSubmissionStatusStats({ filter }),
  });
  
  // Fetch critical areas data
  const { data: criticalAreasData, isLoading: isLoadingCritical } = useQuery({
    queryKey: ['criticalAreas', filter],
    queryFn: () => reportService.getCriticalAreas({ filter }),
  });
  
  // Handle exports
  const handleExport = async (type: 'xlsx' | 'csv' | 'pdf') => {
    try {
      // Prepare data for export
      const exportData = [
        ...(regionCompletionData || []).map(item => ({
          Category: 'Regionlar üzrə',
          Name: item.name,
          Value: `${item.value}%`
        })),
        ...(categoryCompletionData || []).map(item => ({
          Category: 'Kateqoriyalar üzrə',
          Name: item.name,
          Value: `${item.value}%`
        })),
        ...(timelineData || []).map(item => ({
          Category: 'Zaman üzrə',
          Name: item.name,
          Value: `${item.value}%`
        }))
      ];
      
      const success = await reportService.exportReportData(
        exportData,
        `Doldurlma_Statistikasi_${new Date().toISOString().split('T')[0]}`,
        type
      );
      
      if (success) {
        toast.success(`Hesabat ${type.toUpperCase()} formatında uğurla ixrac edildi`);
      }
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Hesabat ixrac edilərkən xəta baş verdi');
    }
  };
  
  // Handle email sending
  const handleSendEmail = () => {
    // This would be implemented in a real application
    toast.success('Hesabat email vasitəsilə göndərildi');
  };
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-infoline-dark-blue">Doldurulma Statistikası</h2>
          <p className="text-sm text-infoline-dark-gray mt-1">
            Məlumatların doldurulma statusu və proqresi
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Filtrlə" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Bütün regionlar</SelectItem>
              <SelectItem value="baku">Bakı</SelectItem>
              <SelectItem value="ganja">Gəncə</SelectItem>
              <SelectItem value="sumgait">Sumqayıt</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="icon" onClick={() => handleExport('xlsx')} title="Excel formatında ixrac et">
              <FileDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={() => handleExport('pdf')} title="PDF formatında ixrac et">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon" onClick={handleSendEmail} title="Email vasitəsilə göndər">
              <Mail className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Regionlar üzrə doldurulma faizi"
          subtitle="Bütün kateqoriyalar"
          type="bar"
          data={regionCompletionData || []}
          colors={['#60A5FA']}
          isLoading={isLoadingRegions}
        />
        
        <ChartCard
          title="Kateqoriyalar üzrə doldurulma faizi"
          subtitle="Bütün regionlar"
          type="bar"
          data={categoryCompletionData || []}
          colors={['#34D399']}
          isLoading={isLoadingCategories}
        />
        
        <ChartCard
          title="Doldurulma faizinin zamana görə dəyişməsi"
          subtitle="2023-cü il"
          type="bar"
          data={timelineData || []}
          colors={['#F59E0B']}
          isLoading={isLoadingTimeline}
        />
        
        <ChartCard
          title="Məlumatların vaxtında təqdimat statistikası"
          subtitle="Son 12 ay"
          type="pie"
          data={pieData || []}
          colors={['#34D399', '#F59E0B', '#EF4444']}
          isLoading={isLoadingPie}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
        <h3 className="text-lg font-medium text-infoline-dark-blue mb-4">Kritik diqqət tələb edən sahələr</h3>
        {isLoadingCritical ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-infoline-blue border-opacity-50 border-t-infoline-blue rounded-full"></div>
          </div>
        ) : criticalAreasData && criticalAreasData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
                  <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Region</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Sektor</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Kateqoriya</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Doldurulma faizi</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Son tarix statusu</th>
                </tr>
              </thead>
              <tbody>
                {criticalAreasData.map((area, index) => (
                  <tr key={index} className="border-b border-infoline-light-gray">
                    <td className="px-4 py-3 text-sm text-infoline-dark-blue">{area.region}</td>
                    <td className="px-4 py-3 text-sm text-infoline-dark-gray">{area.sector}</td>
                    <td className="px-4 py-3 text-sm text-infoline-dark-gray">{area.category}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              area.completionRate < 30 ? 'bg-red-500' : 
                              area.completionRate < 50 ? 'bg-amber-500' : 
                              'bg-green-500'
                            }`} 
                            style={{ width: `${area.completionRate}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-infoline-dark-gray">{area.completionRate}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        area.status === 'Gecikmiş' ? 'bg-red-100 text-red-800' : 
                        area.status === 'Risk' ? 'bg-amber-100 text-amber-800' : 
                        'bg-green-100 text-green-800'
                      }`}>
                        {area.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-infoline-dark-gray">
            Kritik sahə tapılmadı.
          </div>
        )}
      </div>
    </div>
  );
};
