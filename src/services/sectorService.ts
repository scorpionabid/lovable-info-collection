
// Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
import * as sectorsService from '@/supabase/services/sectors';
import { getRegionsForDropdown, getSectorsByRegionId } from '@/supabase/services/sectors';
export * from '@/supabase/services/sectors';

// Əlavə köməkçi funksiyaları əlavə et
export { getRegionsForDropdown, getSectorsByRegionId };

// Köhnə API-ya uyğunluq üçün default export
const sectorService = {
  ...sectorsService,
  getRegionsForDropdown,
  getSectorsByRegionId
};

export default sectorService;
