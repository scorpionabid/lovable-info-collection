
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
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
import { School, SchoolStats, assignSchoolAdmin, exportSchoolData } from "@/services/supabase/schoolService";

interface SchoolDetailProps {
  school: School;
  stats?: {
    categories: Array<{name: string, value: number}>;
    completionHistory: Array<{name: string, value: number}>;
  };
  activities?: Array<{id: number, action: string, user: string, time: string}>;
}

export const SchoolDetailView = ({ school, stats, activities = [] }: SchoolDetailProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssigningAdmin, setIsAssigningAdmin] = useState(false);
  
  const handleSchoolUpdated = () => {
    toast({
      title: "Məktəb yeniləndi",
      description: "Məktəb məlumatları uğurla yeniləndi."
    });
    setIsEditModalOpen(false);
    // Ideally, we would refresh the data here
  };
  
  const handleExport = async () => {
    try {
      await exportSchoolData(school.id);
      toast({
        title: "Məlumatlar ixrac edildi",
        description: "Məktəb məlumatları uğurla ixrac edildi."
      });
    } catch (error) {
      console.error('Error exporting school data:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Məlumatlar ixrac edilmədi.",
        variant: "destructive"
      });
    }
  };
  
  const handleAssignAdmin = async (userId: string) => {
    try {
      setIsAssigningAdmin(true);
      await assignSchoolAdmin(school.id, userId);
      toast({
        title: "Admin təyin edildi",
        description: "Məktəb admini uğurla təyin edildi."
      });
      // Ideally, we would refresh the data here
    } catch (error) {
      console.error('Error assigning school admin:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Admin təyin edilmədi.",
        variant: "destructive"
      });
    } finally {
      setIsAssigningAdmin(false);
    }
  };

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
          value={stats?.categories?.length || 5} 
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
        {stats && (
          <>
            <ChartCard 
              title="Doldurulma Tendensiyası" 
              subtitle="Son 6 ay"
              type="bar"
              data={stats.completionHistory}
              colors={['#60A5FA']}
            />
            
            <ChartCard 
              title="Kateqoriyalar üzrə doldurulma" 
              subtitle="Faiz göstəriciləri"
              type="bar"
              data={stats.categories}
              colors={['#10B981']}
            />
          </>
        )}
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
                  <Button 
                    className="mt-4"
                    onClick={() => handleAssignAdmin('placeholder-user-id')}
                    disabled={isAssigningAdmin}
                  >
                    {isAssigningAdmin ? 'Gözləyin...' : 'Admin Təyin Et'}
                  </Button>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="activities" className="p-6">
            <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Son Aktivliklər</h3>
            <div className="space-y-4">
              {activities.length > 0 ? (
                activities.map((activity) => (
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
                ))
              ) : (
                <div className="text-center py-8 text-infoline-dark-gray">
                  <p>Heç bir aktivlik tapılmadı</p>
                </div>
              )}
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
              {stats && stats.categories.length > 0 ? (
                stats.categories.map((category) => (
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
                ))
              ) : (
                <div className="text-center py-8 text-infoline-dark-gray">
                  <p>Heç bir kateqoriya tapılmadı</p>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      
      <SchoolModal 
        isOpen={isEditModalOpen} 
        onClose={() => setIsEditModalOpen(false)} 
        mode="edit"
        school={school}
        onSchoolUpdated={handleSchoolUpdated}
      />
    </div>
  );
};
