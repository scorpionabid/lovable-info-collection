
// Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
import * as sectorsService from '@/supabase/services/sectors';
import { getSectorsByRegionId } from '@/supabase/services/sectors';
export * from '@/supabase/services/sectors';

// Əlavə köməkçi funksiyaları əlavə et
export { getSectorsByRegionId };

// Köhnə API-ya uyğunluq üçün default export
const sectorService = {
  ...sectorsService,
  getSectorsByRegionId
};

export default sectorService;
