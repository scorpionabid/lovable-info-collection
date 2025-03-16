
import { useState } from 'react';
import { 
  Bell, 
  Menu, 
  Settings, 
  User, 
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { NotificationPanel } from './NotificationPanel';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useLogger } from '@/hooks/useLogger';

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(false);
  const navigate = useNavigate();
  const logger = useLogger('Header');

  const toggleNotifications = () => {
    setNotifications(!notifications);
    logger.info('Notifications panel toggled', { newState: !notifications });
  };

  // Add a logout handler
  const handleLogout = async () => {
    logger.info('User logging out', { email: user?.email });
    await logout();
    navigate('/login');
  };

  const handleProfileClick = () => {
    logger.info('Navigating to profile page');
    navigate('/settings?tab=profile');
  };

  const handleSettingsClick = () => {
    logger.info('Navigating to settings page');
    navigate('/settings');
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-white border-b border-infoline-light-gray z-30 h-16 w-full shadow-sm">
      <div className="flex items-center h-16 px-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar} className="lg:hidden">
          <Menu className="h-5 w-5 text-infoline-dark-gray" />
        </Button>
        
        <div className="hidden lg:block ml-4 text-xl font-semibold text-infoline-dark-blue">
          InfoLine
        </div>
        
        <div className="flex items-center ml-auto gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="relative"
            onClick={toggleNotifications}
          >
            <Bell className="h-5 w-5 text-infoline-dark-gray" />
            <span className="absolute -top-0.5 -right-0.5 bg-red-500 rounded-full w-4 h-4 flex items-center justify-center text-xs text-white">
              3
            </span>
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="ml-2">
                <User className="h-5 w-5 text-infoline-dark-gray" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>
                {user?.first_name} {user?.last_name}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleProfileClick}>
                <User className="mr-2 h-4 w-4" />
                <span>Mənim profilim</span>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleSettingsClick}>
                <Settings className="mr-2 h-4 w-4" />
                <span>Parametrlər</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Çıxış</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {notifications && (
            <NotificationPanel onClose={toggleNotifications} />
          )}
        </div>
      </div>
    </header>
  );
};
