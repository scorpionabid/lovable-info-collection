
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PageHeader } from "@/components/layout/PageHeader";
import { RegionStats } from "@/components/regions/details/RegionStats";
import { RegionCharts } from "@/components/regions/details/RegionCharts";
import { SectorTable } from "@/components/sectors/SectorTable";
import { SchoolTable } from "@/components/schools/SchoolTable";
import { SectorModal } from "@/components/sectors/SectorModal";
import { SchoolModal } from "@/components/schools/SchoolModal";
import { Spinner } from "@/components/ui/spinner";
import { getRegionById } from "@/services/supabase/region/queries";
import { getSectorsByRegion } from "@/services/supabase/region/sectorQueries";
import { getSchoolsByRegion } from "@/services/supabase/school/queries/schoolQueries";
import { RegionWithStats, Sector } from "@/services/supabase/region/types";
import { School } from "@/services/supabase/school/types";

export default function RegionDetails() {
  const { id } = useParams<{ id: string }>();
  const [region, setRegion] = useState<RegionWithStats | null>(null);
  const [sectors, setSectors] = useState<Sector[]>([]);
  const [schools, setSchools] = useState<School[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  
  // Modals
  const [isSectorModalOpen, setIsSectorModalOpen] = useState(false);
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  
  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      
      setIsLoading(true);
      try {
        // Fetch region details
        const regionData = await getRegionById(id);
        if (regionData) {
          setRegion(regionData);
          
          // Fetch sectors in this region
          const sectorsData = await getSectorsByRegion(id);
          if (sectorsData) {
            // Add UI fields for compatibility
            const processedSectors = sectorsData.map(sector => ({
              ...sector,
              schoolCount: sector.schools_count,
              completionRate: sector.completion_rate
            }));
            setSectors(processedSectors);
          }
          
          // Fetch schools in this region
          const schoolsData = await getSchoolsByRegion(id);
          if (schoolsData) {
            setSchools(schoolsData);
          }
        }
      } catch (error) {
        console.error("Error fetching region details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Reload data after modal actions
  const handleDataChange = () => {
    if (id) {
      setIsLoading(true);
      Promise.all([
        getRegionById(id),
        getSectorsByRegion(id),
        getSchoolsByRegion(id)
      ]).then(([regionData, sectorsData, schoolsData]) => {
        if (regionData) setRegion(regionData);
        if (sectorsData) {
          const processedSectors = sectorsData.map(sector => ({
            ...sector,
            schoolCount: sector.schools_count,
            completionRate: sector.completion_rate
          }));
          setSectors(processedSectors);
        }
        if (schoolsData) setSchools(schoolsData);
      }).catch(error => {
        console.error("Error reloading data:", error);
      }).finally(() => {
        setIsLoading(false);
      });
    }
  };

  if (isLoading && !region) {
    return (
      <div className="flex items-center justify-center h-96">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!region) {
    return (
      <div className="flex flex-col items-center justify-center h-96">
        <h2 className="text-2xl font-bold">Region not found</h2>
        <Link to="/regions" className="mt-4 text-blue-500 hover:underline">
          Back to Regions
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex justify-between items-center">
        <PageHeader
          title={region.name}
          description="Region details and statistics"
          backButton={
            <Button variant="outline" size="sm" asChild>
              <Link to="/regions">
                <ChevronLeft className="h-4 w-4 mr-2" />
                Back to Regions
              </Link>
            </Button>
          }
        />
      </div>

      <RegionStats region={region} />
      
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sectors">Sectors</TabsTrigger>
          <TabsTrigger value="schools">Schools</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="mt-6">
          <RegionCharts region={region} />
        </TabsContent>
        
        <TabsContent value="sectors" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Sectors in {region.name}</h2>
            <Button onClick={() => setIsSectorModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Sector
            </Button>
          </div>
          <SectorTable sectors={sectors} regionId={id} onDataChange={handleDataChange} />
        </TabsContent>
        
        <TabsContent value="schools" className="mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Schools in {region.name}</h2>
            <Button onClick={() => setIsSchoolModalOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add School
            </Button>
          </div>
          <SchoolTable schools={schools} onDataChange={handleDataChange} />
        </TabsContent>
      </Tabs>
      
      {/* Modals */}
      {isSectorModalOpen && (
        <SectorModal 
          isOpen={isSectorModalOpen}
          onClose={() => setIsSectorModalOpen(false)}
          mode="create"
          region={region}
          onSectorCreated={handleDataChange}
        />
      )}
      
      {isSchoolModalOpen && (
        <SchoolModal 
          isOpen={isSchoolModalOpen}
          onClose={() => setIsSchoolModalOpen(false)}
          mode="create"
          onSchoolCreated={handleDataChange}
        />
      )}
    </div>
  );
}
