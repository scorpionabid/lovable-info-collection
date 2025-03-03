
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { SectorModal } from './SectorModal';
import { Eye, Edit, Archive, MoreHorizontal, Download } from "lucide-react";

interface Sector {
  id: string;
  name: string;
  description: string;
  regionId: string;
  regionName: string;
  schoolCount: number;
  completionRate: number;
  createdAt: string;
}

interface SectorTableProps {
  sectors: Sector[];
}

export const SectorTable = ({ sectors }: SectorTableProps) => {
  const navigate = useNavigate();
  const [selectedSector, setSelectedSector] = useState<Sector | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const handleView = (sector: Sector) => {
    navigate(`/sectors/${sector.id}`);
  };

  const handleEdit = (sector: Sector) => {
    setSelectedSector(sector);
    setIsEditModalOpen(true);
  };

  const handleArchive = (sector: Sector) => {
    // This would typically send an API request to archive the sector
    console.log(`Archiving sector: ${sector.name}`);
  };

  const handleExport = (sector: Sector) => {
    // This would typically generate and download an export file
    console.log(`Exporting sector: ${sector.name}`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Ad</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Təsvir</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Region</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Məktəb sayı</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Doldurma faizi</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Yaradılma tarixi</th>
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
                <td className="px-4 py-3 text-sm font-medium text-infoline-dark-blue">{sector.name}</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">{sector.description}</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">{sector.regionName}</td>
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
                  {new Date(sector.createdAt).toLocaleDateString('az-AZ')}
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
                      <DropdownMenuItem onClick={() => handleEdit(sector)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Redaktə et</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleArchive(sector)}>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Arxivləşdir</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(sector)}>
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
      
      {sectors.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-infoline-dark-gray">Nəticə tapılmadı</p>
        </div>
      )}
      
      {selectedSector && (
        <SectorModal 
          isOpen={isEditModalOpen} 
          onClose={() => setIsEditModalOpen(false)} 
          mode="edit"
          sector={selectedSector}
        />
      )}
    </div>
  );
};
