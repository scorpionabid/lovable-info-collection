/**
 * Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
 * @deprecated Bu fayl köhnə API-ya uyğunluq üçün saxlanılıb. Birbaşa @/lib/supabase istifadə edin.
 */
import * as regionsService from '@/lib/supabase/services/regions';
export * from '@/lib/supabase/services/regions';

// Köhnə API-ya uyğunluq üçün default export
export default regionsService;
