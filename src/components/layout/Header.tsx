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

interface HeaderProps {
  onToggleSidebar: () => void;
}

export const Header = ({ onToggleSidebar }: HeaderProps) => {
  const { user, logout } = useAuth();
  const [notifications, setNotifications] = useState(false);

  const toggleNotifications = () => {
    setNotifications(!notifications);
  };

  // Add a logout handler
  const handleLogout = () => {
    logout();
  };

  return (
    <header className="sticky top-0 bg-white border-b border-infoline-light-gray z-20">
      <div className="flex items-center h-16 px-4">
        <Button variant="ghost" size="icon" onClick={onToggleSidebar}>
          <Menu className="h-5 w-5 text-infoline-dark-gray" />
        </Button>
        
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
              <Button variant="ghost" size="icon">
                <Settings className="h-5 w-5 text-infoline-dark-gray" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Profil Ayarları</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                <span>Mənim profilim</span>
              </DropdownMenuItem>
              <DropdownMenuItem>
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
