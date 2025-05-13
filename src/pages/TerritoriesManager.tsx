import React, { useState } from 'react';
import { Plus, Trash, Edit, Search, Globe } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const TerritoriesManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Territórios</h1>
        <button
          onClick={() => {}}
          className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors duration-300"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Território
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
          placeholder="Buscar territórios..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Territories list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <div className="text-center py-12">
          <Globe className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-gray-500 text-lg">Nenhum território cadastrado</p>
          <p className="text-gray-400 mt-1">Comece adicionando um novo território</p>
        </div>
      </div>
    </div>
  );
};

export default TerritoriesManager;