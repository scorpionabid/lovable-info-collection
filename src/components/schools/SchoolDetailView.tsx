
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  MoreHorizontal,
  FileDown,
  Pencil,
  Trash,
  User,
  School,
  MapPin,
  Mail,
  Phone,
  BarChart
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SchoolModal } from './SchoolModal';
import { PieChartComponent } from '@/components/dashboard/charts/PieChartComponent';
import { BarChartComponent } from '@/components/dashboard/charts/BarChartComponent';
import { deleteSchool, assignSchoolAdmin } from '@/services/supabase/schoolService';

export const SchoolDetailView = ({ school, stats, activities }: any) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAssigning, setIsAssigning] = useState(false);
  
  const handleSchoolUpdated = () => {
    toast({
      title: "Məktəb yeniləndi",
      description: "Məktəb məlumatları uğurla yeniləndi."
    });
    setIsEditModalOpen(false);
  };
  
  const handleExport = async () => {
    // Export functionality would go here
    toast({
      title: "Eksport edilir",
      description: "Məktəb məlumatları eksport edilir..."
    });
  };
  
  const handleDelete = async () => {
    try {
      await deleteSchool(school.id);
      toast({
        title: "Məktəb silindi",
        description: "Məktəb uğurla silindi."
      });
      navigate('/schools');
    } catch (error) {
      console.error('Error deleting school:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Məktəb silinmədi",
        variant: "destructive"
      });
    }
  };
  
  const handleAssignAdmin = async (userId: string) => {
    if (!userId || !school?.id) {
      toast({
        title: "Xəta",
        description: "İstifadəçi və ya məktəb ID-si yoxdur",
        variant: "destructive"
      });
      return;
    }
    
    try {
      setIsAssigning(true);
      await assignSchoolAdmin(school.id, userId);
      toast({
        title: "Admin təyin edildi",
        description: "Məktəb admini uğurla təyin edildi."
      });
    } catch (error) {
      console.error('Error assigning school admin:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Admin təyin edilmədi",
        variant: "destructive"
      });
    } finally {
      setIsAssigning(false);
    }
  };

  if (!school) {
    return <div>Məlumat yüklənir...</div>;
  }

  // Prepare chart data
  const categoryData = stats?.categories.map((cat: any) => ({
    name: cat.name,
    value: cat.value
  })) || [];
  
  const completionData = stats?.completionHistory.map((hist: any) => ({
    name: hist.name,
    value: hist.value
  })) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-infoline-dark-blue">{school.name}</h2>
          <p className="text-sm text-infoline-dark-gray">{school.type}</p>
        </div>
        
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => setIsEditModalOpen(true)}
          >
            <Pencil className="w-4 h-4 mr-2" />
            Redaktə et
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Əməliyyatlar</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleExport}>
                <FileDown className="w-4 h-4 mr-2" />
                Eksport et
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                onClick={handleDelete}
                className="text-red-600 focus:text-red-600"
              >
                <Trash className="w-4 h-4 mr-2" />
                Sil
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 col-span-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Ümumi Məlumatlar</h3>
              <dl className="space-y-3">
                <div className="grid grid-cols-3">
                  <dt className="text-sm font-medium text-infoline-dark-gray">Növ:</dt>
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
                  <dt className="text-sm font-medium text-infoline-dark-gray">Şagird sayı:</dt>
                  <dd className="text-sm text-infoline-dark-blue col-span-2">{school.studentCount}</dd>
                </div>
                <div className="grid grid-cols-3">
                  <dt className="text-sm font-medium text-infoline-dark-gray">Müəllim sayı:</dt>
                  <dd className="text-sm text-infoline-dark-blue col-span-2">{school.teacherCount}</dd>
                </div>
                <div className="grid grid-cols-3">
                  <dt className="text-sm font-medium text-infoline-dark-gray">Status:</dt>
                  <dd className="text-sm text-infoline-dark-blue col-span-2">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      school.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}>
                      {school.status}
                    </span>
                  </dd>
                </div>
                <div className="grid grid-cols-3">
                  <dt className="text-sm font-medium text-infoline-dark-gray">Ünvan:</dt>
                  <dd className="text-sm text-infoline-dark-blue col-span-2">{school.address}</dd>
                </div>
              </dl>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Əlaqə Məlumatları</h3>
              <dl className="space-y-3">
                {school.director && (
                  <div className="grid grid-cols-3">
                    <dt className="text-sm font-medium text-infoline-dark-gray">Direktor:</dt>
                    <dd className="text-sm text-infoline-dark-blue col-span-2">{school.director}</dd>
                  </div>
                )}
                <div className="grid grid-cols-3">
                  <dt className="text-sm font-medium text-infoline-dark-gray">E-poçt:</dt>
                  <dd className="text-sm text-infoline-dark-blue col-span-2">{school.contactEmail}</dd>
                </div>
                <div className="grid grid-cols-3">
                  <dt className="text-sm font-medium text-infoline-dark-gray">Telefon:</dt>
                  <dd className="text-sm text-infoline-dark-blue col-span-2">{school.contactPhone}</dd>
                </div>
              </dl>
              
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-infoline-dark-blue mb-2">Admins</h3>
                <p className="text-sm text-infoline-dark-gray mb-2">Məktəb adminlərini idarə edin</p>
                <div className="flex flex-col">
                  <Button 
                    className="mt-4"
                    onClick={() => handleAssignAdmin('placeholder-user-id')}
                    disabled={isAssigning}
                  >
                    {isAssigning ? 'Gözləyin...' : 'Admin Təyin Et'}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </Card>
        
        <Card className="p-6">
          <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Məlumat və Statistika</h3>
          
          <div className="space-y-8">
            <div>
              <h4 className="text-sm font-medium text-infoline-dark-gray mb-3">Kateqoriyalar üzrə göstəricilər</h4>
              <div className="h-[200px]">
                <PieChartComponent data={categoryData} />
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-infoline-dark-gray mb-3">Tamamlanma tarixçəsi</h4>
              <div className="h-[200px]">
                <BarChartComponent data={completionData} />
              </div>
            </div>
          </div>
        </Card>
      </div>
      
      <Card className="p-6">
        <h3 className="text-lg font-semibold text-infoline-dark-blue mb-4">Son Fəaliyyətlər</h3>
        
        <div className="space-y-4">
          {activities && activities.length > 0 ? (
            activities.map((activity: any, index: number) => (
              <div key={index} className="flex items-start space-x-4 border-b border-gray-100 pb-4">
                <div className="bg-infoline-lightest-blue p-2 rounded-full">
                  <User className="w-5 h-5 text-infoline-blue" />
                </div>
                <div>
                  <p className="text-sm font-medium text-infoline-dark-gray">{activity.title}</p>
                  <p className="text-xs text-infoline-light-gray">{activity.date}</p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-infoline-dark-gray">Fəaliyyət tapılmadı</p>
          )}
        </div>
      </Card>
      
      {isEditModalOpen && (
        <SchoolModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          mode="edit"
          school={school}
          onSchoolUpdated={handleSchoolUpdated}
        />
      )}
    </div>
  );
};
