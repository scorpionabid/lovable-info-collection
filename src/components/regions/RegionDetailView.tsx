
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { 
  Layers, 
  School, 
  Users, 
  PieChart, 
  ArrowLeft, 
  Edit, 
  Download,
  Plus,
  BarChart4
} from "lucide-react";
import { RegionSectorTable } from './RegionSectorTable';
import { RegionModal } from './RegionModal';
import { RegionExportModal } from './RegionExportModal';
import { RegionWithStats } from '@/services/supabase/regionService';
import { useToast } from '@/hooks/use-toast';

interface Sector {
  id: string;
  name: string;
  description?: string;
  schoolCount: number;
  completionRate: number;
}

interface RegionDetailProps {
  region: RegionWithStats;
  sectors: Sector[];
  onRegionUpdated: () => void;
}

export const RegionDetailView = ({ region, sectors, onRegionUpdated }: RegionDetailProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  
  // Mock data for the charts - in a real scenario, you would probably get this from an API
  const completionData = [
    { name: 'Yan', value: Math.floor(Math.random() * 35) + 65 },
    { name: 'Fev', value: Math.floor(Math.random() * 35) + 65 },
    { name: 'Mar', value: Math.floor(Math.random() * 35) + 65 },
    { name: 'Apr', value: Math.floor(Math.random() * 35) + 65 },
    { name: 'May', value: Math.floor(Math.random() * 35) + 65 },
    { name: 'İyn', value: region.completionRate },
  ];
  
  const distributionData = [
    { name: 'Məktəblər', value: region.schoolCount },
    { name: 'Sektorlar', value: region.sectorCount },
    { name: 'İstifadəçilər', value: region.users || 0 },
  ];

  // Handle edit success
  const handleEditSuccess = () => {
    onRegionUpdated();
    setIsEditModalOpen(false);
    toast({
      title: "Region yeniləndi",
      description: "Region məlumatları uğurla yeniləndi",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/regions')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-infoline-dark-blue">{region.name}</h1>
          </div>
          <p className="text-infoline-dark-gray mt-1 ml-10">{region.description}</p>
        </div>
        
        <div className="flex gap-2 ml-10 sm:ml-0">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={() => setIsExportModalOpen(true)}
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Sektorlar" 
          value={region.sectorCount} 
          icon={<Layers className="h-5 w-5" />}
          color="blue"
        />
        <StatCard 
          title="Məktəblər" 
          value={region.schoolCount} 
          icon={<School className="h-5 w-5" />}
          color="green"
        />
        <StatCard 
          title="İstifadəçilər" 
          value={region.users || 0} 
          icon={<Users className="h-5 w-5" />}
          color="purple"
        />
        <StatCard 
          title="Doldurulma faizi" 
          value={`${region.completionRate}%`} 
          icon={<PieChart className="h-5 w-5" />}
          color="yellow"
          change={5}
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
          title="Region Strukturu" 
          subtitle="Məktəb, sektor və istifadəçi paylanması"
          type="pie"
          data={distributionData}
          colors={['#34D399', '#60A5FA', '#A78BFA']}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-infoline-dark-blue">Region Sektorları</h2>
          <Link to="/sectors">
            <Button className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yeni Sektor
            </Button>
          </Link>
        </div>
        
        <RegionSectorTable sectors={sectors} regionId={region.id} />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-infoline-dark-blue">Region Adminləri</h2>
          <Link to="/users">
            <Button className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Admin Əlavə Et
            </Button>
          </Link>
        </div>
        
        <div className="bg-infoline-lightest-gray rounded-lg p-6 text-center">
          <BarChart4 className="mx-auto h-16 w-16 text-infoline-gray mb-4" />
          <p className="text-infoline-dark-gray">Bu region üçün təyin edilmiş admin yoxdur</p>
          <Button className="mt-4">Admin Təyin Et</Button>
        </div>
      </div>
      
      <RegionModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        mode="edit"
        region={region}
        onSuccess={handleEditSuccess}
      />
      
      <RegionExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        region={region}
      />
    </div>
  );
};
