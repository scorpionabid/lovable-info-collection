
// Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
import * as sectorsService from '@/supabase/services/sectors';
export * from '@/supabase/services/sectors';

// Köhnə API-ya uyğunluq üçün default export
const sectorService = {
  ...sectorsService
};

export default sectorService;
