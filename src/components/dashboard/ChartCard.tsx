
import { useState } from 'react';
import { ChartHeader } from './charts/ChartHeader';
import { BarChartComponent } from './charts/BarChartComponent';
import { PieChartComponent } from './charts/PieChartComponent';
import { ChartLoading } from './charts/ChartLoading';
import { ChartCardProps } from './charts/types';

export const ChartCard = ({
  title,
  subtitle,
  type,
  data,
  height = 300,
  colors = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'],
  children,
  isLoading = false
}: ChartCardProps) => {
  const [selectedInterval, setSelectedInterval] = useState('month');
  
  const renderChart = () => {
    if (isLoading) {
      return <ChartLoading height={height} />;
    }
    
    switch (type) {
      case 'bar':
        return <BarChartComponent data={data} height={height} colors={colors} />;
      
      case 'pie':
        return <PieChartComponent data={data} height={height} colors={colors} />;
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
      <ChartHeader 
        title={title} 
        subtitle={subtitle} 
        selectedInterval={selectedInterval}
        onIntervalChange={setSelectedInterval}
      />
      
      {renderChart()}
      
      {children}
    </div>
  );
};
