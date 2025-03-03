
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { RegionModal } from './RegionModal';
import { RegionExportModal } from './RegionExportModal';
import { Eye, Edit, Archive, MoreHorizontal, Download } from "lucide-react";

interface Region {
  id: string;
  name: string;
  description: string;
  sectorCount: number;
  schoolCount: number;
  completionRate: number;
  createdAt: string;
}

interface RegionTableProps {
  regions: Region[];
}

export const RegionTable = ({ regions }: RegionTableProps) => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState<Region | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  const handleView = (region: Region) => {
    navigate(`/regions/${region.id}`);
  };

  const handleEdit = (region: Region) => {
    setSelectedRegion(region);
    setIsEditModalOpen(true);
  };

  const handleArchive = (region: Region) => {
    // This would typically send an API request to archive the region
    console.log(`Archiving region: ${region.name}`);
  };

  const handleExport = (region: Region) => {
    setSelectedRegion(region);
    setIsExportModalOpen(true);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Ad</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Təsvir</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Sektor sayı</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Məktəb sayı</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Doldurma faizi</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Yaradılma tarixi</th>
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
                  {new Date(region.createdAt).toLocaleDateString('az-AZ')}
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
      
      {regions.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-infoline-dark-gray">Nəticə tapılmadı</p>
        </div>
      )}
      
      {selectedRegion && (
        <>
          <RegionModal 
            isOpen={isEditModalOpen} 
            onClose={() => setIsEditModalOpen(false)} 
            mode="edit"
            region={selectedRegion}
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
