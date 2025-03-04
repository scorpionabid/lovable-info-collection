
import React from 'react';
import { MoreHorizontal } from 'lucide-react';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';

interface ChartHeaderProps {
  title: string;
  subtitle?: string;
  selectedInterval: string;
  onIntervalChange: (interval: string) => void;
}

export const ChartHeader = ({ 
  title, 
  subtitle, 
  selectedInterval, 
  onIntervalChange 
}: ChartHeaderProps) => {
  return (
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
            onClick={() => onIntervalChange('week')}
          >
            Həftə
          </button>
          <button 
            className={`px-3 py-1 ${selectedInterval === 'month' ? 
              'bg-infoline-blue text-white' : 'text-infoline-dark-gray hover:bg-infoline-gray'}`}
            onClick={() => onIntervalChange('month')}
          >
            Ay
          </button>
          <button 
            className={`px-3 py-1 ${selectedInterval === 'year' ? 
              'bg-infoline-blue text-white' : 'text-infoline-dark-gray hover:bg-infoline-gray'}`}
            onClick={() => onIntervalChange('year')}
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
  );
};
