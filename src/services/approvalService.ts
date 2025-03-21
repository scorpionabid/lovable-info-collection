/**
 * Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
 * @deprecated Bu fayl köhnə API-ya uyğunluq üçün saxlanılıb. Birbaşa @/lib/supabase istifadə edin.
 */
import * as approvalService from '@/lib/supabase/services/approvals';
export * from '@/lib/supabase/services/approvals';

// Köhnə API-ya uyğunluq üçün default export
export default approvalService;
