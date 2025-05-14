import React, { useState } from 'react';
import { Plus, Trash, Edit, Search, Globe, Image as ImageIcon, Eye, Images } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TerritoryForm from '../components/TerritoryForm';
import TerritoryPreview from '../components/TerritoryPreview';

const TerritoriesManager: React.FC = () => {
  const { territories, addTerritory, updateTerritory, removeTerritory } = useAppContext();
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingTerritory, setEditingTerritory] = useState<Territory | null>(null);
  const [selectedTerritory, setSelectedTerritory] = useState<Territory | null>(null);

  const handleEditTerritory = (territory: Territory) => {
    setEditingTerritory(territory);
    setIsAddModalOpen(true);
    setSelectedTerritory(null);
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

  const handlePreviewTerritory = (territory: Territory) => {
    setSelectedTerritory(territory);
  };

  const handleClosePreview = () => {
    setSelectedTerritory(null);
  };

  const handleViewImages = (territory: Territory, e: React.MouseEvent) => {
    e.stopPropagation();
    // Here you would implement the logic to show related images
    console.log('View images for territory:', territory.name);
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
              <div className="relative">
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
                {/* Preview overlay */}
                <div 
                  className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-30 transition-opacity flex items-center justify-center opacity-0 hover:opacity-100 cursor-pointer"
                  onClick={() => handlePreviewTerritory(territory)}
                >
                  <button className="bg-white text-gray-800 px-4 py-2 rounded-full flex items-center transform scale-95 hover:scale-100 transition-transform">
                    <Eye size={18} className="mr-2" />
                    Visualizar
                  </button>
                </div>
              </div>
              <div className="p-4">
                <h3 className="text-lg font-medium text-gray-900 mb-1">{territory.name}</h3>
                {territory.description && (
                  <p className="text-sm text-gray-500 line-clamp-2 mb-3">{territory.description}</p>
                )}
                <div className="flex justify-end space-x-2">
                  <button
                    onClick={(e) => handleViewImages(territory, e)}
                    className="p-2 text-gray-400 hover:text-indigo-600 focus:outline-none focus:text-indigo-600 transition-colors"
                    title="Ver imagens relacionadas"
                  >
                    <Images size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTerritory(territory);
                    }}
                    className="p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600 transition-colors"
                  >
                    <Edit size={18} />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeTerritory(territory.id);
                    }}
                    className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:text-red-600 transition-colors"
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

      {/* Preview Modal */}
      {selectedTerritory && (
        <TerritoryPreview
          territory={selectedTerritory}
          onClose={handleClosePreview}
          onEdit={() => handleEditTerritory(selectedTerritory)}
        />
      )}
    </div>
  );
};

export default TerritoriesManager;