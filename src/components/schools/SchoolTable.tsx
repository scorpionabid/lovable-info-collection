
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
import { School } from "@/services/supabase/school/types";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

interface SchoolTableProps {
  schools: School[];
  isLoading: boolean;
  onEditSchool: (school: School) => void;
  onDeleteSchool: (school: School) => void;
}

export const SchoolTable = ({
  schools,
  isLoading,
  onEditSchool,
  onDeleteSchool,
}: SchoolTableProps) => {
  const navigate = useNavigate();
  const [sortField, setSortField] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedSchools = [...schools].sort((a, b) => {
    let aValue: any = a[sortField as keyof School];
    let bValue: any = b[sortField as keyof School];

    // Handle special cases for sorting
    if (sortField === "completionRate") {
      aValue = Number(aValue);
      bValue = Number(bValue);
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

  const copySchoolInfo = (school: School) => {
    const info = `${school.name}
Növ: ${school.type}
Region: ${school.region}
Sektor: ${school.sector}
Şagird sayı: ${school.studentCount}
Müəllim sayı: ${school.teacherCount}
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

  if (schools.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center">
        <AlertCircle className="h-12 w-12 text-infoline-blue mb-4" />
        <h3 className="text-lg font-semibold mb-2">Heç bir məktəb tapılmadı</h3>
        <p className="text-infoline-dark-gray mb-4">
          Axtarış kriteriyalarına uyğun məktəb yoxdur
        </p>
        <Button variant="outline">Filtirləri sıfırla</Button>
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
              onClick={() => handleSort("studentCount")}
            >
              <div className="flex items-center justify-end">
                Şagird sayı {renderSortIcon("studentCount")}
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
              <TableCell>{school.type}</TableCell>
              <TableCell>{school.region}</TableCell>
              <TableCell>{school.sector}</TableCell>
              <TableCell className="text-right">{school.studentCount}</TableCell>
              <TableCell className="text-right">
                <Badge
                  className={`${
                    school.completionRate < 50
                      ? "bg-red-100 text-red-800"
                      : school.completionRate < 80
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {school.completionRate}%
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
