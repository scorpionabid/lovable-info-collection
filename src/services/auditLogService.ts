/**
 * Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
 * @deprecated Bu fayl köhnə API-ya uyğunluq üçün saxlanılıb. Birbaşa @/lib/supabase istifadə edin.
 */
import * as auditLogService from '@/lib/supabase/services/audit';
export * from '@/lib/supabase/services/audit';

// Köhnə API-ya uyğunluq üçün default export
export default auditLogService;
