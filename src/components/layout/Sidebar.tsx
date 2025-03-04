import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  BarChart3, 
  Users, 
  FileText, 
  Home, 
  Settings, 
  ChevronLeft, 
  ChevronRight, 
  School,
  Map,
  Layers
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/contexts/AuthContext';

type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
  hasSubMenu?: boolean;
};

const SidebarLink = ({ 
  to, 
  icon, 
  label, 
  isActive, 
  isCollapsed,
  hasSubMenu = false 
}: SidebarLinkProps) => {
  return (
    <Link
      to={to}
      className={cn(
        "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 group",
        isActive 
          ? "bg-infoline-blue text-white" 
          : "text-infoline-dark-gray hover:bg-infoline-light-gray",
        isCollapsed && "justify-center"
      )}
    >
      <div className="flex items-center justify-center w-5 h-5">
        {icon}
      </div>
      {!isCollapsed && (
        <>
          <span className="truncate">{label}</span>
          {hasSubMenu && (
            <ChevronRight className="ml-auto h-4 w-4 shrink-0 transition-transform duration-200" />
          )}
        </>
      )}
    </Link>
  );
};

interface SidebarProps {
  userRole?: UserRole;
}

export const Sidebar = ({ userRole = 'super-admin' }: SidebarProps) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const location = useLocation();
  
  const isLinkActive = (path: string) => location.pathname === path || location.pathname.startsWith(`${path}/`);

  const commonLinks = [
    { to: '/', icon: <Home size={18} />, label: 'Dashboard' },
  ];

  const effectiveRole = userRole === 'superadmin' ? 'super-admin' : userRole;

  const roleBasedLinks = {
    'super-admin': [
      { to: '/users', icon: <Users size={18} />, label: 'İstifadəçilər' },
      { to: '/regions', icon: <Map size={18} />, label: 'Regionlar' },
      { to: '/sectors', icon: <Layers size={18} />, label: 'Sektorlar' },
      { to: '/schools', icon: <School size={18} />, label: 'Məktəblər' },
      { to: '/categories', icon: <FileText size={18} />, label: 'Kateqoriyalar' },
      { to: '/reports', icon: <BarChart3 size={18} />, label: 'Hesabatlar' },
      { to: '/settings', icon: <Settings size={18} />, label: 'Parametrlər' },
    ],
    'region-admin': [
      { to: '/sectors', icon: <Layers size={18} />, label: 'Sektorlar' },
      { to: '/schools', icon: <School size={18} />, label: 'Məktəblər' },
      { to: '/reports', icon: <BarChart3 size={18} />, label: 'Hesabatlar' },
    ],
    'sector-admin': [
      { to: '/schools', icon: <School size={18} />, label: 'Məktəblər' },
      { to: '/reports', icon: <BarChart3 size={18} />, label: 'Hesabatlar' },
    ],
    'school-admin': [
      { to: '/forms', icon: <FileText size={18} />, label: 'Formlar' },
      { to: '/reports', icon: <BarChart3 size={18} />, label: 'Hesabatlar' },
    ],
  };

  const links = [...commonLinks, ...(roleBasedLinks[effectiveRole as keyof typeof roleBasedLinks] || roleBasedLinks['school-admin'])];

  return (
    <aside 
      className={cn(
        "h-screen fixed top-0 left-0 z-30 flex flex-col border-r border-infoline-light-gray bg-white transition-all duration-300",
        isCollapsed ? "w-16" : "w-64"
      )}
    >
      <div className={cn(
        "flex items-center h-16 border-b border-infoline-light-gray px-4",
        isCollapsed ? "justify-center" : "justify-between"
      )}>
        {!isCollapsed && (
          <div className="flex items-center space-x-2">
            <School className="h-6 w-6 text-infoline-blue" />
            <span className="font-semibold text-infoline-dark-blue">İnfoLine</span>
          </div>
        )}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="rounded-md p-1.5 hover:bg-infoline-light-gray text-infoline-dark-gray"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </button>
      </div>

      <div className="flex-1 space-y-1 overflow-auto p-3">
        {links.map((link) => (
          <SidebarLink
            key={link.to}
            to={link.to}
            icon={link.icon}
            label={link.label}
            isActive={isLinkActive(link.to)}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>
    </aside>
  );
};
