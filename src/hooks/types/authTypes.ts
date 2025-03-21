
export type UserRole = 'super-admin' | 'region-admin' | 'sector-admin' | 'school-admin' | 'teacher';

export interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  regionId?: string;
  sectorId?: string;
  schoolId?: string;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignUpCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role?: UserRole;
}

export interface ResetPasswordCredentials {
  oldPassword: string;
  newPassword: string;
}

export interface AuthState {
  user: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  isAuthenticated: boolean;
  error: Error | null;
}

export interface AuthContextType {
  user: UserProfile | null;
  userRole: UserRole | null;
  loading: boolean;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string | LoginCredentials, password?: string) => Promise<void>;
  logout: () => Promise<void>;
  permissions: string[];
  authInitialized: boolean;
  sessionExists: boolean;
  isUserReady: boolean;
}
