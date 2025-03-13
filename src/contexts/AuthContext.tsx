import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { getNormalizedRole } from "@/components/users/utils/userUtils";

export type UserRole =
  | "super-admin"
  | "region-admin"
  | "sector-admin"
  | "school-admin";

interface AuthContextProps {
  user: any | null;
  userRole: UserRole | undefined;
  loading: boolean;
  login: (email: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextProps>({
  user: null,
  userRole: undefined,
  loading: true,
  login: async () => {},
  logout: async () => {},
});

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [userRole, setUserRole] = useState<UserRole | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadUser = async () => {
      const {
        data: { user: supabaseUser },
      } = await supabase.auth.getUser();
      handleUserLoggedIn(supabaseUser);
    };

    loadUser();

    supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN") {
        handleUserLoggedIn(session?.user);
      } else if (event === "SIGNED_OUT") {
        handleUserLoggedOut();
      }
    });
  }, []);

  const login = async (email: string) => {
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false,
          emailRedirectTo: `${window.location.origin}/dashboard`,
        },
      });
      if (error) throw error;
      alert("Check your email for the login link!");
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const logout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      handleUserLoggedOut();
      navigate("/");
    } catch (error: any) {
      alert(error.error_description || error.message);
    }
  };

  const handleUserLoggedOut = () => {
    setUser(null);
    setUserRole(undefined);
    setLoading(false);
  };

  // Replace the part that causes the error
const handleUserLoggedIn = (userData: any) => {
  if (!userData) {
    setUser(null);
    setLoading(false);
    return;
  }

  // Normalize user data to avoid TypeScript errors
  const normalizedUser = {
    id: userData.id,
    email: userData.email,
    first_name: userData.first_name || userData.firstName || "",
    last_name: userData.last_name || userData.lastName || "",
    role_id: userData.role_id || "",
    region_id: userData.region_id || "",
    sector_id: userData.sector_id || "",
    school_id: userData.school_id || "",
    is_active: userData.is_active !== undefined ? userData.is_active : true,
    roles: userData.roles || {
      id: "",
      name: userData.role || "",
      permissions: []
    },
    role: userData.role || (userData.roles ? userData.roles.name : ""),
  };

  setUser(normalizedUser);
  setUserRole(getNormalizedRole(normalizedUser.role));
  setLoading(false);
};

  const value = { user, userRole, loading, login, logout };
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};
