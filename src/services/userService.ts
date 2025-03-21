/**
 * Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
 * @deprecated Bu fayl köhnə API-ya uyğunluq üçün saxlanılıb. Birbaşa @/lib/supabase istifadə edin.
 */
import * as usersService from '@/lib/supabase/services/users';
export * from '@/lib/supabase/services/users';
export type { User } from '@/lib/supabase/types/user';

// User tipini yenidən ixrac et, User interfeysi ilə konflikt olmasın deyə
export { type UserWithRole, type CreateUserDto, type UpdateUserDto } from '@/lib/supabase/types/user';

// Köhnə API-ya uyğunluq üçün default export
const userService = {
  ...usersService
};

export default userService;
