
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

interface SectorDetailProps {
  sector: {
    id: string;
    name: string;
    description: string;
    regionId: string;
    regionName: string;
    createdAt: string;
    schools: number;
    users: number;
    completionRate: number;
  };
}

export const SectorDetailView = ({ sector }: SectorDetailProps) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Mock data for the charts
  const completionData = [
    { name: 'Yan', value: 65 },
    { name: 'Fev', value: 72 },
    { name: 'Mar', value: 76 },
    { name: 'Apr', value: 81 },
    { name: 'May', value: 85 },
    { name: 'İyn', value: 92 },
  ];
  
  const compareData = [
    { name: 'Yasamal', value: 92 },
    { name: 'Nəsimi', value: 85 },
    { name: 'Nərimanov', value: 78 },
    { name: 'Xətai', value: 89 },
    { name: 'Sabunçu', value: 72 },
  ];
  
  // Mock data for schools
  const schools = [
    { id: '1', name: '45 nömrəli məktəb', address: 'Yasamal rayonu, Ş.Mehdiyev küç. 20', studentCount: 850, completionRate: 95 },
    { id: '2', name: '47 nömrəli məktəb', address: 'Yasamal rayonu, M.Müşfiq küç. 12', studentCount: 720, completionRate: 88 },
    { id: '3', name: '52 nömrəli məktəb', address: 'Yasamal rayonu, Z.Əhmədbəyli küç. 5', studentCount: 680, completionRate: 92 },
    { id: '4', name: '60 nömrəli məktəb', address: 'Yasamal rayonu, H.Zərdabi küç. 71', studentCount: 790, completionRate: 90 },
    { id: '5', name: '173 nömrəli məktəb', address: 'Yasamal rayonu, İnşaatçılar pr. 23', studentCount: 910, completionRate: 87 },
  ];

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
            <Link to={`/regions/${sector.regionId}`} className="hover:text-infoline-blue">
              {sector.regionName}
            </Link>
          </div>
        </div>
        
        <div className="flex gap-2 ml-10 sm:ml-0">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
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
          value={sector.schools} 
          icon={<School className="h-5 w-5" />}
          color="green"
        />
        <StatCard 
          title="İstifadəçilər" 
          value={sector.users} 
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
          <Link to="/schools">
            <Button className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Yeni Məktəb
            </Button>
          </Link>
        </div>
        
        <SectorSchoolTable schools={schools} sectorId={sector.id} />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-infoline-dark-blue">Sektor Adminləri</h2>
          <Link to="/users">
            <Button className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Admin Əlavə Et
            </Button>
          </Link>
        </div>
        
        <div className="bg-infoline-lightest-gray rounded-lg p-6 text-center">
          <BarChart4 className="mx-auto h-16 w-16 text-infoline-gray mb-4" />
          <p className="text-infoline-dark-gray">Bu sektor üçün təyin edilmiş admin yoxdur</p>
          <Button className="mt-4">Admin Təyin Et</Button>
        </div>
      </div>
      
      <SectorModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        mode="edit"
        sector={{
          id: sector.id,
          name: sector.name,
          description: sector.description,
          regionId: sector.regionId,
          regionName: sector.regionName,
          createdAt: sector.createdAt,
          schoolCount: sector.schools,
          completionRate: sector.completionRate
        }}
      />
    </div>
  );
};
