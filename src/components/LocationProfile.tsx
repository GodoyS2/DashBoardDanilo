import React from 'react';
import { X, MapPin, Users, User, CheckCircle, XCircle } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface LocationProfileProps {
  location: Location;
  onClose: () => void;
  onEdit: () => void;
}

const LocationProfile: React.FC<LocationProfileProps> = ({ location, onClose, onEdit }) => {
  const { people, groups } = useAppContext();
  
  const assignedGroups = groups.filter(group => 
    (location.assignedGroups ?? []).includes(group.id)
  );

  const assignedPeople = people.filter(person => 
    (location.assignedPeople ?? []).includes(person.id)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Detalhes do Local
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <div className="flex flex-col items-center mb-6">
                  <div className={`w-16 h-16 rounded-full ${location.visited ? 'bg-green-100' : 'bg-red-100'} flex items-center justify-center mb-4`}>
                    <MapPin size={32} className={location.visited ? 'text-green-600' : 'text-red-600'} />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900">{location.name}</h2>
                  <div className={`mt-2 px-3 py-1 rounded-full text-sm flex items-center ${
                    location.visited ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {location.visited ? (
                      <>
                        <CheckCircle size={16} className="mr-1" />
                        Visitado
                      </>
                    ) : (
                      <>
                        <XCircle size={16} className="mr-1" />
                        Não Visitado
                      </>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="border-t border-b border-gray-200 py-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Endereço</h4>
                    <p className="text-gray-900">{location.address}</p>
                  </div>

                  <div className="border-b border-gray-200 py-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Grupos Designados ({assignedGroups.length})</h4>
                    {assignedGroups.length === 0 ? (
                      <p className="text-gray-500 text-sm italic">Nenhum grupo designado</p>
                    ) : (
                      <div className="space-y-2">
                        {assignedGroups.map(group => (
                          <div key={group.id} className="flex items-center">
                            <Users size={20} className="text-gray-400 mr-2" />
                            <span className="text-gray-900">{group.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="border-b border-gray-200 py-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-3">Pessoas Designadas ({assignedPeople.length})</h4>
                    {assignedPeople.length === 0 ? (
                      <p className="text-gray-500 text-sm italic">Nenhuma pessoa designada</p>
                    ) : (
                      <div className="space-y-2">
                        {assignedPeople.map(person => (
                          <div key={person.id} className="flex items-center">
                            {person.avatar ? (
                              <img
                                src={person.avatar}
                                alt={person.name}
                                className="h-6 w-6 rounded-full mr-2"
                              />
                            ) : (
                              <User size={20} className="text-gray-400 mr-2" />
                            )}
                            <span className="text-gray-900">{person.name}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <span>Última atualização: {new Date(location.updatedAt).toLocaleDateString()}</span>
                    <button
                      onClick={onEdit}
                      className="text-purple-600 hover:text-purple-700 font-medium"
                    >
                      Editar Local
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Fechar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationProfile;