
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Archive, MoreHorizontal } from "lucide-react";

interface School {
  id: string;
  name: string;
  address: string;
  studentCount: number;
  completionRate: number;
}

interface SectorSchoolTableProps {
  schools: School[];
  sectorId: string;
}

export const SectorSchoolTable = ({ schools, sectorId }: SectorSchoolTableProps) => {
  const navigate = useNavigate();

  const handleView = (schoolId: string) => {
    // This would typically navigate to the school details page
    console.log(`Viewing school: ${schoolId}`);
    // navigate(`/schools/${schoolId}`);
  };

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
              <td className="px-4 py-3 text-sm text-infoline-dark-gray">{school.address}</td>
              <td className="px-4 py-3 text-sm text-center text-infoline-dark-gray">{school.studentCount}</td>
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
                    <DropdownMenuItem>
                      <Edit className="mr-2 h-4 w-4" />
                      <span>Redaktə et</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
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
