
// Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
import * as schoolsService from '@/supabase/services/schools';
export * from '@/supabase/services/schools';

// Köhnə API-ya uyğunluq üçün default export
const schoolService = {
  ...schoolsService
};

export default schoolService;
