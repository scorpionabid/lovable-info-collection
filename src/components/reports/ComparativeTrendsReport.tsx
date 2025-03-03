
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, Mail } from "lucide-react";

export const ComparativeTrendsReport = () => {
  // Mock data for charts
  const categoryTrendsData = [
    { name: 'Müəllim Məlumatları', value: 82 },
    { name: 'Şagird Məlumatları', value: 90 },
    { name: 'İnfrastruktur', value: 65 },
    { name: 'Tədris Proqramı', value: 58 },
    { name: 'Maliyyə Məlumatları', value: 75 },
  ];
  
  const regionComparisonData = [
    { name: 'Bakı', value: 85 },
    { name: 'Gəncə', value: 72 },
    { name: 'Sumqayıt', value: 68 },
    { name: 'Lənkəran', value: 63 },
    { name: 'Şəki', value: 58 },
  ];
  
  const quarterlyTrendsData = [
    { name: '2022 Q1', value: 68 },
    { name: '2022 Q2', value: 72 },
    { name: '2022 Q3', value: 75 },
    { name: '2022 Q4', value: 78 },
    { name: '2023 Q1', value: 80 },
    { name: '2023 Q2', value: 82 },
    { name: '2023 Q3', value: 85 },
    { name: '2023 Q4', value: 88 },
  ];
  
  const distributionData = [
    { name: '90-100%', value: 15 },
    { name: '75-89%', value: 30 },
    { name: '50-74%', value: 35 },
    { name: '25-49%', value: 15 },
    { name: '0-24%', value: 5 },
  ];
  
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
          <Select defaultValue="all-time">
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
          title="Kateqoriyalar üzrə trend"
          subtitle="Son ilə görə müqayisə"
          type="bar"
          data={categoryTrendsData}
          colors={['#8B5CF6']}
        />
        
        <ChartCard
          title="Regionlar üzrə müqayisə"
          subtitle="İldən-ilə dəyişiklik"
          type="bar"
          data={regionComparisonData}
          colors={['#EC4899']}
        />
        
        <ChartCard
          title="Rüblük trend analizi"
          subtitle="2022-2023"
          type="bar"
          data={quarterlyTrendsData}
          colors={['#2563EB']}
        />
        
        <ChartCard
          title="Məktəblərin doldurulma faizinə görə paylanması"
          subtitle="Bütün məktəblər"
          type="pie"
          data={distributionData}
          colors={['#10B981', '#34D399', '#F59E0B', '#F97316', '#EF4444']}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
        <h3 className="text-lg font-medium text-infoline-dark-blue mb-4">İldən-ilə müqayisəli analiz</h3>
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
              <tr className="border-b border-infoline-light-gray">
                <td className="px-4 py-3 text-sm text-infoline-dark-blue">Müəllim Məlumatları</td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">75%</td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">82%</td>
                <td className="px-4 py-3 text-center">
                  <span className="flex items-center justify-center text-xs font-medium text-green-600">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    7%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-green-500" style={{ width: '7%' }}></div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-infoline-light-gray">
                <td className="px-4 py-3 text-sm text-infoline-dark-blue">Şagird Məlumatları</td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">82%</td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">90%</td>
                <td className="px-4 py-3 text-center">
                  <span className="flex items-center justify-center text-xs font-medium text-green-600">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    8%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-green-500" style={{ width: '8%' }}></div>
                  </div>
                </td>
              </tr>
              <tr className="border-b border-infoline-light-gray">
                <td className="px-4 py-3 text-sm text-infoline-dark-blue">İnfrastruktur</td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">68%</td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">65%</td>
                <td className="px-4 py-3 text-center">
                  <span className="flex items-center justify-center text-xs font-medium text-red-600">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    3%
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="w-full bg-gray-200 rounded-full h-1.5">
                    <div className="h-1.5 rounded-full bg-red-500" style={{ width: '3%' }}></div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
