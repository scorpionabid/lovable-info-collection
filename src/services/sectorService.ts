/**
 * Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
 * @deprecated Bu fayl köhnə API-ya uyğunluq üçün saxlanılıb. Birbaşa @/lib/supabase istifadə edin.
 */
import * as sectorsService from '@/lib/supabase/services/sectors';
import { getSectorsByRegionId } from '@/lib/supabase/services/sectors';
export * from '@/lib/supabase/services/sectors';

// Köhnə API-ya uyğunluq üçün default export
export default sectorsService;
