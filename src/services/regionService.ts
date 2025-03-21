
// Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
import * as regionsService from '@/supabase/services/regions';
export * from '@/supabase/services/regions';

// Köhnə API-ya uyğunluq üçün default export
const regionService = {
  ...regionsService
};

export default regionService;
