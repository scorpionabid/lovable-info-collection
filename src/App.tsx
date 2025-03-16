
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

// Auth Pages
import Login from "./pages/Login";
import PasswordReset from "./pages/PasswordReset";

// Common Pages
import NotFound from "./pages/NotFound";
import Unauthorized from "./pages/Unauthorized";
import Index from "./pages/Index";

// Admin Pages
import Users from "./pages/Users";
import Regions from "./pages/Regions";
import RegionDetails from "./pages/RegionDetails";
import Sectors from "./pages/Sectors";
import SectorDetails from "./pages/SectorDetails";
import Schools from "./pages/Schools";
import SchoolDetails from "./pages/SchoolDetails";
import Categories from "./pages/Categories";
import CategoryDetails from "./pages/CategoryDetails";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

// Create a QueryClient with improved configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      staleTime: 5 * 60 * 1000, // 5 minutes
      refetchOnWindowFocus: import.meta.env.PROD, // Only in production
      refetchOnMount: true,
      cacheTime: 10 * 60 * 1000, // 10 minutes
      onError: (error) => {
        console.error('Query error:', error);
      }
    },
    mutations: {
      onError: (error) => {
        console.error('Mutation error:', error);
      }
    }
  },
});

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AuthProvider>
          <Toaster />
          <Sonner />
          <Routes>
            {/* Public routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/password-reset" element={<PasswordReset />} />
            <Route path="/unauthorized" element={<Unauthorized />} />
            
            {/* Protected routes - all users */}
            <Route path="/" element={
              <ProtectedRoute>
                <Index />
              </ProtectedRoute>
            } />
            
            {/* Dashboard redirect */}
            <Route path="/dashboard" element={<Navigate to="/" replace />} />
            
            {/* Super Admin Routes */}
            <Route path="/users" element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <Users />
              </ProtectedRoute>
            } />
            
            <Route path="/categories" element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <Categories />
              </ProtectedRoute>
            } />
            <Route path="/categories/:id" element={
              <ProtectedRoute allowedRoles={['super-admin']}>
                <CategoryDetails />
              </ProtectedRoute>
            } />
            
            {/* Super Admin and Region Admin Routes */}
            <Route path="/regions" element={
              <ProtectedRoute allowedRoles={['super-admin', 'region-admin']}>
                <Regions />
              </ProtectedRoute>
            } />
            <Route path="/regions/:id" element={
              <ProtectedRoute allowedRoles={['super-admin', 'region-admin']}>
                <RegionDetails />
              </ProtectedRoute>
            } />
            
            {/* Super Admin, Region Admin, and Sector Admin Routes */}
            <Route path="/sectors" element={
              <ProtectedRoute allowedRoles={['super-admin', 'region-admin', 'sector-admin']}>
                <Sectors />
              </ProtectedRoute>
            } />
            <Route path="/sectors/:id" element={
              <ProtectedRoute allowedRoles={['super-admin', 'region-admin', 'sector-admin']}>
                <SectorDetails />
              </ProtectedRoute>
            } />
            
            {/* All Admin Routes */}
            <Route path="/schools" element={
              <ProtectedRoute>
                <Schools />
              </ProtectedRoute>
            } />
            <Route path="/schools/:id" element={
              <ProtectedRoute>
                <SchoolDetails />
              </ProtectedRoute>
            } />
            <Route path="/reports" element={
              <ProtectedRoute>
                <Reports />
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Fallback routes */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
