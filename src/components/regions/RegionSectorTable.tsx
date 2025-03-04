
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Archive, MoreHorizontal, ArrowUpDown } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Sector {
  id: string;
  name: string;
  description?: string;
  schoolCount: number;
  completionRate: number;
}

interface RegionSectorTableProps {
  sectors: Sector[];
  regionId: string;
  isLoading?: boolean;
}

export const RegionSectorTable = ({ sectors, regionId, isLoading = false }: RegionSectorTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Sector | null,
    direction: 'asc' | 'desc'
  }>({
    key: null,
    direction: 'asc'
  });

  const handleView = (sectorId: string) => {
    navigate(`/sectors/${sectorId}`);
  };

  const handleEdit = (sectorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/sectors/${sectorId}?edit=true`);
  };

  const handleArchive = (sectorId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toast({
      title: "Arxivləşdirildi",
      description: "Sektor uğurla arxivləşdirildi",
    });
  };

  const handleSort = (key: keyof Sector) => {
    setSortConfig({
      key,
      direction: sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc'
    });
  };

  const sortedSectors = [...sectors].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];
    
    if (aValue === bValue) return 0;
    if (aValue === undefined || aValue === null) return 1;
    if (bValue === undefined || bValue === null) return -1;
    
    const result = typeof aValue === 'string' 
      ? aValue.localeCompare(String(bValue)) 
      : Number(aValue) - Number(bValue);
    
    return sortConfig.direction === 'asc' ? result : -result;
  });

  const renderSortIcon = (key: keyof Sector) => {
    if (sortConfig.key !== key) return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    return (
      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortConfig.key === key ? 'opacity-100' : 'opacity-50'}`} />
    );
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-infoline-blue mx-auto mb-4"></div>
        <p className="text-infoline-dark-gray">Sektorlar yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
            <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">
              <button 
                onClick={() => handleSort('name')}
                className="flex items-center focus:outline-none"
              >
                Ad {renderSortIcon('name')}
              </button>
            </th>
            <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">
              <button 
                onClick={() => handleSort('description')}
                className="flex items-center focus:outline-none"
              >
                Təsvir {renderSortIcon('description')}
              </button>
            </th>
            <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">
              <button 
                onClick={() => handleSort('schoolCount')}
                className="flex items-center justify-center focus:outline-none"
              >
                Məktəb sayı {renderSortIcon('schoolCount')}
              </button>
            </th>
            <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">
              <button 
                onClick={() => handleSort('completionRate')}
                className="flex items-center justify-center focus:outline-none"
              >
                Doldurma faizi {renderSortIcon('completionRate')}
              </button>
            </th>
            <th className="px-4 py-3 text-right text-sm font-medium text-infoline-dark-blue">Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          {sortedSectors.map((sector) => (
            <tr 
              key={sector.id} 
              className="border-b border-infoline-light-gray hover:bg-infoline-lightest-gray transition-colors cursor-pointer"
              onClick={() => handleView(sector.id)}
            >
              <td className="px-4 py-3 text-sm font-medium text-infoline-dark-blue">{sector.name}</td>
              <td className="px-4 py-3 text-sm text-infoline-dark-gray">{sector.description || '-'}</td>
              <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">{sector.schoolCount}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${sector.completionRate}%`,
                        backgroundColor: sector.completionRate > 80 ? '#10B981' : sector.completionRate > 50 ? '#F59E0B' : '#EF4444'
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-infoline-dark-gray">{sector.completionRate}%</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(sector.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Baxış</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleEdit(sector.id, e)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Redaktə et</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleArchive(sector.id, e)}>
                      <Archive className="mr-2 h-4 w-4" />
                      <span>Arxivləşdir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {sortedSectors.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-infoline-dark-gray">Bu region üçün sektor tapılmadı</p>
        </div>
      )}
    </div>
  );
};
