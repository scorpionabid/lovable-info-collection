
import { ReactNode } from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: ReactNode;
  change?: number;
  changeLabel?: string;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
}

export const StatCard = ({
  title,
  value,
  icon,
  change,
  changeLabel = 'ötən aydan',
  color = 'blue'
}: StatCardProps) => {
  const colorClasses = {
    blue: {
      bgLight: 'bg-blue-50',
      bgIcon: 'bg-blue-500',
      textColor: 'text-blue-500'
    },
    green: {
      bgLight: 'bg-green-50',
      bgIcon: 'bg-green-500',
      textColor: 'text-green-500'
    },
    yellow: {
      bgLight: 'bg-yellow-50',
      bgIcon: 'bg-yellow-500',
      textColor: 'text-yellow-500'
    },
    red: {
      bgLight: 'bg-red-50',
      bgIcon: 'bg-red-500',
      textColor: 'text-red-500'
    },
    purple: {
      bgLight: 'bg-purple-50',
      bgIcon: 'bg-purple-500',
      textColor: 'text-purple-500'
    }
  };

  const selectedColor = colorClasses[color];

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow animate-scale-in">
      <div className="flex justify-between">
        <div>
          <p className="text-sm font-medium text-infoline-dark-gray">{title}</p>
          <p className="text-2xl font-semibold text-infoline-dark-blue mt-2">{value}</p>
          
          {typeof change !== 'undefined' && (
            <div className="flex items-center mt-4">
              <div className={cn(
                "flex items-center text-xs font-medium rounded-full px-2 py-0.5",
                change >= 0 
                  ? "text-green-600 bg-green-50" 
                  : "text-red-600 bg-red-50"
              )}>
                {change >= 0 ? (
                  <ArrowUp size={12} className="mr-1" />
                ) : (
                  <ArrowDown size={12} className="mr-1" />
                )}
                {Math.abs(change)}%
              </div>
              <span className="text-xs text-infoline-dark-gray ml-2">{changeLabel}</span>
            </div>
          )}
        </div>
        
        <div className={cn(
          "h-12 w-12 rounded-lg flex items-center justify-center",
          selectedColor.bgLight
        )}>
          <div className={cn(
            "h-10 w-10 rounded-lg flex items-center justify-center text-white",
            selectedColor.bgIcon
          )}>
            {icon}
          </div>
        </div>
      </div>
    </div>
  );
};
