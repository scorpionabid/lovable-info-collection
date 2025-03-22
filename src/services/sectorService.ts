
// Import və re-export src/lib/supabase/services/sectors faylından
import {
  getSectors,
  getSectorById,
  getSectorsByRegionId,
  createSector,
  updateSector,
  deleteSector,
  getSectorsForDropdown
} from '@/lib/supabase/services/sectors';

// İmport schools servisindən getSectorSchools üçün
import { getSchoolsBySectorId } from '@/lib/supabase/services/schools';

// Sektorla əlaqəli məktəbləri almaq funksiyası 
export const getSectorSchools = getSchoolsBySectorId;

export {
  getSectors,
  getSectorById,
  getSectorsByRegionId,
  createSector,
  updateSector,
  deleteSector,
  getSectorsForDropdown
};

// Default export üçün servis obyekti
const sectorService = {
  getSectors,
  getSectorById,
  getSectorsByRegionId,
  createSector,
  updateSector,
  deleteSector,
  getSectorsForDropdown,
  getSectorSchools
};

export default sectorService;
