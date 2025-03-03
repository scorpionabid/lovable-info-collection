
import { useState } from 'react';
import { RegionTable } from './RegionTable';
import { RegionFilterPanel } from './RegionFilterPanel';
import { RegionModal } from './RegionModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, RefreshCcw, Download, Upload } from "lucide-react";

export const RegionsOverview = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for regions
  const regions = [
    {
      id: '1',
      name: 'Bakı şəhəri',
      description: 'Azərbaycanın paytaxtı və ən böyük şəhəri',
      sectorCount: 5,
      schoolCount: 134,
      completionRate: 87,
      createdAt: '2023-05-15'
    },
    {
      id: '2',
      name: 'Gəncə şəhəri',
      description: 'Azərbaycanın ikinci ən böyük şəhəri',
      sectorCount: 3,
      schoolCount: 48,
      completionRate: 92,
      createdAt: '2023-05-20'
    },
    {
      id: '3',
      name: 'Sumqayıt şəhəri',
      description: 'Xəzər dənizi sahilində yerləşən sənaye şəhəri',
      sectorCount: 2,
      schoolCount: 36,
      completionRate: 78,
      createdAt: '2023-05-25'
    },
    {
      id: '4',
      name: 'Şəki rayonu',
      description: 'Tarixi və mədəni əhəmiyyətə malik şəhər',
      sectorCount: 1,
      schoolCount: 22,
      completionRate: 65,
      createdAt: '2023-06-05'
    },
    {
      id: '5',
      name: 'Quba rayonu',
      description: 'Şimal bölgəsində yerləşən rayon',
      sectorCount: 1,
      schoolCount: 18,
      completionRate: 73,
      createdAt: '2023-06-10'
    }
  ];

  const filteredRegions = regions.filter(region => 
    region.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    region.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            Yeni Region
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <RegionFilterPanel onClose={() => setShowFilters(false)} />
      )}
      
      <RegionTable regions={filteredRegions} />
      
      <RegionModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        mode="create"
      />
    </div>
  );
};
