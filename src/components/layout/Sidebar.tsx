import React from 'react';
import { useAuth, UserRole } from '@/contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Home, Users, Building, Briefcase, ListChecks, Settings, AlertTriangle } from 'lucide-react';

const Sidebar = () => {
  const { userRole } = useAuth();
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gray-50 border-r min-h-screen py-4">
      <div className="px-6 mb-8">
        <h1 className="text-2xl font-bold text-infoline-dark-blue">InfoLine</h1>
        <p className="text-infoline-dark-gray mt-1">Məlumat İdarəetmə Sistemi</p>
      </div>

      <nav>
        <ul>
          <li>
            <Link to="/" className={`flex items-center px-6 py-3 hover:bg-gray-100 rounded-md ${isActive('/') ? 'bg-gray-100 font-medium' : ''}`}>
              <Home className="mr-2 h-4 w-4" />
              Əsas Səhifə
            </Link>
          </li>

          {/* Super Admin Menu */}
          {userRole === 'super-admin' && (
            <>
              <li>
                <Link to="/users" className={`flex items-center px-6 py-3 hover:bg-gray-100 rounded-md ${isActive('/users') ? 'bg-gray-100 font-medium' : ''}`}>
                  <Users className="mr-2 h-4 w-4" />
                  İstifadəçilər
                </Link>
              </li>
              <li>
                <Link to="/categories" className={`flex items-center px-6 py-3 hover:bg-gray-100 rounded-md ${isActive('/categories') ? 'bg-gray-100 font-medium' : ''}`}>
                  <ListChecks className="mr-2 h-4 w-4" />
                  Kateqoriyalar
                </Link>
              </li>
            </>
          )}

          {/* Region Admin Menu */}
          {(userRole === 'super-admin' || userRole === 'region-admin') && (
            <li>
              <Link to="/regions" className={`flex items-center px-6 py-3 hover:bg-gray-100 rounded-md ${isActive('/regions') ? 'bg-gray-100 font-medium' : ''}`}>
                <Building className="mr-2 h-4 w-4" />
                Regionlar
              </Link>
            </li>
          )}

          {/* Sector Admin Menu */}
          {(userRole === 'super-admin' || userRole === 'region-admin' || userRole === 'sector-admin') && (
            <li>
              <Link to="/sectors" className={`flex items-center px-6 py-3 hover:bg-gray-100 rounded-md ${isActive('/sectors') ? 'bg-gray-100 font-medium' : ''}`}>
                <Briefcase className="mr-2 h-4 w-4" />
                Sektorlar
              </Link>
            </li>
          )}

          {/* All Admins Menu */}
          <li>
            <Link to="/schools" className={`flex items-center px-6 py-3 hover:bg-gray-100 rounded-md ${isActive('/schools') ? 'bg-gray-100 font-medium' : ''}`}>
              <Building className="mr-2 h-4 w-4" />
              Məktəblər
            </Link>
          </li>
          <li>
            <Link to="/reports" className={`flex items-center px-6 py-3 hover:bg-gray-100 rounded-md ${isActive('/reports') ? 'bg-gray-100 font-medium' : ''}`}>
              <AlertTriangle className="mr-2 h-4 w-4" />
              Hesabatlar
            </Link>
          </li>
          <li>
            <Link to="/settings" className={`flex items-center px-6 py-3 hover:bg-gray-100 rounded-md ${isActive('/settings') ? 'bg-gray-100 font-medium' : ''}`}>
              <Settings className="mr-2 h-4 w-4" />
              Parametrlər
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
