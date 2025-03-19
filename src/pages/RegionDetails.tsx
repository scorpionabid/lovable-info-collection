import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { RegionHeader } from "@/components/regions/RegionHeader";
import { RegionStats } from "@/components/regions/RegionStats";
import { SectorTable } from "@/components/sectors/SectorTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SectorModal, SectorModalProps } from "@/components/sectors/SectorModal";
import { SchoolModal, SchoolModalProps } from "@/components/schools/SchoolModal";
import { getRegionById } from "@/services/regionService";
import { getSectorsByRegionId } from "@/services/sectorService";
import { SectorWithStats } from "@/services/supabase/sector/types";
import { RegionWithStats } from '@/services/supabase/region/types';

const RegionDetails = () => {
  const { id } = useParams();
  const [region, setRegion] = useState<RegionWithStats | null>(null);
  const [sectors, setSectors] = useState<SectorWithStats[]>([]);
  const [createSectorModalOpen, setCreateSectorModalOpen] = useState(false);
  const [createSchoolModalOpen, setCreateSchoolModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchRegion = async () => {
      const data = await getRegionById(id);
      setRegion(data);
    };

    fetchRegion();
  }, [id]);

  const fetchSectors = async () => {
    if (!id) return;

    const data = await getSectorsByRegionId(id);
    setSectors(data.map(sector => ({
      ...sector,
      id: sector.id,
      name: sector.name,
      region_id: sector.region_id,
      regionName: sector.regionName || region.name,
      created_at: sector.created_at || new Date().toISOString(),
      schoolCount: sector.schoolCount || sector.schools_count || 0,
      completionRate: sector.completionRate || sector.completion_rate || 0,
      archived: sector.archived || false,
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

  if (!region) {
    return (
      <Layout userRole="super-admin">
        <div>Loading...</div>
      </Layout>
    );
  }

  return (
    <Layout userRole="super-admin">
      <RegionHeader region={region} />

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
        currentPage={1}
        pageSize={10}
        onPageChange={() => {}}
        onEditSector={() => {}}
        onDeleteSector={() => {}}
        onDataChange={fetchSectors}
      />

      <div className="md:px-6 mt-4">
        <Button onClick={() => setCreateSchoolModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Yeni Məktəb
        </Button>
      </div>

      <SectorModal
        isOpen={true}
        onClose={() => setCreateSectorModalOpen(false)}
        mode="create"
        regionId={id} // Pass the region ID instead of full object
        onSuccess={handleSectorCreated}
      />

      <SchoolModal
        isOpen={true}
        onClose={() => setCreateSchoolModalOpen(false)}
        mode="create"
        regionId={id}
        onCreated={handleSchoolCreated}
      />
    </Layout>
  );
};

export default RegionDetails;
