
import { Card } from "@/components/ui/card";
import { PieChartComponent } from '@/components/dashboard/charts/PieChartComponent';
import { BarChartComponent } from '@/components/dashboard/charts/BarChartComponent';

interface StatisticsCardProps {
  categoryData: Array<{ name: string; value: number }>;
  completionData: Array<{ name: string; value: number }>;
  chartColors: string[];
}

export const StatisticsCard = ({
  categoryData,
  completionData,
  chartColors
}: StatisticsCardProps) => {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Məlumat və Statistika</h3>
      
      <div className="space-y-8">
        <div>
          <h4 className="text-sm font-medium text-infoline-dark-gray mb-3">Kateqoriyalar üzrə göstəricilər</h4>
          <div className="h-[200px]">
            <PieChartComponent 
              data={categoryData} 
              height={200} 
              colors={chartColors} 
            />
          </div>
        </div>
        
        <div>
          <h4 className="text-sm font-medium text-infoline-dark-gray mb-3">Tamamlanma tarixçəsi</h4>
          <div className="h-[200px]">
            <BarChartComponent 
              data={completionData} 
              height={200} 
              colors={chartColors} 
            />
          </div>
        </div>
      </div>
    </Card>
  );
};
