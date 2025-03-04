
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, Mail } from "lucide-react";
import * as reportService from '@/services/supabase/reportService';
import { toast } from 'sonner';

export const ComparativeTrendsReport = () => {
  const [period, setPeriod] = useState('all-time');
  
  // Fetch category trends
  const { data: categoryTrendsData, isLoading: isLoadingCategoryTrends } = useQuery({
    queryKey: ['categoryTrends', period],
    queryFn: () => reportService.getCategoryTrends({ filter: period }),
  });
  
  // Fetch region comparison
  const { data: regionComparisonData, isLoading: isLoadingRegionComparison } = useQuery({
    queryKey: ['regionComparison', period],
    queryFn: () => reportService.getRegionComparison({ filter: period }),
  });
  
  // Fetch quarterly trends
  const { data: quarterlyTrendsData, isLoading: isLoadingQuarterlyTrends } = useQuery({
    queryKey: ['quarterlyTrends', period],
    queryFn: () => reportService.getQuarterlyTrends({ filter: period }),
  });
  
  // Fetch distribution data
  const { data: distributionData, isLoading: isLoadingDistribution } = useQuery({
    queryKey: ['distributionData', period],
    queryFn: () => reportService.getDistributionData({ filter: period }),
  });
  
  // Fetch yearly comparison
  const { data: yearlyComparisonData, isLoading: isLoadingYearlyComparison } = useQuery({
    queryKey: ['yearlyComparison', period],
    queryFn: () => reportService.getYearlyComparison({ filter: period }),
  });
  
  // Handle exports
  const handleExport = async (type: 'xlsx' | 'csv' | 'pdf') => {
    try {
      // Prepare data for export
      const exportData = [
        ...(categoryTrendsData || []).map(item => ({
          Category: 'Kateqoriya trendi',
          Name: item.name,
          Value: `${item.value}%`
        })),
        ...(regionComparisonData || []).map(item => ({
          Category: 'Region müqayisəsi',
          Name: item.name,
          Value: `${item.value}%`
        })),
        ...(quarterlyTrendsData || []).map(item => ({
          Category: 'Rüblük trend',
          Period: item.name,
          Value: `${item.value}%`
        }))
      ];
      
      const success = await reportService.exportReportData(
        exportData,
        `Muqayiseli_Trendler_${new Date().toISOString().split('T')[0]}`,
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
          <h2 className="text-xl font-semibold text-infoline-dark-blue">Müqayisəli Trendlər</h2>
          <p className="text-sm text-infoline-dark-gray mt-1">
            Doldurulma göstəricilərinin müqayisəli analizi
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Dövr seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ytd">Bu il</SelectItem>
              <SelectItem value="last-year">Keçən il</SelectItem>
              <SelectItem value="all-time">Bütün dövrlər</SelectItem>
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
          title="Kateqoriyalar üzrə trend"
          subtitle="Son ilə görə müqayisə"
          type="bar"
          data={categoryTrendsData || []}
          colors={['#8B5CF6']}
          isLoading={isLoadingCategoryTrends}
        />
        
        <ChartCard
          title="Regionlar üzrə müqayisə"
          subtitle="İldən-ilə dəyişiklik"
          type="bar"
          data={regionComparisonData || []}
          colors={['#EC4899']}
          isLoading={isLoadingRegionComparison}
        />
        
        <ChartCard
          title="Rüblük trend analizi"
          subtitle="2022-2023"
          type="bar"
          data={quarterlyTrendsData || []}
          colors={['#2563EB']}
          isLoading={isLoadingQuarterlyTrends}
        />
        
        <ChartCard
          title="Məktəblərin doldurulma faizinə görə paylanması"
          subtitle="Bütün məktəblər"
          type="pie"
          data={distributionData || []}
          colors={['#10B981', '#34D399', '#F59E0B', '#F97316', '#EF4444']}
          isLoading={isLoadingDistribution}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
        <h3 className="text-lg font-medium text-infoline-dark-blue mb-4">İldən-ilə müqayisəli analiz</h3>
        {isLoadingYearlyComparison ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-infoline-blue border-opacity-50 border-t-infoline-blue rounded-full"></div>
          </div>
        ) : yearlyComparisonData && yearlyComparisonData.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
                  <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Kateqoriya</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">2022</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">2023</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Dəyişiklik</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Trend</th>
                </tr>
              </thead>
              <tbody>
                {yearlyComparisonData.map((item, index) => (
                  <tr key={index} className="border-b border-infoline-light-gray">
                    <td className="px-4 py-3 text-sm text-infoline-dark-blue">{item.category}</td>
                    <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">{item.previousYear}%</td>
                    <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">{item.currentYear}%</td>
                    <td className="px-4 py-3 text-center">
                      <span className={`flex items-center justify-center text-xs font-medium ${
                        item.change > 0 ? 'text-green-600' : 'text-red-600'
                      }`}>
                        <svg 
                          className="w-3 h-3 mr-1" 
                          fill="none" 
                          stroke="currentColor" 
                          viewBox="0 0 24 24" 
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          {item.change > 0 ? (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                          ) : (
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                          )}
                        </svg>
                        {Math.abs(item.change)}%
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="w-full bg-gray-200 rounded-full h-1.5">
                        <div 
                          className={`h-1.5 rounded-full ${item.change > 0 ? 'bg-green-500' : 'bg-red-500'}`} 
                          style={{ width: `${Math.abs(item.change)}%` }}
                        ></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-infoline-dark-gray">
            Müqayisəli analiz məlumatları tapılmadı.
          </div>
        )}
      </div>
    </div>
  );
};
