import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { Users, UserPlus, Map, Home, X } from 'lucide-react';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const location = useLocation();
  const { pathname } = location;

  const trigger = useRef<HTMLButtonElement>(null);
  const sidebar = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const clickHandler = ({ target }: MouseEvent) => {
      if (!sidebar.current || !trigger.current) return;
      if (
        !sidebarOpen ||
        sidebar.current.contains(target as Node) ||
        trigger.current.contains(target as Node)
      )
        return;
      setSidebarOpen(false);
    };
    document.addEventListener('click', clickHandler);
    return () => document.removeEventListener('click', clickHandler);
  });

  useEffect(() => {
    const keyHandler = ({ keyCode }: KeyboardEvent) => {
      if (!sidebarOpen || keyCode !== 27) return;
      setSidebarOpen(false);
    };
    document.addEventListener('keydown', keyHandler);
    return () => document.removeEventListener('keydown', keyHandler);
  });

  return (
    <>
      <div
        className={`fixed inset-0 bg-gray-900 bg-opacity-30 z-40 lg:hidden lg:z-auto transition-opacity duration-200 ${
          sidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        aria-hidden="true"
      ></div>

      <div
        id="sidebar"
        ref={sidebar}
        className={`absolute z-40 left-0 top-0 lg:static lg:left-auto lg:top-auto lg:translate-x-0 transform h-screen overflow-y-scroll lg:overflow-y-auto no-scrollbar w-64 flex-shrink-0 bg-gradient-to-b from-blue-600 to-indigo-800 p-4 transition-all duration-200 ease-in-out ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-64'
        }`}
      >
        <div className="flex justify-between items-center mb-10 pr-3 sm:px-2">
          <NavLink to="/" className="flex items-center text-white">
            <Home className="w-8 h-8 mr-3" />
            <span className="text-xl font-bold">DashManager</span>
          </NavLink>
          <button
            ref={trigger}
            className="lg:hidden text-white hover:text-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            aria-controls="sidebar"
            aria-expanded={sidebarOpen}
          >
            <span className="sr-only">Fechar menu lateral</span>
            <X className="w-6 h-6" />
          </button>
        </div>

        <div>
          <h3 className="text-xs uppercase text-indigo-300 font-semibold mb-2">
            Gerenciamento
          </h3>
          <ul className="mt-3">
            <li className="mb-1">
              <NavLink
                to="/"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition duration-150 ${
                    isActive
                      ? 'bg-indigo-900 text-white'
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-900'
                  }`
                }
              >
                <Home className="flex-shrink-0 h-5 w-5 mr-3" />
                <span className="text-sm font-medium">Dashboard</span>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink
                to="/people"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition duration-150 ${
                    isActive
                      ? 'bg-indigo-900 text-white'
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-900'
                  }`
                }
              >
                <UserPlus className="flex-shrink-0 h-5 w-5 mr-3" />
                <span className="text-sm font-medium">Gerenciar Pessoas</span>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink
                to="/groups"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition duration-150 ${
                    isActive
                      ? 'bg-indigo-900 text-white'
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-900'
                  }`
                }
              >
                <Users className="flex-shrink-0 h-5 w-5 mr-3" />
                <span className="text-sm font-medium">Gerenciar Grupos</span>
              </NavLink>
            </li>
            <li className="mb-1">
              <NavLink
                to="/locations"
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 rounded-lg transition duration-150 ${
                    isActive
                      ? 'bg-indigo-900 text-white'
                      : 'text-indigo-200 hover:text-white hover:bg-indigo-900'
                  }`
                }
              >
                <Map className="flex-shrink-0 h-5 w-5 mr-3" />
                <span className="text-sm font-medium">Gerenciar Locais</span>
              </NavLink>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Sidebar;