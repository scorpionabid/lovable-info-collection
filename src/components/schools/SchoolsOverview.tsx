
import { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  Download,
  School
} from "lucide-react";
import { SchoolTable } from "./SchoolTable";
import { SchoolFilterPanel } from "./SchoolFilterPanel";
import { SchoolModal } from "./SchoolModal";
import { School as SchoolType, SchoolFilter, getSchools } from "@/services/supabase/schoolService";

export const SchoolsOverview = () => {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [filterVisible, setFilterVisible] = useState(true);
  const [schools, setSchools] = useState<SchoolType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<SchoolFilter>({});
  const { toast } = useToast();
  
  // Load schools from API
  useEffect(() => {
    loadSchools();
  }, [filters]);
  
  const loadSchools = async () => {
    try {
      setIsLoading(true);
      const data = await getSchools(filters);
      setSchools(data);
    } catch (error) {
      console.error('Error loading schools:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Məktəb məlumatları yüklənərkən xəta baş verdi.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleFiltersChange = (newFilters: SchoolFilter) => {
    setFilters(newFilters);
  };
  
  const handleSchoolCreated = () => {
    loadSchools();
    setIsCreateModalOpen(false);
    toast({
      title: "Məktəb yaradıldı",
      description: "Yeni məktəb uğurla yaradıldı."
    });
  };

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
          onApplyFilters={handleFiltersChange}
        />
        
        <div className={`${filterVisible ? 'lg:col-span-9' : 'lg:col-span-12'}`}>
          <SchoolTable 
            schools={schools} 
            isLoading={isLoading}
            onSchoolUpdated={loadSchools}
          />
        </div>
      </div>
      
      <SchoolModal 
        isOpen={isCreateModalOpen} 
        onClose={() => setIsCreateModalOpen(false)} 
        mode="create"
        onSchoolCreated={handleSchoolCreated}
      />
    </div>
  );
};
