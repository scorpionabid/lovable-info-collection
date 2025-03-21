/**
 * Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
 * @deprecated Bu fayl köhnə API-ya uyğunluq üçün saxlanılıb. Birbaşa @/lib/supabase istifadə edin.
 */
import * as metricService from '@/lib/supabase/services/metrics';
export * from '@/lib/supabase/services/metrics';

// Köhnə API-ya uyğunluq üçün default export
export default metricService;
