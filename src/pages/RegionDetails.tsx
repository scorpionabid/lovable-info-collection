
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Layout } from "@/components/layout/Layout";
import { RegionHeader } from "@/components/regions/details/RegionHeader";
import { RegionStats } from "@/components/regions/details/RegionStats";
import { SectorTable } from "@/components/sectors/SectorTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { SectorModal } from "@/components/sectors/SectorModal";
import { SchoolModal } from "@/components/schools/SchoolModal";
import { getRegionById } from "@/services/regionService";
import { getSectorsByRegionId } from "@/services/sectorService";
import { RegionWithStats } from "@/services/supabase/region/types";
import { SectorWithStats } from "@/services/supabase/sector/types";

interface SectorTableProps {
  sectors: SectorWithStats[];
  isLoading: boolean;
  isError: boolean;
  totalCount: number;
  currentPage?: number;
  pageSize?: number;
  onDataChange: () => void;
}

interface SectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit';
  regionId?: string;
  sector?: SectorWithStats;
  onSuccess?: () => void;
}

const RegionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [region, setRegion] = useState<RegionWithStats | null>(null);
  const [sectors, setSectors] = useState<SectorWithStats[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [createSectorModalOpen, setCreateSectorModalOpen] = useState(false);
  const [createSchoolModalOpen, setCreateSchoolModalOpen] = useState(false);

  // Fetch region data
  useEffect(() => {
    if (!id) return;

    const fetchRegion = async () => {
      setIsLoading(true);
      try {
        const data = await getRegionById(id);
        if (data) {
          setRegion(data);
        }
      } catch (error) {
        console.error("Error fetching region:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRegion();
  }, [id]);

  // Fetch sectors
  const fetchSectors = async () => {
    if (!id) return;
    try {
      const data = await getSectorsByRegionId(id);
      setSectors(data);
    } catch (error) {
      console.error("Error fetching sectors:", error);
    }
  };

  useEffect(() => {
    if (region) {
      fetchSectors();
    }
  }, [id, region]);

  const handleSectorCreated = () => {
    fetchSectors();
    setCreateSectorModalOpen(false);
  };

  const handleSchoolCreated = () => {
    fetchSectors();
    setCreateSchoolModalOpen(false);
  };

  if (isLoading || !region) {
    return (
      <Layout userRole="super-admin">
        <div className="flex items-center justify-center h-full">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-infoline-blue"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout userRole="super-admin">
      <div className="space-y-6 p-4">
        <RegionHeader 
          region={region}
          onEdit={() => console.log("Edit region")}
          onExport={() => console.log("Export region")}
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

        {sectors.length > 0 ? (
          <SectorTable 
            sectors={sectors}
            isLoading={false}
            isError={false}
            totalCount={sectors.length}
            onDataChange={fetchSectors}
          />
        ) : (
          <div className="bg-white p-6 rounded-lg shadow-sm text-center">
            <p className="text-gray-500">Bu region üçün hələ sektor yoxdur</p>
          </div>
        )}

        <div className="md:px-6 mt-4">
          <Button onClick={() => setCreateSchoolModalOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Yeni Məktəb
          </Button>
        </div>

        {createSectorModalOpen && (
          <SectorModal
            isOpen={createSectorModalOpen}
            onClose={() => setCreateSectorModalOpen(false)}
            mode="create"
            regionId={id}
            onSuccess={handleSectorCreated}
          />
        )}

        {createSchoolModalOpen && (
          <SchoolModal
            isOpen={createSchoolModalOpen}
            onClose={() => setCreateSchoolModalOpen(false)}
            mode="create"
            regionId={id}
            onSuccess={handleSchoolCreated}
          />
        )}
      </div>
    </Layout>
  );
};

export default RegionDetails;
