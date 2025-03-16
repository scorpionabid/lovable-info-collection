
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

  return (
    <div className="min-h-screen bg-infoline-lightest-gray flex">
      <div className={cn(
        "fixed left-0 top-0 h-full z-10 transition-all duration-300",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
      )}>
        <Sidebar userRole={userRole} />
      </div>
      
      <div className={cn(
        "flex flex-col flex-grow transition-all duration-300",
        isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
      )}>
        <Header onToggleSidebar={toggleSidebar} />
        
        <main className="p-4 md:p-6 animate-fade-in flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
};
