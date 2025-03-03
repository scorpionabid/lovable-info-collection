
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { StatCard } from "@/components/dashboard/StatCard";
import { ChartCard } from "@/components/dashboard/ChartCard";
import { 
  Users, 
  GraduationCap, 
  PieChart, 
  ArrowLeft, 
  Edit, 
  Download,
  Plus,
  BarChart4,
  Clock,
  FileText
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { SchoolModal } from './SchoolModal';

interface SchoolDetailProps {
  school: {
    id: string;
    name: string;
    type: string;
    region: string;
    sector: string;
    studentCount: number;
    teacherCount: number;
    completionRate: number;
    status: string;
    director: string;
    contactEmail: string;
    contactPhone: string;
    createdAt: string;
    address?: string;
  };
}

export const SchoolDetailView = ({ school }: SchoolDetailProps) => {
  const navigate = useNavigate();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  
  // Mock data for the charts
  const completionData = [
    { name: 'Yan', value: 65 },
    { name: 'Fev', value: 72 },
    { name: 'Mar', value: 76 },
    { name: 'Apr', value: 81 },
    { name: 'May', value: 85 },
    { name: 'İyn', value: 87 },
  ];
  
  const categoryData = [
    { name: 'Müəllimlər', value: 95 },
    { name: 'Maddi Texniki Baza', value: 82 },
    { name: 'Maliyyə', value: 78 },
    { name: 'Tədris Planı', value: 90 },
    { name: 'Şagirdlər', value: 88 },
  ];
  
  // Mock data for recent activities
  const recentActivities = [
    { id: 1, action: 'Müəllimlər kateqoriyası doldurulub', user: 'Əliyev Vüqar', time: '14:25, 12 May 2024' },
    { id: 2, action: 'Maddi Texniki Baza yenilənib', user: 'Əliyev Vüqar', time: '10:15, 10 May 2024' },
    { id: 3, action: 'Maliyyə hesabatı təsdiqlənib', user: 'Məmmədov Elnur', time: '16:40, 5 May 2024' },
    { id: 4, action: 'Şagird siyahısı yenilənib', user: 'Hüseynova Aysel', time: '09:30, 3 May 2024' },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/schools')}
              className="h-8 w-8"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-2xl font-bold text-infoline-dark-blue">{school.name}</h1>
          </div>
          <p className="text-infoline-dark-gray mt-1 ml-10">
            {school.region}, {school.sector} | {school.type}
          </p>
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
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard 
          title="Şagird sayı" 
          value={school.studentCount} 
          icon={<GraduationCap className="h-5 w-5" />}
          color="blue"
        />
        <StatCard 
          title="Müəllim sayı" 
          value={school.teacherCount} 
          icon={<Users className="h-5 w-5" />}
          color="green"
        />
        <StatCard 
          title="Kateqoriya sayı" 
          value={5} 
          icon={<FileText className="h-5 w-5" />}
          color="purple"
        />
        <StatCard 
          title="Doldurulma faizi" 
          value={`${school.completionRate}%`} 
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
          title="Kateqoriyalar üzrə doldurulma" 
          subtitle="Faiz göstəriciləri"
          type="bar"
          data={categoryData}
          colors={['#10B981']}
        />
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none px-4">
            <TabsTrigger value="details">Məktəb Təfərrüatları</TabsTrigger>
            <TabsTrigger value="activities">Son Aktivliklər</TabsTrigger>
            <TabsTrigger value="categories">Kateqoriyalar</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details" className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Ümumi Məlumatlar</h3>
                <dl className="space-y-3">
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-infoline-dark-gray">Məktəb adı:</dt>
                    <dd className="text-sm text-infoline-dark-blue col-span-2">{school.name}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-infoline-dark-gray">Məktəb növü:</dt>
                    <dd className="text-sm text-infoline-dark-blue col-span-2">{school.type}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-infoline-dark-gray">Region:</dt>
                    <dd className="text-sm text-infoline-dark-blue col-span-2">{school.region}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-infoline-dark-gray">Sektor:</dt>
                    <dd className="text-sm text-infoline-dark-blue col-span-2">{school.sector}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-infoline-dark-gray">Ünvan:</dt>
                    <dd className="text-sm text-infoline-dark-blue col-span-2">{school.address || 'N/A'}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-infoline-dark-gray">Yaradılma tarixi:</dt>
                    <dd className="text-sm text-infoline-dark-blue col-span-2">
                      {new Date(school.createdAt).toLocaleDateString('az-AZ')}
                    </dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-infoline-dark-gray">Status:</dt>
                    <dd className="text-sm col-span-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        school.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {school.status}
                      </span>
                    </dd>
                  </div>
                </dl>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Əlaqə Məlumatları</h3>
                <dl className="space-y-3">
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-infoline-dark-gray">Direktor:</dt>
                    <dd className="text-sm text-infoline-dark-blue col-span-2">{school.director}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-infoline-dark-gray">E-poçt:</dt>
                    <dd className="text-sm text-infoline-dark-blue col-span-2">{school.contactEmail}</dd>
                  </div>
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-infoline-dark-gray">Telefon:</dt>
                    <dd className="text-sm text-infoline-dark-blue col-span-2">{school.contactPhone}</dd>
                  </div>
                </dl>
                
                <h3 className="text-lg font-semibold text-infoline-dark-blue mt-8 mb-4">Məktəb Admini</h3>
                <div className="bg-infoline-lightest-gray rounded-lg p-6 text-center">
                  <BarChart4 className="mx-auto h-16 w-16 text-infoline-gray mb-4" />
                  <p className="text-infoline-dark-gray">Bu məktəb üçün təyin edilmiş admin yoxdur</p>
                  <Button className="mt-4">Admin Təyin Et</Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activities" className="p-6">
            <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Son Aktivliklər</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start gap-3 border-b border-infoline-light-gray pb-4">
                  <div className="bg-blue-100 text-blue-700 rounded-full p-2 mt-1">
                    <Clock className="h-4 w-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-infoline-dark-blue">{activity.action}</p>
                    <p className="text-xs text-infoline-dark-gray mt-1">
                      {activity.user} tərəfindən, {activity.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="categories" className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-infoline-dark-blue">Kateqoriyalar</h3>
              <Link to="/categories">
                <Button className="bg-infoline-blue hover:bg-infoline-dark-blue flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Kateqoriyaları idarə et
                </Button>
              </Link>
            </div>
            
            <div className="space-y-4">
              {categoryData.map((category) => (
                <div key={category.name} className="bg-white border border-infoline-light-gray rounded-lg p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-sm font-medium text-infoline-dark-blue">{category.name}</h4>
                    <span className="text-sm font-medium text-infoline-dark-blue">{category.value}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full bg-infoline-blue" 
                      style={{ width: `${category.value}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <SchoolModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        mode="edit"
        school={school}
      />
    </div>
  );
};
