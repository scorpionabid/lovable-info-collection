
// Import və re-export src/lib/supabase/services/regions faylından
import {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion,
  archiveRegion
} from '@/lib/supabase/services/regions';

export {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion,
  archiveRegion
};

// Default export üçün servis obyekti
const regionService = {
  getRegions,
  getRegionById,
  createRegion,
  updateRegion,
  deleteRegion,
  getSectorsByRegion,
  archiveRegion
};

export default regionService;
