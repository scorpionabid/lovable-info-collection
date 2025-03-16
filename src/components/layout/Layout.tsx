
import { useState, ReactNode, useEffect } from 'react';
import { Header } from './Header';
import Sidebar from './Sidebar';
import { cn } from '@/lib/utils';
import { UserRole } from '@/contexts/AuthContext';
import { useLogger } from '@/hooks/useLogger';

interface LayoutProps {
  children: ReactNode;
  userRole?: UserRole;
}

export const Layout = ({ 
  children,
  userRole
}: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const logger = useLogger('Layout');
  
  useEffect(() => {
    logger.info('Layout mounted with role', { userRole });
    
    // Handle responsive sidebar on window resize
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setIsSidebarOpen(false);
      } else {
        setIsSidebarOpen(true);
      }
    };
    
    // Set initial state based on window size
    handleResize();
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [userRole]);
  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    logger.info('Sidebar toggled', { newState: !isSidebarOpen });
  };

  return (
    <div className="min-h-screen bg-infoline-lightest-gray flex flex-col">
      <Header onToggleSidebar={toggleSidebar} />
      
      <div className="flex flex-1 pt-16"> {/* Add pt-16 to account for fixed header */}
        <div className={cn(
          "fixed left-0 top-16 h-[calc(100vh-4rem)] z-10 transition-all duration-300",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}>
          <Sidebar userRole={userRole} />
        </div>
        
        <div className={cn(
          "flex-grow transition-all duration-300 overflow-x-hidden",
          isSidebarOpen ? "lg:ml-64" : "lg:ml-0"
        )}>
          <main className="p-4 md:p-6 animate-fade-in">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
