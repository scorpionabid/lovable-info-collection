
import React from "react";
import { School, Map, Building } from "lucide-react";
import { 
  Label 
} from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Region {
  id: string;
  name: string;
}

interface Sector {
  id: string;
  name: string;
}

interface School {
  id: string;
  name: string;
}

interface OrganizationSelectProps {
  roleType: string;
  regions: Region[];
  sectors: Sector[];
  schools: School[];
  selectedRegion: string;
  selectedSector: string;
  onRegionChange: (value: string) => void;
  onSectorChange: (value: string) => void;
  onSchoolChange: (value: string) => void;
  schoolValue: string;
}

export const OrganizationSelect = ({
  roleType,
  regions,
  sectors,
  schools,
  selectedRegion,
  selectedSector,
  onRegionChange,
  onSectorChange,
  onSchoolChange,
  schoolValue
}: OrganizationSelectProps) => {
  
  // For SuperAdmin roles, just show a message
  if (roleType.includes("super")) {
    return (
      <div className="bg-infoline-lightest-gray p-4 rounded-md">
        <p className="text-sm text-infoline-dark-gray">SuperAdmin istifadəçilər bütün təşkilatlara çıxışa malikdirlər.</p>
      </div>
    );
  }

  return (
    <>
      {/* Region Admin - Only show region selector */}
      {roleType.includes("region") && (
        <div className="space-y-2">
          <Label htmlFor="region">Region</Label>
          <Select 
            value={selectedRegion} 
            onValueChange={onRegionChange}
          >
            <SelectTrigger id="region">
              <SelectValue placeholder="Region seçin" />
            </SelectTrigger>
            <SelectContent>
              {regions.map((region) => (
                <SelectItem key={region.id} value={region.id}>
                  {region.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      )}
      
      {/* Sector Admin - Show region and sector selectors */}
      {roleType.includes("sector") && (
        <>
          <div className="space-y-2">
            <Label htmlFor="region-sector">Region</Label>
            <Select
              value={selectedRegion}
              onValueChange={onRegionChange}
            >
              <SelectTrigger id="region-sector">
                <SelectValue placeholder="Region seçin" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector">Sektor</Label>
            <Select
              value={selectedSector}
              onValueChange={onSectorChange}
              disabled={!selectedRegion || sectors.length === 0}
            >
              <SelectTrigger id="sector">
                <SelectValue placeholder="Sektor seçin" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
      
      {/* School Admin - Show region, sector and school selectors */}
      {roleType.includes("school") && (
        <>
          <div className="space-y-2">
            <Label htmlFor="region-school">Region</Label>
            <Select
              value={selectedRegion}
              onValueChange={onRegionChange}
            >
              <SelectTrigger id="region-school">
                <SelectValue placeholder="Region seçin" />
              </SelectTrigger>
              <SelectContent>
                {regions.map((region) => (
                  <SelectItem key={region.id} value={region.id}>
                    {region.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="sector-school">Sektor</Label>
            <Select
              value={selectedSector}
              onValueChange={onSectorChange}
              disabled={!selectedRegion || sectors.length === 0}
            >
              <SelectTrigger id="sector-school">
                <SelectValue placeholder="Sektor seçin" />
              </SelectTrigger>
              <SelectContent>
                {sectors.map((sector) => (
                  <SelectItem key={sector.id} value={sector.id}>
                    {sector.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="school">Məktəb</Label>
            <Select
              value={schoolValue}
              onValueChange={onSchoolChange}
              disabled={!selectedSector || schools.length === 0}
            >
              <SelectTrigger id="school">
                <SelectValue placeholder="Məktəb seçin" />
              </SelectTrigger>
              <SelectContent>
                {schools.map((school) => (
                  <SelectItem key={school.id} value={school.id}>
                    {school.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </>
  );
};
