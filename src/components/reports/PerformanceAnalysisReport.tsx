
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, Mail } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart, Clock, Award } from "lucide-react";
import * as reportService from '@/services/supabase/reportService';
import { toast } from 'sonner';

export const PerformanceAnalysisReport = () => {
  const [period, setPeriod] = useState('month');
  
  // Fetch performance metrics
  const { data: performanceMetrics, isLoading: isLoadingMetrics } = useQuery({
    queryKey: ['performanceMetrics', period],
    queryFn: () => reportService.getPerformanceMetrics({ periodType: period as 'week' | 'month' | 'quarter' | 'year' }),
  });
  
  // Fetch region performance ranking
  const { data: regionPerformance, isLoading: isLoadingRegionPerformance } = useQuery({
    queryKey: ['regionPerformanceRanking', period],
    queryFn: () => reportService.getRegionPerformanceRanking({ periodType: period as 'week' | 'month' | 'quarter' | 'year' }),
  });
  
  // Fetch performance trend
  const { data: performanceTrend, isLoading: isLoadingTrend } = useQuery({
    queryKey: ['performanceTrend', period],
    queryFn: () => reportService.getPerformanceTrend({ periodType: period as 'week' | 'month' | 'quarter' | 'year' }),
  });
  
  // Fetch region-sector performance
  const { data: regionSectorPerformance, isLoading: isLoadingSectorPerformance } = useQuery({
    queryKey: ['regionSectorPerformance', period],
    queryFn: () => reportService.getRegionSectorPerformance({ periodType: period as 'week' | 'month' | 'quarter' | 'year' }),
  });
  
  // Handle exports
  const handleExport = async (type: 'xlsx' | 'csv' | 'pdf') => {
    try {
      // Prepare data for export
      const exportData = [
        ...(regionPerformance || []).map(item => ({
          Category: 'Region performansı',
          Name: item.name,
          Value: `${item.value}%`
        })),
        ...(performanceTrend || []).map(item => ({
          Category: 'Performans trendi',
          Period: item.name,
          Value: `${item.value}%`
        }))
      ];
      
      const success = await reportService.exportReportData(
        exportData,
        `Performans_Analizi_${new Date().toISOString().split('T')[0]}`,
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
          <h2 className="text-xl font-semibold text-infoline-dark-blue">Performans Analizi</h2>
          <p className="text-sm text-infoline-dark-gray mt-1">
            Region və sektorların məlumat təqdimetmə performansı
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3">
          <Select value={period} onValueChange={setPeriod}>
            <SelectTrigger className="min-w-[180px]">
              <SelectValue placeholder="Dövr seçin" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="week">Son həftə</SelectItem>
              <SelectItem value="month">Son ay</SelectItem>
              <SelectItem value="quarter">Son rüb</SelectItem>
              <SelectItem value="year">Son il</SelectItem>
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {isLoadingMetrics ? (
          Array(3).fill(0).map((_, i) => (
            <div key={i} className="bg-white rounded-lg p-6 shadow-sm animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-3"></div>
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))
        ) : (
          performanceMetrics?.map((metric, index) => (
            <StatCard
              key={index}
              title={metric.name}
              value={`${metric.value}%`}
              icon={index === 0 ? <BarChart /> : index === 1 ? <Clock /> : <Award />}
              change={metric.change || 0}
              color={index === 0 ? "blue" : index === 1 ? "green" : "yellow"}
            />
          ))
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Regionlar üzrə performans reytinqi"
          subtitle={`Son ${period === 'week' ? 'həftə' : period === 'month' ? 'ay' : period === 'quarter' ? 'rüb' : 'il'}`}
          type="bar"
          data={regionPerformance || []}
          colors={['#2563EB']}
          isLoading={isLoadingRegionPerformance}
        />
        
        <ChartCard
          title="Performans trendi"
          subtitle="Son 8 həftə"
          type="bar"
          data={performanceTrend || []}
          colors={['#10B981']}
          isLoading={isLoadingTrend}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
        <h3 className="text-lg font-medium text-infoline-dark-blue mb-4">Region və sektorlar üzrə performans</h3>
        {isLoadingSectorPerformance ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin h-8 w-8 border-4 border-infoline-blue border-opacity-50 border-t-infoline-blue rounded-full"></div>
          </div>
        ) : regionSectorPerformance && regionSectorPerformance.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
                  <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Region</th>
                  <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Sektor</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Performans</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Vaxtında təqdim</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Keyfiyyət</th>
                  <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Dəyişiklik</th>
                </tr>
              </thead>
              <tbody>
                {regionSectorPerformance.map((item, index) => (
                  <tr key={index} className="border-b border-infoline-light-gray">
                    <td className="px-4 py-3 text-sm text-infoline-dark-blue">{item.region}</td>
                    <td className="px-4 py-3 text-sm text-infoline-dark-gray">{item.sector}</td>
                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center">
                        <div className="w-16 bg-gray-200 rounded-full h-2.5">
                          <div 
                            className={`h-2.5 rounded-full ${
                              item.performance >= 85 ? 'bg-green-500' : 
                              item.performance >= 70 ? 'bg-green-500' : 
                              'bg-amber-500'
                            }`} 
                            style={{ width: `${item.performance}%` }}
                          ></div>
                        </div>
                        <span className="ml-2 text-sm text-infoline-dark-gray">{item.performance}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">{item.onTimeSubmission}%</td>
                    <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">{item.quality}%</td>
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
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 text-infoline-dark-gray">
            Performans məlumatları tapılmadı.
          </div>
        )}
      </div>
    </div>
  );
};
