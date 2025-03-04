
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Archive, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface School {
  id: string;
  name: string;
  address?: string;
  studentCount?: number; // Mock data
  completionRate?: number; // Mock data
}

interface SectorSchoolTableProps {
  schools: School[];
  sectorId: string;
  isLoading: boolean;
}

export const SectorSchoolTable = ({ schools, sectorId, isLoading }: SectorSchoolTableProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleView = (schoolId: string) => {
    navigate(`/schools/${schoolId}`);
  };

  const handleEdit = (schoolId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    navigate(`/schools/${schoolId}?edit=true`);
  };

  const handleArchive = (schoolId: string, event: React.MouseEvent) => {
    event.stopPropagation();
    toast({
      title: "Arxivləşdirmə",
      description: "Məktəb arxivləşdirilir",
    });
  };

  if (isLoading) {
    return (
      <div className="py-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-infoline-blue mx-auto mb-4"></div>
        <p className="text-infoline-dark-gray">Məktəblər yüklənir...</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-infoline-lightest-gray border-b border-infoline-light-gray">
            <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Ad</th>
            <th className="px-4 py-3 text-left text-sm font-medium text-infoline-dark-blue">Ünvan</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Şagird sayı</th>
            <th className="px-4 py-3 text-center text-sm font-medium text-infoline-dark-blue">Doldurma faizi</th>
            <th className="px-4 py-3 text-right text-sm font-medium text-infoline-dark-blue">Əməliyyatlar</th>
          </tr>
        </thead>
        <tbody>
          {schools.map((school) => (
            <tr 
              key={school.id} 
              className="border-b border-infoline-light-gray hover:bg-infoline-lightest-gray transition-colors cursor-pointer"
              onClick={() => handleView(school.id)}
            >
              <td className="px-4 py-3 text-sm font-medium text-infoline-dark-blue">{school.name}</td>
              <td className="px-4 py-3 text-sm text-infoline-dark-gray">{school.address || '-'}</td>
              <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">{school.studentCount || 0}</td>
              <td className="px-4 py-3 text-center">
                <div className="flex items-center justify-center">
                  <div className="w-16 bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="h-2.5 rounded-full" 
                      style={{ 
                        width: `${school.completionRate || 0}%`,
                        backgroundColor: (school.completionRate || 0) > 80 ? '#10B981' : (school.completionRate || 0) > 50 ? '#F59E0B' : '#EF4444'
                      }}
                    ></div>
                  </div>
                  <span className="ml-2 text-sm text-infoline-dark-gray">{school.completionRate || 0}%</span>
                </div>
              </td>
              <td className="px-4 py-3 text-right" onClick={(e) => e.stopPropagation()}>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleView(school.id)}>
                      <Eye className="mr-2 h-4 w-4" />
                      <span>Baxış</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleEdit(school.id, e)}>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Redaktə et</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={(e) => handleArchive(school.id, e)}>
                      <Archive className="mr-2 h-4 w-4" />
                      <span>Arxivləşdir</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      {schools.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-infoline-dark-gray">Bu sektor üçün məktəb tapılmadı</p>
        </div>
      )}
    </div>
  );
};
