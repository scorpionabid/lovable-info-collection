
import { useState } from 'react';
import { Bell, Globe, ChevronDown, Search, Menu } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { NotificationPanel } from '../ui/NotificationPanel';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';

interface HeaderProps {
  onToggleSidebar: () => void;
  userName?: string;
  userRole?: string;
}

export const Header = ({ 
  onToggleSidebar,
  userName = 'Admin İstifadəçi', 
  userRole = 'Super Admin' 
}: HeaderProps) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);
  
  const toggleNotifications = () => {
    setShowNotifications(!showNotifications);
    if (showLanguages) setShowLanguages(false);
  };
  
  const toggleLanguages = () => {
    setShowLanguages(!showLanguages);
    if (showNotifications) setShowNotifications(false);
  };

  return (
    <header className="h-16 border-b border-infoline-light-gray bg-white sticky top-0 z-20 w-full">
      <div className="flex items-center justify-between h-full px-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="block lg:hidden p-2 rounded-md hover:bg-infoline-light-gray text-infoline-dark-gray"
          >
            <Menu size={20} />
          </button>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-infoline-dark-gray h-4 w-4" />
            <input
              type="text"
              placeholder="Axtar..."
              className="pl-10 pr-4 py-2 w-[200px] lg:w-[300px] rounded-md border border-infoline-light-gray focus:outline-none focus:ring-2 focus:ring-infoline-light-blue"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Popover open={showNotifications} onOpenChange={setShowNotifications}>
            <PopoverTrigger asChild>
              <button
                onClick={toggleNotifications}
                className="relative p-2 rounded-full hover:bg-infoline-light-gray text-infoline-dark-gray transition-colors"
              >
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[350px] p-0">
              <NotificationPanel />
            </PopoverContent>
          </Popover>
          
          <Popover open={showLanguages} onOpenChange={setShowLanguages}>
            <PopoverTrigger asChild>
              <button
                onClick={toggleLanguages}
                className="flex items-center gap-1 p-2 rounded-md hover:bg-infoline-light-gray text-infoline-dark-gray transition-colors"
              >
                <Globe size={18} />
                <span className="text-sm font-medium">AZ</span>
                <ChevronDown size={16} />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[200px] p-0">
              <LanguageSwitcher />
            </PopoverContent>
          </Popover>
          
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-3 p-1 rounded-md hover:bg-infoline-light-gray transition-colors">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="" />
                  <AvatarFallback className="bg-infoline-blue text-white text-sm">
                    {userName.split(' ').map(part => part[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="hidden md:block text-left">
                  <p className="text-sm font-medium text-infoline-dark-blue">{userName}</p>
                  <p className="text-xs text-infoline-dark-gray">{userRole}</p>
                </div>
                <ChevronDown size={16} className="text-infoline-dark-gray" />
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[220px] p-0">
              <div className="py-2">
                <div className="px-4 py-3 border-b border-infoline-light-gray">
                  <p className="text-sm font-medium text-infoline-dark-blue">{userName}</p>
                  <p className="text-xs text-infoline-dark-gray">{userRole}</p>
                </div>
                <div className="py-1">
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-infoline-light-gray transition-colors">
                    Profil
                  </button>
                  <button className="w-full text-left px-4 py-2 text-sm hover:bg-infoline-light-gray transition-colors">
                    Parametrlər
                  </button>
                  <div className="border-t border-infoline-light-gray my-1"></div>
                  <button className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-infoline-light-gray transition-colors">
                    Çıxış
                  </button>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </header>
  );
};
