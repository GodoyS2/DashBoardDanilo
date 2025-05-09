import React, { useState } from 'react';
import { Plus, Trash, Edit, Search, MapPin, CheckCircle, XCircle, User, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import LocationForm from '../components/LocationForm';
import LocationProfile from '../components/LocationProfile';

const LocationManager: React.FC = () => {
  const { locations, addLocation, updateLocation, removeLocation } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showProfile, setShowProfile] = useState(false);

  const handleEditLocation = (location: Location) => {
    setEditingLocation(location);
    setIsAddModalOpen(true);
    setShowProfile(false);
  };

  const handleViewProfile = (location: Location) => {
    setSelectedLocation(location);
    setShowProfile(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingLocation(null);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setSelectedLocation(null);
  };

  const handleSaveLocation = (location: Location) => {
    if (editingLocation) {
      updateLocation(location);
    } else {
      addLocation(location);
    }
    handleCloseModal();
  };

  const handleToggleVisited = (location: Location) => {
    updateLocation({
      ...location,
      visited: !location.visited
    });
  };

  const filteredLocations = locations.filter(location => 
    location.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    location.address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciador de Locais</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors duration-300"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Local
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500 sm:text-sm"
          placeholder="Buscar locais..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Locations list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredLocations.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum local encontrado</p>
            <p className="text-gray-400 mt-2">Tente adicionar um novo local ou altere sua busca</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredLocations.map((location) => (
              <li key={location.id}>
                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div 
                    className="flex items-center min-w-0 cursor-pointer"
                    onClick={() => handleViewProfile(location)}
                  >
                    <div className="flex-shrink-0">
                      <div className={`h-10 w-10 rounded-full ${location.visited ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center`}>
                        <MapPin className={`h-6 w-6 ${location.visited ? 'text-green-600' : 'text-red-600'}`} />
                      </div>
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {location.name}
                        </div>
                        <div className={`ml-2 px-2 py-0.5 text-xs ${
                          location.visited 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        } rounded-full flex items-center`}>
                          {location.visited ? (
                            <>
                              <CheckCircle size={12} className="mr-1" />
                              Visitado
                            </>
                          ) : (
                            <>
                              <XCircle size={12} className="mr-1" />
                              Não Visitado
                            </>
                          )}
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {location.address}
                      </div>
                      <div className="flex items-center mt-1 space-x-2">
                        {(location.assignedGroups ?? []).length > 0 && (
                          <div className="flex items-center text-xs text-gray-500">
                            <Users size={12} className="mr-1" />
                            {(location.assignedGroups ?? []).length} grupos
                          </div>
                        )}
                        {(location.assignedPeople ?? []).length > 0 && (
                          <div className="flex items-center text-xs text-gray-500">
                            <User size={12} className="mr-1" />
                            {(location.assignedPeople ?? []).length} pessoas
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => handleToggleVisited(location)}
                      className={`mr-2 p-2 rounded-full ${
                        location.visited 
                          ? 'text-green-500 hover:bg-green-50' 
                          : 'text-red-500 hover:bg-red-50'
                      }`}
                      title={location.visited ? 'Marcar como não visitado' : 'Marcar como visitado'}
                    >
                      {location.visited ? <CheckCircle size={18} /> : <XCircle size={18} />}
                    </button>
                    <button
                      onClick={() => handleEditLocation(location)}
                      className="mr-2 p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => removeLocation(location.id)}
                      className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:text-red-600"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Add/Edit Modal */}
      {isAddModalOpen && (
        <LocationForm
          location={editingLocation}
          onClose={handleCloseModal}
          onSave={handleSaveLocation}
        />
      )}

      {/* Profile Modal */}
      {showProfile && selectedLocation && (
        <LocationProfile
          location={selectedLocation}
          onClose={handleCloseProfile}
          onEdit={() => handleEditLocation(selectedLocation)}
        />
      )}
    </div>
  );
};

export default LocationManager;