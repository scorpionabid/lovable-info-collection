import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { 
  School, 
  Users, 
  PieChart, 
  ArrowLeft, 
  Edit, 
  Download,
  Plus,
  BarChart4,
  MapPin
} from "lucide-react";
import { SectorSchoolTable } from './SectorSchoolTable';
import { SectorModal } from './SectorModal';
import { useToast } from "@/hooks/use-toast";
import { SectorWithStats } from '@/services/supabase/sector/types';

interface SectorDetailProps {
  sector: SectorWithStats & { userCount?: number; regionName?: string };
  schools: any[]; // Type should match what comes from sectorService.getSectorSchools
  isLoadingSchools: boolean;
  isEditModalOpen: boolean;
  setIsEditModalOpen: (value: boolean) => void;
  onRefresh: () => void;
}

export const SectorDetailView = ({ 
  sector, 
  schools, 
  isLoadingSchools,
  isEditModalOpen,
  setIsEditModalOpen,
  onRefresh
}: SectorDetailProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Mock data for the charts
  // In a real app, this would come from the API
  const completionData = [
    { name: 'Yan', value: 65 },
    { name: 'Fev', value: 72 },
    { name: 'Mar', value: 76 },
    { name: 'Apr', value: 81 },
    { name: 'May', value: 85 },
    { name: 'İyn', value: sector.completionRate },
  ];
  
  const compareData = [
    { name: sector.name, value: sector.completionRate },
    { name: 'Nəsimi', value: 85 },
    { name: 'Nərimanov', value: 78 },
    { name: 'Xətai', value: 89 },
    { name: 'Sabunçu', value: 72 },
  ];

  const handleExport = () => {
    toast({
      title: "İxrac funksiyası",
      description: "Sektor məlumatları ixrac edilir",
    });
  };

  const handleEditSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['sector', sector.id] });
    setIsEditModalOpen(false);
    toast({
      title: "Sektor yeniləndi",
      description: "Sektor məlumatları uğurla yeniləndi",
    });
    onRefresh();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/sectors')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-infoline-dark-blue">{sector.name}</h1>
          </div>
          <p className="text-infoline-dark-gray mt-1 ml-10">{sector.description}</p>
          <div className="flex items-center gap-1 ml-10 mt-2 text-sm text-infoline-dark-gray">
            <MapPin className="h-3.5 w-3.5" />
            <Link to={`/regions/${sector.region_id}`} className="hover:text-infoline-blue">
              {sector.regionName}
            </Link>
          </div>
        </div>
        
        <div className="flex gap-2 ml-10 sm:ml-0">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={handleExport}
          >
            <Download className="h-4 w-4" />
            İxrac et
          </Button>
          <Button 
            className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Redaktə et
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard 
          title="Məktəblər" 
          value={sector.schoolCount} 
          icon={<School className="h-5 w-5" />}
          color="green"
        />
        <StatCard 
          title="İstifadəçilər" 
          value={sector.userCount || 0} 
          icon={<Users className="h-5 w-5" />}
          color="purple"
        />
        <StatCard 
          title="Doldurulma faizi" 
          value={`${sector.completionRate}%`} 
          icon={<PieChart className="h-5 w-5" />}
          color="yellow"
          change={7}
          changeLabel="ötən aydan"
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard 
          title="Doldurulma Tendensiyası" 
          subtitle="Son 6 ay"
          type="bar"
          data={completionData}
          colors={['#60A5FA']}
        />
        
        <ChartCard 
          title="Sektorlar üzrə müqayisə" 
          subtitle="Cari ay"
          type="bar"
          data={compareData}
          colors={['#10B981']}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-infoline-dark-blue">Sektor Məktəbləri</h2>
          <Link to={`/schools?sectorId=${sector.id}`}>
            <Button className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yeni Məktəb
            </Button>
          </Link>
        </div>
        
        <SectorSchoolTable 
          schools={schools} 
          sectorId={sector.id} 
          isLoading={isLoadingSchools} 
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-infoline-dark-blue">Sektor Adminləri</h2>
          <Link to={`/users?sectorId=${sector.id}&role=sector-admin`}>
            <Button className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Admin Əlavə Et
            </Button>
          </Link>
        </div>
        
        {(sector.userCount || 0) === 0 ? (
          <div className="bg-infoline-lightest-gray rounded-lg p-6 text-center">
            <BarChart4 className="mx-auto h-16 w-16 text-infoline-gray mb-4" />
            <p className="text-infoline-dark-gray">Bu sektor üçün təyin edilmiş admin yoxdur</p>
            <Button 
              className="mt-4"
              onClick={() => navigate(`/users?sectorId=${sector.id}&role=sector-admin`)}
            >
              Admin Təyin Et
            </Button>
          </div>
        ) : (
          <div className="p-4">
            {/* Admin siyahısı gələcəkdə əlavə ediləcək */}
            <p className="text-infoline-dark-gray">Bu sektor üçün {sector.userCount} admin təyin edilib</p>
          </div>
        )}
      </div>
      
      <SectorModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        mode="edit"
        sector={sector}
        onSuccess={handleEditSuccess}
      />
    </div>
  );
};
