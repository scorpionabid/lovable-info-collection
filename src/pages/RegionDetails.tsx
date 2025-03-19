
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { RegionHeader } from "@/components/regions/details/RegionHeader";
import { RegionStats } from "@/components/regions/details/RegionStats";
import { SectorTable } from "@/components/sectors/SectorTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SectorModal } from "@/components/sectors/SectorModal";
import { SchoolModal } from "@/components/schools/modal/SchoolModal";
import { getRegionById } from "@/services/supabase/region";
import { getSectorsByRegionId } from "@/services/supabase/sector/sectorQueries";
import { RegionWithStats } from "@/services/supabase/region/types";
import { SectorWithStats } from "@/services/supabase/sector/types";

const RegionDetails = () => {
  const { id } = useParams();
  const [region, setRegion] = useState<RegionWithStats | null>(null);
  const [sectors, setSectors] = useState<SectorWithStats[]>([]);
  const [createSectorModalOpen, setCreateSectorModalOpen] = useState(false);
  const [createSchoolModalOpen, setCreateSchoolModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(10);
  const [sortColumn, setSortColumn] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  useEffect(() => {
    if (!id) return;
    const fetchRegion = async () => {
      const data = await getRegionById(id);
      if (data) {
        // Ensure all required properties exist with default values if needed
        const regionWithDefaults: RegionWithStats = {
          ...data,
          sectorCount: data.sectorCount || data.sectors_count || 0,
          schoolCount: data.schoolCount || data.schools_count || 0,
          studentCount: data.studentCount || 0,
          teacherCount: data.teacherCount || 0,
          completionRate: data.completionRate || data.completion_rate || 0,
          description: data.description || '',
          // Add backward compatibility fields
          sectors_count: data.sectors_count || data.sectorCount || 0,
          schools_count: data.schools_count || data.schoolCount || 0,
          completion_rate: data.completion_rate || data.completionRate || 0
        };
        setRegion(regionWithDefaults);
      }
    };
    fetchRegion();
  }, [id]);

  const fetchSectors = async () => {
    if (!id) return;
    const data = await getSectorsByRegionId(id);
    setSectors(data.map((sector) => ({
      ...sector,
      id: sector.id,
      name: sector.name,
      region_id: sector.region_id,
      regionName: sector.regionName || (region ? region.name : ''),
      description: sector.description || '',
      created_at: sector.created_at || new Date().toISOString(),
      schoolCount: sector.schoolCount || sector.schools_count || 0,
      completionRate: sector.completionRate || sector.completion_rate || 0,
      archived: sector.archived || false
    })));
  };

  useEffect(() => {
    fetchSectors();
  }, [id, region]);

  const handleSectorCreated = () => {
    fetchSectors();
    setCreateSectorModalOpen(false);
  };

  const handleSchoolCreated = () => {
    fetchSectors();
    setCreateSchoolModalOpen(false);
  };

  const handleSortChange = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  if (!region) {
    return (
      <Layout userRole="super-admin">
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout userRole="super-admin">
      <RegionHeader 
        region={region}
        onEdit={() => {}}
        onExport={() => {}}
      />

      <RegionStats region={region} />

      <div className="md:px-6 border-b border-gray-200 dark:border-gray-700">
        <div className="py-3 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Sektorlar</h3>
          <Button onClick={() => setCreateSectorModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Sektor
          </Button>
        </div>
      </div>

      <SectorTable 
        sectors={sectors}
        isLoading={false}
        isError={false}
        totalCount={sectors.length}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        sortColumn={sortColumn}
        sortDirection={sortDirection}
        onSortChange={handleSortChange}
        onRefresh={fetchSectors}
        onDataChange={fetchSectors}
      />

      <div className="md:px-6 mt-4">
        <Button onClick={() => setCreateSchoolModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Məktəb
        </Button>
      </div>

      <SectorModal
        isOpen={createSectorModalOpen}
        onClose={() => setCreateSectorModalOpen(false)}
        mode="create"
        regionId={id || ''}
        onSuccess={handleSectorCreated}
      />

      <SchoolModal
        isOpen={createSchoolModalOpen}
        onClose={() => setCreateSchoolModalOpen(false)}
        mode="create"
        regionId={id || ''}
        onCreated={handleSchoolCreated}
      />
    </Layout>
  );
};

export default RegionDetails;
