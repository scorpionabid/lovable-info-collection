
import { useState, ReactNode } from 'react';
import { Header } from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { UserRole } from '@/contexts/AuthContext';
import { LoadingState } from '../users/modals/LoadingState';

interface LayoutProps {
  children: ReactNode;
  userRole?: UserRole;
}

export const Layout = ({ 
  children,
  userRole
}: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  // If userRol

  return (
    <div className="min-h-screen bg-infoline-lightest-gray">
      <Sidebar userRole={userRole} />
      
      <div className={cn(
        "transition-all duration-300 min-h-screen",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-16"
      )}>
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="p-4 md:p-6 animate-fade-in">
          {children}
        </main>
      </div>
    </div>
  );
};
