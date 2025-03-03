
import { ReactNode, useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ChartCardProps {
  title: string;
  subtitle?: string;
  type: 'bar' | 'pie';
  data: any[];
  height?: number;
  colors?: string[];
  children?: ReactNode;
}

export const ChartCard = ({
  title,
  subtitle,
  type,
  data,
  height = 300,
  colors = ['#60A5FA', '#34D399', '#FBBF24', '#F87171', '#A78BFA'],
  children
}: ChartCardProps) => {
  const [selectedInterval, setSelectedInterval] = useState('month');
  
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" />
              <XAxis 
                dataKey="name" 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <YAxis 
                tick={{ fontSize: 12 }} 
                tickLine={false}
                axisLine={{ stroke: '#e5e7eb' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
                }} 
              />
              <Bar dataKey="value" fill={colors[0]} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        );
      
      case 'pie':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  boxShadow: '0 2px 6px rgba(0, 0, 0, 0.05)'
                }} 
              />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 animate-scale-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="font-medium text-infoline-dark-blue">{title}</h3>
          {subtitle && <p className="text-sm text-infoline-dark-gray mt-1">{subtitle}</p>}
        </div>
        
        <div className="flex items-center gap-2">
          <div className="flex text-sm bg-infoline-light-gray rounded-md overflow-hidden">
            <button 
              className={`px-3 py-1 ${selectedInterval === 'week' ? 
                'bg-infoline-blue text-white' : 'text-infoline-dark-gray hover:bg-infoline-gray'}`}
              onClick={() => setSelectedInterval('week')}
            >
              Həftə
            </button>
            <button 
              className={`px-3 py-1 ${selectedInterval === 'month' ? 
                'bg-infoline-blue text-white' : 'text-infoline-dark-gray hover:bg-infoline-gray'}`}
              onClick={() => setSelectedInterval('month')}
            >
              Ay
            </button>
            <button 
              className={`px-3 py-1 ${selectedInterval === 'year' ? 
                'bg-infoline-blue text-white' : 'text-infoline-dark-gray hover:bg-infoline-gray'}`}
              onClick={() => setSelectedInterval('year')}
            >
              İl
            </button>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="p-1.5 rounded-md hover:bg-infoline-light-gray text-infoline-dark-gray">
                <MoreHorizontal size={18} />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Yenilə</DropdownMenuItem>
              <DropdownMenuItem>Excel-ə ixrac et</DropdownMenuItem>
              <DropdownMenuItem>PDF-ə ixrac et</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      
      {renderChart()}
      
      {children}
    </div>
  );
};
