
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Archive, MoreHorizontal, Download } from "lucide-react";
import { School, archiveSchool, exportSchoolData } from "@/services/supabase/schoolService";

interface SchoolTableProps {
  schools: School[];
  isLoading?: boolean;
  onSchoolUpdated?: () => void;
}

export const SchoolTable = ({ schools, isLoading = false, onSchoolUpdated }: SchoolTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [archivingSchool, setArchivingSchool] = useState<string | null>(null);

  const handleView = (school: School) => {
    navigate(`/schools/${school.id}`);
  };

  const handleEdit = (school: School) => {
    // This would typically open an edit modal
    console.log(`Editing school: ${school.name}`);
    toast({
      title: "Redaktə rejimi",
      description: `${school.name} redaktə olunur.`
    });
  };

  const handleArchive = async (school: School) => {
    try {
      setArchivingSchool(school.id);
      await archiveSchool(school.id);
      toast({
        title: "Məktəb arxivləşdirildi",
        description: `${school.name} uğurla arxivləşdirildi.`
      });
      if (onSchoolUpdated) {
        onSchoolUpdated();
      }
    } catch (error) {
      console.error('Error archiving school:', error);
      toast({
        title: "Xəta baş verdi",
        description: "Məktəb arxivləşdirilmədi.",
        variant: "destructive"
      });
    } finally {
      setArchivingSchool(null);
    }
  };

  const handleExport = async (school: School) => {
    try {
      await exportSchoolData(school.id);
      toast({
        title: "Məlumatlar ixrac edildi",
        description: `${school.name} məlumatları uğurla ixrac edildi.`
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

  if (isLoading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Ad</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Növ</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Region</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Sektor</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Şagird sayı</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Müəllim sayı</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Doldurma faizi</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Status</th>
              <th className="px-4 py-3 text-right text-sm font-medium text-infoline-dark-blue">Əməliyyatlar</th>
            </tr>
          </thead>
          <tbody>
            {schools.map((school) => (
              <tr 
                key={school.id} 
                className="border-b border-infoline-light-gray hover:bg-infoline-lightest-gray transition-colors cursor-pointer"
                onClick={() => handleView(school)}
              >
                <td className="px-4 py-3 text-sm font-medium text-infoline-dark-blue">{school.name}</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">{school.type}</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">{school.region}</td>
                <td className="px-4 py-3 text-sm text-infoline-dark-gray">{school.sector}</td>
                <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">{school.studentCount}</td>
                <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">{school.teacherCount}</td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="h-2.5 rounded-full" 
                        style={{ 
                          width: `${school.completionRate}%`,
                          backgroundColor: school.completionRate > 80 ? '#10B981' : school.completionRate > 50 ? '#F59E0B' : '#EF4444'
                        }}
                      ></div>
                    </div>
                    <span className="ml-2 text-sm text-infoline-dark-gray">{school.completionRate}%</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-center">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    school.status === 'Aktiv' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {school.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleView(school)}>
                        <Eye className="mr-2 h-4 w-4" />
                        <span>Baxış</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleEdit(school)}>
                        <Edit className="mr-2 h-4 w-4" />
                        <span>Redaktə et</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleArchive(school)}
                        disabled={archivingSchool === school.id}
                      >
                        <Archive className="mr-2 h-4 w-4" />
                        <span>{archivingSchool === school.id ? 'Arxivləşdirilir...' : 'Arxivləşdir'}</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleExport(school)}>
                        <Download className="mr-2 h-4 w-4" />
                        <span>İxrac et</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {schools.length === 0 && !isLoading && (
        <div className="py-12 text-center">
          <p className="text-infoline-dark-gray">Nəticə tapılmadı</p>
        </div>
      )}
    </div>
  );
};
