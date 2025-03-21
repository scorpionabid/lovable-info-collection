
// Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
import * as usersService from '@/supabase/services/users';
export * from '@/supabase/services/users';
export type { User } from '@/supabase/types';

// User tipini yenidən ixrac et, User interfeysi ilə konflikt olmasın deyə
export { type UserWithRole, type CreateUserDto, type UpdateUserDto } from '@/supabase/types';

// Köhnə API-ya uyğunluq üçün default export
const userService = {
  ...usersService
};

export default userService;
