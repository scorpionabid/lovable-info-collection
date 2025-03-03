
import { ChartCard } from '@/components/dashboard/ChartCard';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { FileDown, Printer, Mail } from "lucide-react";
import { StatCard } from "@/components/dashboard/StatCard";
import { BarChart, Clock, Award } from "lucide-react";

export const PerformanceAnalysisReport = () => {
  // Mock data for charts
  const regionPerformanceData = [
    { name: 'Bakı', value: 92 },
    { name: 'Gəncə', value: 85 },
    { name: 'Sumqayıt', value: 83 },
    { name: 'Lənkəran', value: 70 },
    { name: 'Şəki', value: 68 },
  ];
  
  const trendData = [
    { name: 'Həftə 1', value: 75 },
    { name: 'Həftə 2', value: 78 },
    { name: 'Həftə 3', value: 82 },
    { name: 'Həftə 4', value: 80 },
    { name: 'Həftə 5', value: 85 },
    { name: 'Həftə 6', value: 88 },
    { name: 'Həftə 7', value: 86 },
    { name: 'Həftə 8', value: 90 },
  ];
  
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
          <Select defaultValue="month">
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
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        <StatCard
          title="Ümumi performans göstəricisi"
          value="85%"
          icon={<BarChart />}
          change={5}
          color="blue"
        />
        <StatCard
          title="Vaxtında təqdim olunma"
          value="92%"
          icon={<Clock />}
          change={3}
          color="green"
        />
        <StatCard
          title="Məlumat keyfiyyəti"
          value="78%"
          icon={<Award />}
          change={-2}
          color="yellow"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ChartCard
          title="Regionlar üzrə performans reytinqi"
          subtitle="Son ay"
          type="bar"
          data={regionPerformanceData}
          colors={['#2563EB']}
        />
        
        <ChartCard
          title="Performans trendi"
          subtitle="Son 8 həftə"
          type="bar"
          data={trendData}
          colors={['#10B981']}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
        <h3 className="text-lg font-medium text-infoline-dark-blue mb-4">Region və sektorlar üzrə performans</h3>
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
              <tr className="border-b border-infoline-light-gray">
                <td className="px-4 py-3 text-sm text-infoline-dark-blue">Bakı</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">Nəsimi</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-green-500" style={{ width: '95%' }}></div>
                    </div>
                    <span className="ml-2 text-sm text-infoline-dark-gray">95%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">98%</td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">92%</td>
                <td className="px-4 py-3 text-center">
                  <span className="flex items-center justify-center text-xs font-medium text-green-600">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    8%
                  </span>
                </td>
              </tr>
              <tr className="border-b border-infoline-light-gray">
                <td className="px-4 py-3 text-sm text-infoline-dark-blue">Gəncə</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">Kəpəz</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-green-500" style={{ width: '88%' }}></div>
                    </div>
                    <span className="ml-2 text-sm text-infoline-dark-gray">88%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">90%</td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">85%</td>
                <td className="px-4 py-3 text-center">
                  <span className="flex items-center justify-center text-xs font-medium text-green-600">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                    </svg>
                    5%
                  </span>
                </td>
              </tr>
              <tr className="border-b border-infoline-light-gray">
                <td className="px-4 py-3 text-sm text-infoline-dark-blue">Lənkəran</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">Mərkəz</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5">
                      <div className="h-2.5 rounded-full bg-amber-500" style={{ width: '70%' }}></div>
                    </div>
                    <span className="ml-2 text-sm text-infoline-dark-gray">70%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">75%</td>
                <td className="px-4 py-3 text-center text-sm text-infoline-dark-gray">68%</td>
                <td className="px-4 py-3 text-center">
                  <span className="flex items-center justify-center text-xs font-medium text-red-600">
                    <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                    </svg>
                    3%
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
