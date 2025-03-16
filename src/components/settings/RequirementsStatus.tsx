
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

interface RequirementItem {
  name: string;
  status: 'completed' | 'in-progress' | 'pending';
  details?: string;
}

interface RequirementCategory {
  title: string;
  items: RequirementItem[];
}

interface RequirementsStatusProps {
  simplified?: boolean; // For simplified view on dashboard
}

const requirementsList: RequirementCategory[] = [
  {
    title: "Autentifikasiya və İstifadəçi İdarəetməsi",
    items: [
      { name: "Giriş sistemi", status: "completed", details: "Supabase ilə inteqrasiya tamamlanıb" },
      { name: "Rol əsaslı səlahiyyətlər", status: "completed" },
      { name: "Şifrə bərpası", status: "completed" },
      { name: "Sessiya idarəetməsi", status: "in-progress" },
      { name: "Aktivliyin izlənməsi", status: "pending" }
    ]
  },
  {
    title: "Təşkilati Struktur",
    items: [
      { name: "Region idarəetməsi", status: "completed" },
      { name: "Sektor idarəetməsi", status: "completed" },
      { name: "Məktəb idarəetməsi", status: "completed" },
      { name: "Excel idxalı/ixracı", status: "in-progress" }
    ]
  },
  {
    title: "Məlumat Strukturu",
    items: [
      { name: "Kateqoriya idarəetməsi", status: "completed" },
      { name: "Sütun idarəetməsi", status: "completed" },
      { name: "Validasiya qaydaları", status: "in-progress" },
      { name: "Formul sütunları", status: "pending" }
    ]
  },
  {
    title: "Məlumat Daxiletmə",
    items: [
      { name: "Sadə form interfeysi", status: "completed" },
      { name: "Microsoft Forms üslubu", status: "in-progress" },
      { name: "Excel şablonları", status: "in-progress" },
      { name: "Validasiya", status: "in-progress" },
      { name: "Təsdiq sistemi", status: "pending" }
    ]
  },
  {
    title: "Bildiriş Sistemi",
    items: [
      { name: "Sistem bildirişləri", status: "in-progress" },
      { name: "Email bildirişləri", status: "pending" },
      { name: "Son tarix xəbərdarlıqları", status: "pending" }
    ]
  },
  {
    title: "Hesabat və Analitika",
    items: [
      { name: "Əsas dashboardlar", status: "in-progress" },
      { name: "Filtirləmə və axtarış", status: "in-progress" },
      { name: "Excel ixracı", status: "in-progress" },
      { name: "Vizual analizlər", status: "pending" }
    ]
  },
  {
    title: "Digər Funksionallıq",
    items: [
      { name: "Çoxdilli dəstək", status: "pending" },
      { name: "Arxivləşdirmə", status: "pending" },
      { name: "Versiya nəzarəti", status: "pending" },
      { name: "Sistem ayarları", status: "in-progress" }
    ]
  }
];

export const RequirementsStatus: React.FC<RequirementsStatusProps> = ({ simplified = false }) => {
  const calculateProgress = (items: RequirementItem[]): number => {
    const completed = items.filter(item => item.status === 'completed').length;
    return Math.round((completed / items.length) * 100);
  };
  
  const getTotalProgress = (): number => {
    const allItems = requirementsList.flatMap(category => category.items);
    return calculateProgress(allItems);
  };
  
  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'completed':
        return <Badge className="bg-green-500">Tamamlanıb</Badge>;
      case 'in-progress':
        return <Badge className="bg-amber-500">Davam edir</Badge>;
      case 'pending':
        return <Badge className="bg-gray-400">Gözləyir</Badge>;
      default:
        return <Badge>Naməlum</Badge>;
    }
  };
  
  if (simplified) {
    return (
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span className="text-sm font-medium">Ümumi tamamlanma:</span>
            <span className="text-sm font-medium">{getTotalProgress()}%</span>
          </div>
          <Progress value={getTotalProgress()} className="h-2" />
        </div>
        
        <div className="grid grid-cols-1 gap-2 mt-4">
          {requirementsList.map((category, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span>{category.title}</span>
                <span>{calculateProgress(category.items)}%</span>
              </div>
              <Progress value={calculateProgress(category.items)} className="h-1.5" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>İnfoLine Layihə Statusu</CardTitle>
          <CardDescription>
            Tələblər sənədinə əsasən layihənin tamamlanma faizi
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-sm font-medium">Ümumi tamamlanma:</span>
              <span className="text-sm font-medium">{getTotalProgress()}%</span>
            </div>
            <Progress value={getTotalProgress()} className="h-2" />
          </div>
        </CardContent>
      </Card>
      
      {requirementsList.map((category, index) => (
        <Card key={index}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{category.title}</CardTitle>
              <span className="text-sm font-medium">{calculateProgress(category.items)}%</span>
            </div>
            <Progress value={calculateProgress(category.items)} className="h-2" />
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {category.items.map((item, itemIndex) => (
                <div key={itemIndex} className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{item.name}</p>
                    {item.details && <p className="text-sm text-gray-500">{item.details}</p>}
                  </div>
                  {getStatusBadge(item.status)}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
