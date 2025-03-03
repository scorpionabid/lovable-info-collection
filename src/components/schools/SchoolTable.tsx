
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Eye, Edit, Archive, MoreHorizontal, Download } from "lucide-react";

interface School {
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
}

interface SchoolTableProps {
  schools: School[];
}

export const SchoolTable = ({ schools }: SchoolTableProps) => {
  const navigate = useNavigate();
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);

  const handleView = (school: School) => {
    navigate(`/schools/${school.id}`);
  };

  const handleEdit = (school: School) => {
    // This would typically open an edit modal
    console.log(`Editing school: ${school.name}`);
  };

  const handleArchive = (school: School) => {
    // This would typically send an API request to archive the school
    console.log(`Archiving school: ${school.name}`);
  };

  const handleExport = (school: School) => {
    // This would typically trigger an export functionality
    console.log(`Exporting school data: ${school.name}`);
  };

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
                      <DropdownMenuItem onClick={() => handleArchive(school)}>
                        <Archive className="mr-2 h-4 w-4" />
                        <span>Arxivləşdir</span>
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
      
      {schools.length === 0 && (
        <div className="py-12 text-center">
          <p className="text-infoline-dark-gray">Nəticə tapılmadı</p>
        </div>
      )}
    </div>
  );
};
