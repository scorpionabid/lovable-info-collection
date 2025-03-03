
import { useState } from 'react';
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, Mail } from "lucide-react";

export const CompletionStatisticsReport = () => {
  const [filter, setFilter] = useState('all');
  
  // Mock data for charts
  const regionCompletionData = [
    { name: 'Bakı', value: 85 },
    { name: 'Gəncə', value: 72 },
    { name: 'Sumqayıt', value: 68 },
    { name: 'Lənkəran', value: 63 },
    { name: 'Şəki', value: 58 },
  ];
  
  const categoryCompletionData = [
    { name: 'Müəllim Məlumatları', value: 78 },
    { name: 'Şagird Məlumatları', value: 92 },
    { name: 'İnfrastruktur', value: 63 },
    { name: 'Tədris Proqramı', value: 45 },
    { name: 'Maliyyə Məlumatları', value: 82 },
  ];
  
  const timelineData = [
    { name: 'Yan', value: 30 },
    { name: 'Fev', value: 45 },
    { name: 'Mar', value: 55 },
    { name: 'Apr', value: 60 },
    { name: 'May', value: 68 },
    { name: 'İyun', value: 72 },
    { name: 'İyul', value: 75 },
    { name: 'Avq', value: 75 },
    { name: 'Sen', value: 78 },
    { name: 'Okt', value: 82 },
    { name: 'Noy', value: 85 },
    { name: 'Dek', value: 90 },
  ];
  
  const pieData = [
    { name: 'Vaxtında', value: 65 },
    { name: 'Gecikmiş', value: 25 },
    { name: 'Tamamlanmamış', value: 10 },
  ];
  
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
            <Button variant="outline" size="icon">
              <FileDown className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
              <Printer className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="icon">
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
          data={regionCompletionData}
          colors={['#60A5FA']}
        />
        
        <ChartCard
          title="Kateqoriyalar üzrə doldurulma faizi"
          subtitle="Bütün regionlar"
          type="bar"
          data={categoryCompletionData}
          colors={['#34D399']}
        />
        
        <ChartCard
          title="Doldurulma faizinin zamana görə dəyişməsi"
          subtitle="2023-cü il"
          type="bar"
          data={timelineData}
          colors={['#F59E0B']}
        />
        
        <ChartCard
          title="Məlumatların vaxtında təqdimat statistikası"
          subtitle="Son 12 ay"
          type="pie"
          data={pieData}
          colors={['#34D399', '#F59E0B', '#EF4444']}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
        <h3 className="text-lg font-medium text-infoline-dark-blue mb-4">Kritik diqqət tələb edən sahələr</h3>
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
              <tr className="border-b border-infoline-light-gray">
                <td className="px-4 py-3 text-sm text-infoline-dark-blue">Lənkəran</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">Astara</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">İnfrastruktur</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-red-500" style={{ width: '35%' }}></div>
                    </div>
                    <span className="ml-2 text-sm text-infoline-dark-gray">35%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Gecikmiş</span>
                </td>
              </tr>
              <tr className="border-b border-infoline-light-gray">
                <td className="px-4 py-3 text-sm text-infoline-dark-blue">Şəki</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">Qax</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">Tədris Proqramı</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-red-500" style={{ width: '28%' }}></div>
                    </div>
                    <span className="ml-2 text-sm text-infoline-dark-gray">28%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">Gecikmiş</span>
                </td>
              </tr>
              <tr className="border-b border-infoline-light-gray">
                <td className="px-4 py-3 text-sm text-infoline-dark-blue">Gəncə</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">Kəpəz</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">Maliyyə Məlumatları</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-amber-500" style={{ width: '42%' }}></div>
                    </div>
                    <span className="ml-2 text-sm text-infoline-dark-gray">42%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center">
                  <span className="px-2 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-800">Risk</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
