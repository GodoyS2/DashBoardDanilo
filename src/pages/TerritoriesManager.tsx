import React, { useState } from 'react';
import { Plus, Trash, Edit, Search, Globe, Image as ImageIcon } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TerritoryForm from '../components/TerritoryForm';

const TerritoriesManager: React.FC = () => {
  const { territories, addTerritory, updateTerritory, removeTerritory } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState<Territory | null>(null);

  const handleEditTerritory = (territory: Territory) => {
    setEditingTerritory(territory);
    setIsAddModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingTerritory(null);
  };

  const handleSaveTerritory = async (territory: Territory) => {
    if (editingTerritory) {
      await updateTerritory(territory);
    } else {
      await addTerritory(territory);
    }
    handleCloseModal();
  };

  const filteredTerritories = territories.filter(territory => 
    territory.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    territory.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Territórios</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
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

      {/* Territories grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredTerritories.length === 0 ? (
          <div className="col-span-full bg-white shadow rounded-lg p-6 text-center">
            <Globe className="mx-auto h-12 w-12 text-gray-400" />
            <p className="mt-2 text-gray-500 text-lg">Nenhum território cadastrado</p>
            <p className="text-gray-400 mt-1">Comece adicionando um novo território</p>
          </div>
        ) : (
          filteredTerritories.map((territory) => (
            <div
              key={territory.id}
              className="bg-white shadow rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200">
                {territory.image_url ? (
                  <img
                    src={territory.image_url}
                    alt={territory.name}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 flex items-center justify-center bg-gray-100">
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900">{territory.name}</h3>
                {territory.description && (
                  <p className="mt-1 text-sm text-gray-500 line-clamp-2">{territory.description}</p>
                )}
                <div className="mt-4 flex justify-end space-x-2">
                  <button
                    onClick={() => handleEditTerritory(territory)}
                    className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={() => removeTerritory(territory.id)}
                    className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:text-red-600"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <TerritoryForm
          territory={editingTerritory}
          onClose={handleCloseModal}
          onSave={handleSaveTerritory}
        />
      )}
    </div>
  );
};

export default TerritoriesManager;