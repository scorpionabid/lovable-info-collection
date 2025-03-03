
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Download,
  School
} from "lucide-react";
import { SchoolTable } from "./SchoolTable";
import { SchoolFilterPanel } from "./SchoolFilterPanel";
import { SchoolModal } from "./SchoolModal";

export const SchoolsOverview = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [filterVisible, setFilterVisible] = useState(true);
  
  // Mock data for schools
  const schools = [
    { 
      id: '1', 
      name: 'Bakı şəhəri 20 nömrəli məktəb', 
      type: 'Orta məktəb', 
      region: 'Bakı şəhəri', 
      sector: 'Nəsimi rayonu', 
      studentCount: 1250, 
      teacherCount: 87, 
      completionRate: 92, 
      status: 'Aktiv',
      director: 'Əliyev Vüqar',
      contactEmail: 'mekteb20@edu.az',
      contactPhone: '+994 12 555 20 20',
      createdAt: '2023-05-10'
    },
    { 
      id: '2', 
      name: 'Bakı şəhəri 45 nömrəli məktəb', 
      type: 'Orta məktəb', 
      region: 'Bakı şəhəri', 
      sector: 'Yasamal rayonu', 
      studentCount: 980, 
      teacherCount: 63, 
      completionRate: 85, 
      status: 'Aktiv',
      director: 'Məmmədov Elnur',
      contactEmail: 'mekteb45@edu.az',
      contactPhone: '+994 12 555 45 45',
      createdAt: '2023-05-12'
    },
    { 
      id: '3', 
      name: 'Bakı şəhəri 189 nömrəli məktəb', 
      type: 'Orta məktəb', 
      region: 'Bakı şəhəri', 
      sector: 'Sabunçu rayonu', 
      studentCount: 750, 
      teacherCount: 52, 
      completionRate: 78, 
      status: 'Aktiv',
      director: 'Hüseynova Aysel',
      contactEmail: 'mekteb189@edu.az',
      contactPhone: '+994 12 555 18 89',
      createdAt: '2023-05-15'
    },
    { 
      id: '4', 
      name: 'Sumqayıt şəhəri 12 nömrəli məktəb', 
      type: 'Orta məktəb', 
      region: 'Sumqayıt şəhəri', 
      sector: 'Mərkəz', 
      studentCount: 620, 
      teacherCount: 48, 
      completionRate: 88, 
      status: 'Aktiv',
      director: 'Quliyev Rauf',
      contactEmail: 'sumqayit12@edu.az',
      contactPhone: '+994 18 555 12 12',
      createdAt: '2023-05-20'
    },
    { 
      id: '5', 
      name: 'Gəncə şəhəri 8 nömrəli məktəb', 
      type: 'Orta məktəb', 
      region: 'Gəncə şəhəri', 
      sector: 'Mərkəz', 
      studentCount: 580, 
      teacherCount: 45, 
      completionRate: 82, 
      status: 'Aktiv',
      director: 'İsmayılov Orxan',
      contactEmail: 'gence8@edu.az',
      contactPhone: '+994 22 555 08 08',
      createdAt: '2023-05-25'
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start gap-4">
        <div>
          <h1 className="text-2xl font-bold text-infoline-dark-blue">Məktəblər</h1>
          <p className="text-infoline-dark-gray">Sistemdəki bütün məktəblər və onların idarə edilməsi</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Download className="h-4 w-4" />
            Toplu İdxal
          </Button>
          <Button 
            className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2"
            onClick={() => setIsCreateModalOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Yeni Məktəb
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <SchoolFilterPanel 
          isVisible={filterVisible} 
          onToggleVisibility={() => setFilterVisible(!filterVisible)} 
        />
        
        <div className={`${filterVisible ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
          <SchoolTable schools={schools} />
        </div>
      </div>
      
      <SchoolModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        mode="create"
      />
    </div>
  );
};
