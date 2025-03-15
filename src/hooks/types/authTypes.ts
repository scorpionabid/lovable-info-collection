
export type UserRole =
  | "super-admin"
  | "region-admin"
  | "sector-admin"
  | "school-admin";

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthState {
  user: any | null;
  userRole: UserRole | undefined;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string | LoginCredentials, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  permissions?: string[];
  authInitialized: boolean;
}
