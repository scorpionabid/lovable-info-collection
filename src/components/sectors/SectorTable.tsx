
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SectorModal } from './SectorModal';
import { Eye, Edit, Archive, MoreHorizontal, Download, ArrowUpDown, AlertCircle, RefreshCw } from "lucide-react";
import { SectorWithStats } from '@/services/supabase/sector/types';
import { useToast } from "@/hooks/use-toast";
import { archiveSector } from '@/services/supabase/sector/crudOperations';
import { useLogger } from '@/hooks/useLogger';
import { 
  Pagination, 
  PaginationContent, 
  PaginationItem, 
  PaginationLink, 
  PaginationNext, 
  PaginationPrevious 
} from "@/components/ui/pagination";

interface SectorTableProps {
  sectors: SectorWithStats[];
  isLoading: boolean;
  isError: boolean;
  errorDetails?: string;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  onRefresh: () => void;
}

export const SectorTable = ({ 
  sectors, 
  isLoading,
  isError,
  errorDetails = 'Yüklənərkən xəta baş verdi',
  totalCount,
  currentPage,
  pageSize,
  setCurrentPage,
  sortColumn,
  sortDirection,
  onSortChange,
  onRefresh
}: SectorTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const logger = useLogger('SectorTable');
  const [selectedSector, setSelectedSector] = useState<SectorWithStats | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const totalPages = Math.ceil(totalCount / pageSize);

  // Log table state on props change
  logger.debug('SectorTable rendered', {
    sectorsCount: sectors?.length || 0,
    isLoading,
    isError,
    totalCount,
    currentPage,
    totalPages
  });

  const handleView = (sector: SectorWithStats) => {
    logger.info(`Navigating to sector details: ${sector.id}`);
    navigate(`/sectors/${sector.id}`);
  };

  const handleEdit = (sector: SectorWithStats, event: React.MouseEvent) => {
    event.stopPropagation();
    logger.info(`Opening edit modal for sector: ${sector.id}`);
    setSelectedSector(sector);
    setIsEditModalOpen(true);
  };

  const handleArchive = async (sector: SectorWithStats, event: React.MouseEvent) => {
    event.stopPropagation();
    try {
      logger.info(`Archiving sector: ${sector.id}`);
      await archiveSector(sector.id);
      
      toast({
        title: "Sektor arxivləşdirildi",
        description: `${sector.name} uğurla arxivləşdirildi`,
      });
      
      logger.info(`Sector archived successfully: ${sector.id}`);
      onRefresh();
    } catch (error) {
      logger.error(`Error archiving sector: ${sector.id}`, error);
      
      toast({
        title: "Xəta baş verdi",
        description: "Sektor arxivləşdirilə bilmədi",
        variant: "destructive",
      });
    }
  };

  const handleExport = (sector: SectorWithStats, event: React.MouseEvent) => {
    event.stopPropagation();
    logger.info(`Exporting single sector: ${sector.id}`);
    
    // This would typically generate and download an export file
    toast({
      title: "Sektor ixrac edilir",
      description: `${sector.name} məlumatları ixrac edilir`,
    });
  };

  const renderSortIcon = (column: string) => {
    if (sortColumn !== column) return <ArrowUpDown className="ml-1 h-4 w-4 opacity-50" />;
    return (
      <ArrowUpDown className={`ml-1 h-4 w-4 ${sortColumn === column ? 'opacity-100' : 'opacity-50'}`} />
    );
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-infoline-blue mx-auto mb-4"></div>
        <p className="text-infoline-dark-gray">Sektorlar yüklənir...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-4" />
        <p className="text-red-500 mb-2">Məlumatlar yüklənərkən xəta baş verdi</p>
        <p className="text-red-400 text-sm mb-4">{errorDetails}</p>
        <Button onClick={onRefresh} className="flex items-center gap-2">
          <RefreshCw size={16} />
          Yenidən cəhd edin
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">
                <button 
                  onClick={() => onSortChange('name')}
                  className="flex items-center focus:outline-none"
                >
                  Ad {renderSortIcon('name')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">
                <button 
                  onClick={() => onSortChange('description')}
                  className="flex items-center focus:outline-none"
                >
                  Təsvir {renderSortIcon('description')}
                </button>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">
                <button 
                  onClick={() => onSortChange('regionName')}
                  className="flex items-center focus:outline-none"
                >
                  Region {renderSortIcon('regionName')}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">
                <button 
                  onClick={() => onSortChange('schoolCount')}
                  className="flex items-center justify-center focus:outline-none"
                >
                  Məktəb sayı {renderSortIcon('schoolCount')}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">
                <button 
                  onClick={() => onSortChange('completionRate')}
                  className="flex items-center justify-center focus:outline-none"
                >
                  Doldurma faizi {renderSortIcon('completionRate')}
                </button>
              </th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">
                <button 
                  onClick={() => onSortChange('created_at')}
                  className="flex items-center justify-center focus:outline-none"
                >
                  Yaradılma tarixi {renderSortIcon('created_at')}
                </button>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-infoline-dark-blue">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {sectors.map((sector) => (
              <tr 
                key={sector.id} 
                className="border-b border-infoline-light-gray hover:bg-infoline-lightest-gray transition-colors cursor-pointer"
                onClick={() => handleView(sector)}
              >
                <td className="px-4 py-3 text-sm font-medium text-infoline-dark-blue">{sector.name || '-'}</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">{sector.description || '-'}</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">{sector.regionName || '-'}</td>
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
                <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">
                  {sector.created_at ? new Date(sector.created_at).toLocaleDateString('az-AZ') : '-'}
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(sector)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Baxış</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleEdit(sector, e)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Redaktə et</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleArchive(sector, e)}>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Arxivləşdir</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={(e) => handleExport(sector, e)}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>İxrac et</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {sectors.length === 0 && !isLoading && (
        <div className="py-12 text-center">
          <p className="text-infoline-dark-gray">Nəticə tapılmadı</p>
        </div>
      )}
      
      {totalPages > 1 && (
        <div className="flex justify-center p-4">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => {
                    if (currentPage > 1) {
                      logger.info(`Pagination: moving to previous page (${currentPage - 1})`);
                      setCurrentPage(currentPage - 1);
                    }
                  }}
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
              
              {Array.from({ length: totalPages }, (_, i) => (
                <PaginationItem key={i + 1}>
                  <PaginationLink 
                    isActive={currentPage === i + 1}
                    onClick={() => {
                      logger.info(`Pagination: moving to page ${i + 1}`);
                      setCurrentPage(i + 1);
                    }}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => {
                    if (currentPage < totalPages) {
                      logger.info(`Pagination: moving to next page (${currentPage + 1})`);
                      setCurrentPage(currentPage + 1);
                    }
                  }}
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
      
      {selectedSector && (
        <SectorModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          mode="edit"
          sector={selectedSector}
          onSuccess={() => {
            logger.info(`Sector ${selectedSector.id} updated successfully, invalidating query cache`);
            queryClient.invalidateQueries({ queryKey: ['sectors'] });
            setIsEditModalOpen(false);
            toast({
              title: "Sektor yeniləndi",
              description: "Sektor məlumatları uğurla yeniləndi",
            });
          }}
        />
      )}
    </div>
  );
};
