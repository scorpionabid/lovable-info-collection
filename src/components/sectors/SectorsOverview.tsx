
import { useState } from 'react';
import { SectorTable } from './SectorTable';
import { SectorFilterPanel } from './SectorFilterPanel';
import { SectorModal } from './SectorModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, RefreshCcw, Download, Upload } from "lucide-react";

export const SectorsOverview = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for sectors
  const sectors = [
    {
      id: '1',
      name: 'Yasamal rayonu',
      description: 'Bakı şəhərinin mərkəzi rayonlarından biri',
      regionId: '1',
      regionName: 'Bakı şəhəri',
      schoolCount: 28,
      completionRate: 92,
      createdAt: '2023-06-10'
    },
    {
      id: '2',
      name: 'Nəsimi rayonu',
      description: 'Bakı şəhərinin mərkəzi rayonlarından biri',
      regionId: '1',
      regionName: 'Bakı şəhəri',
      schoolCount: 22,
      completionRate: 85,
      createdAt: '2023-06-15'
    },
    {
      id: '3',
      name: 'Nərimanov rayonu',
      description: 'Bakı şəhərinin şimal rayonlarından biri',
      regionId: '1',
      regionName: 'Bakı şəhəri',
      schoolCount: 18,
      completionRate: 78,
      createdAt: '2023-06-20'
    },
    {
      id: '4',
      name: 'Kəpəz rayonu',
      description: 'Gəncə şəhərinin əsas rayonlarından biri',
      regionId: '2',
      regionName: 'Gəncə şəhəri',
      schoolCount: 16,
      completionRate: 93,
      createdAt: '2023-06-25'
    },
    {
      id: '5',
      name: 'Nizami rayonu',
      description: 'Gəncə şəhərinin əsas rayonlarından biri',
      regionId: '2',
      regionName: 'Gəncə şəhəri',
      schoolCount: 14,
      completionRate: 89,
      createdAt: '2023-07-01'
    }
  ];

  const filteredSectors = sectors.filter(sector => 
    sector.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sector.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    sector.regionName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative flex-1">
          <Input
            placeholder="Axtarış..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-infoline-dark-gray">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" 
                 stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8"></circle>
              <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
            </svg>
          </div>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter size={16} />
            Filtrlər
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <RefreshCcw size={16} />
            Yenilə
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Download size={16} />
            İxrac et
          </Button>
          
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
          >
            <Upload size={16} />
            İdxal et
          </Button>
          
          <Button 
            className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus size={16} />
            Yeni Sektor
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <SectorFilterPanel onClose={() => setShowFilters(false)} />
      )}
      
      <SectorTable sectors={filteredSectors} />
      
      <SectorModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        mode="create"
      />
    </div>
  );
};
