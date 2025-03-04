
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
import { RegionModal } from './RegionModal';
import { RegionExportModal } from './RegionExportModal';
import { Eye, Edit, Archive, MoreHorizontal, Download, ArrowUp, ArrowDown } from "lucide-react";
import { RegionWithStats } from "@/services/supabase/regionService";
import { useToast } from "@/hooks/use-toast";
import regionService from "@/services/supabase/regionService";

interface RegionTableProps {
  regions: RegionWithStats[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  currentPage: number;
  pageSize: number;
  setCurrentPage: (page: number) => void;
  sortColumn: string;
  sortDirection: 'asc' | 'desc';
  onSortChange: (column: string) => void;
  onRefresh: () => void;
}

export const RegionTable = ({ 
  regions, 
  isLoading, 
  isError, 
  totalCount,
  currentPage,
  pageSize,
  setCurrentPage,
  sortColumn,
  sortDirection,
  onSortChange,
  onRefresh
}: RegionTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const [selectedRegion, setSelectedRegion] = useState<RegionWithStats | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // Navigate to region details page
  const handleView = (region: RegionWithStats) => {
    navigate(`/regions/${region.id}`);
  };

  // Open edit modal
  const handleEdit = (region: RegionWithStats) => {
    setSelectedRegion(region);
    setIsEditModalOpen(true);
  };

  // Archive region
  const handleArchive = async (region: RegionWithStats) => {
    try {
      await regionService.archiveRegion(region.id);
      
      toast({
        title: "Region arxivləşdirildi",
        description: `${region.name} regionu uğurla arxivləşdirildi`,
      });
      
      // Refresh the regions list
      onRefresh();
    } catch (error) {
      console.error('Error archiving region:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Region arxivləşdirilərkən xəta baş verdi",
        variant: "destructive",
      });
    }
  };

  // Open export modal
  const handleExport = (region: RegionWithStats) => {
    setSelectedRegion(region);
    setIsExportModalOpen(true);
  };

  // Handle sort click
  const handleSortClick = (column: string) => {
    onSortChange(column);
  };

  // Render sort indicator
  const renderSortIndicator = (column: string) => {
    if (sortColumn !== column) return null;
    
    return sortDirection === 'asc' 
      ? <ArrowUp className="h-3 w-3 ml-1" /> 
      : <ArrowDown className="h-3 w-3 ml-1" />;
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalCount / pageSize);
  const pageRange = Array.from({ length: totalPages }, (_, i) => i + 1);

  // Show loading state
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
      </div>
    );
  }

  // Show error state
  if (isError) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6 text-center h-64 flex flex-col items-center justify-center">
        <p className="text-infoline-dark-gray mb-4">Məlumatları yükləyərkən xəta baş verdi</p>
        <Button onClick={onRefresh}>Yenidən cəhd edin</Button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
              <th 
                className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue cursor-pointer"
                onClick={() => handleSortClick('name')}
              >
                <div className="flex items-center">
                  Ad
                  {renderSortIndicator('name')}
                </div>
              </th>
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Təsvir</th>
              <th 
                className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue cursor-pointer"
                onClick={() => handleSortClick('sector_count')}
              >
                <div className="flex items-center justify-center">
                  Sektor sayı
                  {renderSortIndicator('sector_count')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue cursor-pointer"
                onClick={() => handleSortClick('school_count')}
              >
                <div className="flex items-center justify-center">
                  Məktəb sayı
                  {renderSortIndicator('school_count')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue cursor-pointer"
                onClick={() => handleSortClick('completion_rate')}
              >
                <div className="flex items-center justify-center">
                  Doldurma faizi
                  {renderSortIndicator('completion_rate')}
                </div>
              </th>
              <th 
                className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue cursor-pointer"
                onClick={() => handleSortClick('created_at')}
              >
                <div className="flex items-center justify-center">
                  Yaradılma tarixi
                  {renderSortIndicator('created_at')}
                </div>
              </th>
              <th className="px-4 py-3 text-right text-sm font-medium text-infoline-dark-blue">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {regions.map((region) => (
              <tr 
                key={region.id} 
                className="border-b border-infoline-light-gray hover:bg-infoline-lightest-gray transition-colors cursor-pointer"
                onClick={() => handleView(region)}
              >
                <td className="px-4 py-3 text-sm font-medium text-infoline-dark-blue">{region.name}</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">{region.description}</td>
                <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">{region.sectorCount}</td>
                <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">{region.schoolCount}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${region.completionRate}%`,
                          backgroundColor: region.completionRate > 80 ? '#10B981' : region.completionRate > 50 ? '#F59E0B' : '#EF4444'
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-infoline-dark-gray">{region.completionRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">
                  {new Date(region.created_at).toLocaleDateString('az-AZ')}
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(region)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Baxış</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(region)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Redaktə et</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchive(region)}>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Arxivləşdir</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(region)}>
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
      
      {/* Empty state */}
      {regions.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-infoline-dark-gray">Nəticə tapılmadı</p>
        </div>
      )}
      
      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center my-4">
          <nav className="flex items-center space-x-1">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
            >
              Əvvəlki
            </Button>
            
            {pageRange.map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
              disabled={currentPage === totalPages}
            >
              Sonrakı
            </Button>
          </nav>
        </div>
      )}
      
      {/* Modals */}
      {selectedRegion && (
        <>
          <RegionModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            mode="edit"
            region={selectedRegion}
            onSuccess={() => {
              queryClient.invalidateQueries({ queryKey: ['regions'] });
              toast({
                title: "Region uğurla yeniləndi",
                description: `${selectedRegion.name} regionunun məlumatları yeniləndi`,
              });
            }}
          />
          
          <RegionExportModal 
            isOpen={isExportModalOpen} 
            onClose={() => setIsExportModalOpen(false)} 
            region={selectedRegion}
          />
        </>
      )}
    </div>
  );
};
