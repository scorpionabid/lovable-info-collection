
import { PieChart, Pie, Cell, Legend, Tooltip, ResponsiveContainer } from 'recharts';

interface PieChartComponentProps {
  data: any[];
  height: number;
  colors: string[];
}

export const PieChartComponent = ({ data, height, colors }: PieChartComponentProps) => {
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
};
