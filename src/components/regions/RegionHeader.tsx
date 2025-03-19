
import React from 'react';
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Trash } from "lucide-react";
import { Link } from "react-router-dom";
import { RegionWithStats } from "@/services/supabase/region/types";

interface RegionHeaderProps {
  region: RegionWithStats;
  onEditRegion?: () => void;
  onDeleteRegion?: () => void;
}

export const RegionHeader: React.FC<RegionHeaderProps> = ({
  region,
  onEditRegion,
  onDeleteRegion
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-sm">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="h-8 w-8 text-infoline-dark-gray"
        >
          <Link to="/regions">
            <ChevronLeft className="h-4 w-4" />
          </Link>
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-infoline-dark-blue">
            {region.name}
          </h1>
          <p className="text-sm text-infoline-dark-gray">
            Məktəb sayı: {region.schoolCount} | Sektor sayı: {region.sectorCount}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 mt-4 md:mt-0">
        {onEditRegion && (
          <Button
            variant="outline"
            size="sm"
            onClick={onEditRegion}
            className="h-9"
          >
            <Edit className="h-4 w-4 mr-2" />
            Redaktə et
          </Button>
        )}
        {onDeleteRegion && (
          <Button
            variant="destructive"
            size="sm"
            onClick={onDeleteRegion}
            className="h-9"
          >
            <Trash className="h-4 w-4 mr-2" />
            Sil
          </Button>
        )}
      </div>
    </div>
  );
};
