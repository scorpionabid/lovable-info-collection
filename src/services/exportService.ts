/**
 * Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
 * @deprecated Bu fayl köhnə API-ya uyğunluq üçün saxlanılıb. Birbaşa @/lib/supabase istifadə edin.
 */
import * as exportService from '@/lib/supabase/services/exports';
export * from '@/lib/supabase/services/exports';

// Köhnə API-ya uyğunluq üçün default export
export default exportService;
