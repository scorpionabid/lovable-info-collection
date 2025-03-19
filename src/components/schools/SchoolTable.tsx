import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye, 
  ArrowUpDown, 
  FileText, 
  User,
  AlertCircle 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { SchoolWithStats } from "@/services/supabase/school/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

export interface SchoolTableProps {
  schools: SchoolWithStats[];
  isLoading: boolean;
  totalCount?: number;
  currentPage?: number;
  pageSize?: number;
  setCurrentPage?: (page: number) => void;
  sortColumn?: string;
  sortDirection?: "asc" | "desc";
  onSortChange?: (column: string) => void;
  isError?: boolean;
  onRefresh?: () => void;
  onEditSchool: (school: SchoolWithStats) => void;
  onDeleteSchool: (school: SchoolWithStats) => void;
}

export const SchoolTable: React.FC<SchoolTableProps> = ({
  schools,
  isLoading,
  totalCount,
  currentPage,
  pageSize,
  setCurrentPage,
  sortColumn: externalSortColumn,
  sortDirection: externalSortDirection,
  onSortChange: externalSortChange,
  isError,
  onRefresh,
  onEditSchool,
  onDeleteSchool,
}) => {
  const navigate = useNavigate();
  const [internalSortField, setInternalSortField] = useState<string>("name");
  const [internalSortDirection, setInternalSortDirection] = useState<"asc" | "desc">("asc");

  const sortField = externalSortColumn || internalSortField;
  const sortDirection = externalSortDirection || internalSortDirection;

  const handleSort = (field: string) => {
    if (externalSortChange) {
      externalSortChange(field);
    } else {
      if (internalSortField === field) {
        setInternalSortDirection(internalSortDirection === "asc" ? "desc" : "asc");
      } else {
        setInternalSortField(field);
        setInternalSortDirection("asc");
      }
    }
  };

  const sortedSchools = [...schools].sort((a, b) => {
    let aValue: any = a[sortField as keyof SchoolWithStats];
    let bValue: any = b[sortField as keyof SchoolWithStats];

    if (sortField === "completionRate") {
      aValue = Number(a.completionRate || 0);
      bValue = Number(b.completionRate || 0);
    } else if (sortField === "studentCount" || sortField === "student_count") {
      aValue = Number(a.student_count || a.studentCount || 0);
      bValue = Number(b.student_count || b.studentCount || 0);
    } else if (sortField === "teacherCount" || sortField === "teacher_count") {
      aValue = Number(a.teacher_count || a.teacherCount || 0);
      bValue = Number(b.teacher_count || b.teacherCount || 0);
    } else if (typeof aValue === "string" && typeof bValue === "string") {
      aValue = aValue.toLowerCase();
      bValue = bValue.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  const handleViewDetails = (schoolId: string) => {
    navigate(`/schools/${schoolId}`);
  };

  const copySchoolInfo = (school: SchoolWithStats) => {
    const info = `${school.name}
Növ: ${school.type || school.type_id || 'N/A'}
Region: ${school.region || 'N/A'}
Sektor: ${school.sector || 'N/A'}
Şagird sayı: ${school.student_count || school.studentCount || 0}
Müəllim sayı: ${school.teacher_count || school.teacherCount || 0}
`;
    navigator.clipboard.writeText(info);
    toast.success("Məktəb məlumatları kopyalandı");
  };

  const renderSortIcon = (field: string) => {
    if (sortField !== field) return <ArrowUpDown className="h-4 w-4 ml-1" />;
    return sortDirection === "asc" ? (
      <ArrowUpDown className="h-4 w-4 ml-1 text-infoline-blue" />
    ) : (
      <ArrowUpDown className="h-4 w-4 ml-1 text-infoline-blue rotate-180" />
    );
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-infoline-blue"></div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-semibold mb-2">Xəta baş verdi</h3>
        <p className="text-infoline-dark-gray mb-4">
          Məlumatları yükləyərkən xəta baş verdi
        </p>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            Yenidən cəhd edin
          </Button>
        )}
      </div>
    );
  }

  if (schools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-infoline-blue mb-4" />
        <h3 className="text-lg font-semibold mb-2">Heç bir məktəb tapılmadı</h3>
        <p className="text-infoline-dark-gray mb-4">
          Axtarış kriteriyalarına uyğun məktəb yoxdur
        </p>
        {onRefresh && (
          <Button variant="outline" onClick={onRefresh}>
            Filtirləri sıfırla
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="rounded-md border overflow-hidden">
      <Table>
        <TableHeader className="bg-infoline-lightest-gray">
          <TableRow>
            <TableHead
              className="cursor-pointer hover:text-infoline-blue w-[250px]"
              onClick={() => handleSort("name")}
            >
              <div className="flex items-center">
                Məktəbin adı {renderSortIcon("name")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-infoline-blue"
              onClick={() => handleSort("type")}
            >
              <div className="flex items-center">
                Növ {renderSortIcon("type")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-infoline-blue"
              onClick={() => handleSort("region")}
            >
              <div className="flex items-center">
                Region {renderSortIcon("region")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-infoline-blue"
              onClick={() => handleSort("sector")}
            >
              <div className="flex items-center">
                Sektor {renderSortIcon("sector")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-infoline-blue text-right"
              onClick={() => handleSort("student_count")}
            >
              <div className="flex items-center justify-end">
                Şagird sayı {renderSortIcon("student_count")}
              </div>
            </TableHead>
            <TableHead
              className="cursor-pointer hover:text-infoline-blue text-right"
              onClick={() => handleSort("completionRate")}
            >
              <div className="flex items-center justify-end">
                Tamamlanma {renderSortIcon("completionRate")}
              </div>
            </TableHead>
            <TableHead>
              <div className="flex items-center">
                Admin
              </div>
            </TableHead>
            <TableHead className="text-right">Əməliyyatlar</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {sortedSchools.map((school) => (
            <TableRow key={school.id}>
              <TableCell className="font-medium">{school.name}</TableCell>
              <TableCell>{school.type || 'N/A'}</TableCell>
              <TableCell>{school.region || 'N/A'}</TableCell>
              <TableCell>{school.sector || 'N/A'}</TableCell>
              <TableCell className="text-right">{school.student_count || school.studentCount || 0}</TableCell>
              <TableCell className="text-right">
                <Badge
                  className={`${
                    (school.completionRate || 0) < 50
                      ? "bg-red-100 text-red-800"
                      : (school.completionRate || 0) < 80
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {school.completionRate || 0}%
                </Badge>
              </TableCell>
              <TableCell>
                {school.adminName ? (
                  <div className="flex items-center">
                    <User className="h-4 w-4 mr-1 text-infoline-blue" />
                    <span>{school.adminName}</span>
                  </div>
                ) : (
                  <span className="text-gray-500 text-sm">Təyin edilməyib</span>
                )}
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Menyu açın</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => handleViewDetails(school.id)}
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Ətraflı
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => onEditSchool(school)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Redaktə
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => copySchoolInfo(school)}>
                      <FileText className="h-4 w-4 mr-2" />
                      Kopyala
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      className="text-red-600"
                      onClick={() => onDeleteSchool(school)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Sil
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
