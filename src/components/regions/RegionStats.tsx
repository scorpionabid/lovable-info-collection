
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { 
  Building2, 
  GraduationCap, 
  School2, 
  Users,
  TrendingUp 
} from "lucide-react";
import { RegionWithStats } from "@/services/supabase/region/types";

interface RegionStatsProps {
  region: RegionWithStats;
}

export const RegionStats: React.FC<RegionStatsProps> = ({ region }) => {
  // Prepare the stat items
  const statItems = [
    {
      label: "Ümumi Məktəb",
      value: region.schoolCount || 0,
      icon: <Building2 className="h-5 w-5 text-blue-500" />,
      change: "+2.5%",
      changeType: "increase" as const,
    },
    {
      label: "Ümumi Sektor",
      value: region.sectorCount || 0,
      icon: <School2 className="h-5 w-5 text-green-500" />,
      change: "+1.2%",
      changeType: "increase" as const,
    },
    {
      label: "Ümumi Şagird",
      value: region.studentCount || 0,
      icon: <Users className="h-5 w-5 text-purple-500" />,
      change: "+3.1%",
      changeType: "increase" as const,
    },
    {
      label: "Ümumi Müəllim",
      value: region.teacherCount || 0,
      icon: <GraduationCap className="h-5 w-5 text-orange-500" />,
      change: "+0.8%",
      changeType: "increase" as const,
    },
    {
      label: "Tamamlanma %",
      value: `${region.completionRate || 0}%`,
      icon: <TrendingUp className="h-5 w-5 text-teal-500" />,
      change: "+5.3%",
      changeType: "increase" as const,
    },
  ];

  return (
    <div className="mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {statItems.map((item, index) => (
              <div 
                key={index} 
                className="flex items-center p-4 bg-gray-50 rounded-lg border border-gray-100"
              >
                <div className="mr-4 p-2 bg-white rounded-full shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {item.label}
                  </p>
                  <div className="flex items-baseline">
                    <p className="text-2xl font-semibold text-gray-900">
                      {item.value}
                    </p>
                    <span className={`ml-2 text-xs font-medium ${
                      item.changeType === "increase" 
                        ? "text-green-600" 
                        : "text-red-600"
                    }`}>
                      {item.change}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
