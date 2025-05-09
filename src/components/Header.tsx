import React, { useState } from 'react';
import { Menu, Bell, Search, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface HeaderProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
}

const Header: React.FC<HeaderProps> = ({ sidebarOpen, setSidebarOpen }) => {
  const { searchTerm, setSearchTerm } = useAppContext();

  return (
    <header className="sticky top-0 bg-white border-b border-gray-200 z-30">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 -mb-px">
          {/* Left: Hamburger button */}
          <div className="flex lg:hidden">
            <button
              className="text-gray-500 hover:text-gray-600"
              aria-controls="sidebar"
              aria-expanded={sidebarOpen}
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <span className="sr-only">Abrir menu lateral</span>
              <Menu className="w-6 h-6" />
            </button>
          </div>

          {/* Middle: Search */}
          <div className="flex-1 flex justify-center lg:justify-end">
            <div className="max-w-xs w-full lg:max-w-md relative">
              <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </span>
              <input
                className="block w-full bg-gray-100 border border-transparent rounded-md py-2 pl-10 pr-3 text-sm placeholder-gray-500 focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-blue-500 focus:placeholder-gray-400 sm:text-sm"
                type="search"
                placeholder="Pesquisar..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center space-x-3">
            <button
              className="p-2 text-gray-500 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              aria-label="Notificações"
            >
              <Bell className="w-6 h-6" />
            </button>
            <button
              className="p-2 text-gray-500 rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:bg-gray-100"
              aria-label="Perfil do usuário"
            >
              <User className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;