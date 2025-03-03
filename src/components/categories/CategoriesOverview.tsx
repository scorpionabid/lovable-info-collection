
import { useState } from 'react';
import { CategoryTable } from './CategoryTable';
import { CategoryFilterPanel } from './CategoryFilterPanel';
import { CategoryModal } from './CategoryModal';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Filter, RefreshCcw, Download, Upload, GripVertical } from "lucide-react";

export const CategoriesOverview = () => {
  const [showFilters, setShowFilters] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Mock data for categories
  const categories = [
    {
      id: '1',
      name: 'Müəllim Məlumatları',
      description: 'Məktəb müəllimlərinin əsas məlumatları',
      assignment: 'All',
      columns: 12,
      deadline: '2023-12-15',
      completionRate: 78,
      status: 'Active',
      priority: 1,
      createdAt: '2023-05-10'
    },
    {
      id: '2',
      name: 'Şagird Performansı',
      description: 'Şagirdlərin akademik performans göstəriciləri',
      assignment: 'Sectors',
      columns: 8,
      deadline: '2023-11-30',
      completionRate: 65,
      status: 'Active',
      priority: 2,
      createdAt: '2023-05-12'
    },
    {
      id: '3',
      name: 'Maddi-Texniki Baza',
      description: 'Məktəbin maddi-texniki bazası haqqında məlumatlar',
      assignment: 'All',
      columns: 15,
      deadline: '2023-12-20',
      completionRate: 45,
      status: 'Active',
      priority: 3,
      createdAt: '2023-05-15'
    },
    {
      id: '4',
      name: 'Tədris Planı',
      description: 'Cari tədris ili üçün tədris planı',
      assignment: 'Sectors',
      columns: 10,
      deadline: '2023-10-15',
      completionRate: 92,
      status: 'Active',
      priority: 4,
      createdAt: '2023-05-20'
    },
    {
      id: '5',
      name: 'Büdcə Məlumatları',
      description: 'Məktəb büdcəsi və maliyyə göstəriciləri',
      assignment: 'All',
      columns: 6,
      deadline: '2023-12-30',
      completionRate: 30,
      status: 'Inactive',
      priority: 5,
      createdAt: '2023-05-25'
    }
  ];

  const filteredCategories = categories.filter(category => 
    category.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    category.description.toLowerCase().includes(searchQuery.toLowerCase())
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
            Yeni Kateqoriya
          </Button>
        </div>
      </div>
      
      {showFilters && (
        <CategoryFilterPanel onClose={() => setShowFilters(false)} />
      )}
      
      <CategoryTable categories={filteredCategories} />
      
      <CategoryModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        mode="create"
      />
    </div>
  );
};
