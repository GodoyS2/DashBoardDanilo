import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Users, UserPlus, Map, Home, X } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  return (
    <div
      id="sidebar"
      className={`fixed inset-y-0 left-0 z-40 w-64 bg-gradient-to-b from-blue-600 to-indigo-800 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="h-full flex flex-col overflow-y-auto">
        <div className="flex items-center justify-between px-4 py-6">
          <NavLink to="/" className="flex items-center text-white" onClick={() => setSidebarOpen(false)}>
            <Home className="w-8 h-8 mr-3" />
            <span className="text-xl font-bold">DashManager</span>
          </NavLink>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-200 p-2"
            aria-label="Fechar menu"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="px-4 py-6 flex-1">
          <h3 className="text-xs uppercase text-indigo-300 font-semibold mb-4">
            Gerenciamento
          </h3>
          <nav className="space-y-1">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition duration-150 ${
                  isActive
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-900'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Home className="flex-shrink-0 h-6 w-6 mr-3" />
              <span className="text-sm font-medium">Dashboard</span>
            </NavLink>
            <NavLink
              to="/people"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition duration-150 ${
                  isActive
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-900'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <UserPlus className="flex-shrink-0 h-6 w-6 mr-3" />
              <span className="text-sm font-medium">Gerenciar Pessoas</span>
            </NavLink>
            <NavLink
              to="/groups"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition duration-150 ${
                  isActive
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-900'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Users className="flex-shrink-0 h-6 w-6 mr-3" />
              <span className="text-sm font-medium">Gerenciar Grupos</span>
            </NavLink>
            <NavLink
              to="/locations"
              className={({ isActive }) =>
                `flex items-center px-4 py-3 rounded-lg transition duration-150 ${
                  isActive
                    ? 'bg-indigo-900 text-white'
                    : 'text-indigo-200 hover:text-white hover:bg-indigo-900'
                }`
              }
              onClick={() => setSidebarOpen(false)}
            >
              <Map className="flex-shrink-0 h-6 w-6 mr-3" />
              <span className="text-sm font-medium">Gerenciar Locais</span>
            </NavLink>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;