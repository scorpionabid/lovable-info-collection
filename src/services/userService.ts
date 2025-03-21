
// Adapter fayl: köhnə strukturdan yeni strukturaya yönləndirir
import * as usersService from '@/supabase/services/users';
export * from '@/supabase/services/users';

// Köhnə API-ya uyğunluq üçün default export
const userService = {
  ...usersService
};

export default userService;
