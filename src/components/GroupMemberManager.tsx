import React, { useState } from 'react';
import { X, UserMinus, UserPlus, Search, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface GroupMemberManagerProps {
  group: Group;
  onClose: () => void;
}

const GroupMemberManager: React.FC<GroupMemberManagerProps> = ({ group, onClose }) => {
  const { people, updateGroup } = useAppContext();
  const [searchTermAdd, setSearchTermAdd] = useState('');
  const [searchTermRemove, setSearchTermRemove] = useState('');
  const [selectedToAdd, setSelectedToAdd] = useState<string[]>([]);
  const [selectedToRemove, setSelectedToRemove] = useState<string[]>([]);

  const groupMembers = people.filter(person => 
    group.members.includes(person.id) && 
    person.name.toLowerCase().includes(searchTermRemove.toLowerCase())
  );
  
  const availablePeople = people.filter(person => 
    !group.members.includes(person.id) && 
    person.name.toLowerCase().includes(searchTermAdd.toLowerCase())
  );

  const handleAddMembers = () => {
    const updatedGroup = {
      ...group,
      members: [...group.members, ...selectedToAdd]
    };
    updateGroup(updatedGroup);
    setSelectedToAdd([]);
  };

  const handleRemoveMembers = () => {
    const updatedGroup = {
      ...group,
      members: group.members.filter(id => !selectedToRemove.includes(id))
    };
    updateGroup(updatedGroup);
    setSelectedToRemove([]);
  };

  const togglePersonToAdd = (personId: string) => {
    setSelectedToAdd(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const togglePersonToRemove = (personId: string) => {
    setSelectedToRemove(prev => 
      prev.includes(personId) 
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Gerenciar Membros: {group.name}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                {/* Current members */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-700">Membros Atuais ({groupMembers.length})</h4>
                    {selectedToRemove.length > 0 && (
                      <button
                        onClick={handleRemoveMembers}
                        className="px-3 py-1 text-sm text-red-600 hover:text-red-700 font-medium bg-red-50 hover:bg-red-100 rounded-full transition-colors"
                      >
                        Remover Selecionados ({selectedToRemove.length})
                      </button>
                    )}
                  </div>

                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-red-500 focus:ring-red-500 sm:text-sm"
                      placeholder="Buscar membros atuais..."
                      value={searchTermRemove}
                      onChange={(e) => setSearchTermRemove(e.target.value)}
                    />
                  </div>
                  
                  {groupMembers.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Nenhum membro neste grupo ainda</p>
                  ) : (
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden">
                      {groupMembers.map(person => (
                        <li 
                          key={person.id} 
                          className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            selectedToRemove.includes(person.id) ? 'bg-red-50' : ''
                          }`}
                          onClick={() => togglePersonToRemove(person.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedToRemove.includes(person.id)}
                              onChange={() => togglePersonToRemove(person.id)}
                              className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                            />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{person.name}</p>
                              <p className="text-xs text-gray-500">{person.email}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
                
                {/* Add members */}
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="font-medium text-gray-700">Adicionar Membros</h4>
                    {selectedToAdd.length > 0 && (
                      <button
                        onClick={handleAddMembers}
                        className="px-3 py-1 text-sm text-emerald-600 hover:text-emerald-700 font-medium bg-emerald-50 hover:bg-emerald-100 rounded-full transition-colors"
                      >
                        Adicionar Selecionados ({selectedToAdd.length})
                      </button>
                    )}
                  </div>
                  
                  <div className="relative mb-3">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Search className="h-4 w-4 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
                      placeholder="Buscar pessoas para adicionar..."
                      value={searchTermAdd}
                      onChange={(e) => setSearchTermAdd(e.target.value)}
                    />
                  </div>
                  
                  {availablePeople.length === 0 ? (
                    <p className="text-gray-500 text-sm italic">Nenhuma pessoa disponível para adicionar</p>
                  ) : (
                    <ul className="divide-y divide-gray-200 border border-gray-200 rounded-md overflow-hidden max-h-60 overflow-y-auto">
                      {availablePeople.map(person => (
                        <li 
                          key={person.id}
                          className={`flex items-center justify-between px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                            selectedToAdd.includes(person.id) ? 'bg-emerald-50' : ''
                          }`}
                          onClick={() => togglePersonToAdd(person.id)}
                        >
                          <div className="flex items-center">
                            <input
                              type="checkbox"
                              checked={selectedToAdd.includes(person.id)}
                              onChange={() => togglePersonToAdd(person.id)}
                              className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-gray-300 rounded"
                            />
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900">{person.name}</p>
                              <p className="text-xs text-gray-500">{person.email}</p>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={onClose}
              className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 sm:mt-0 sm:w-auto sm:text-sm"
            >
              Concluído
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GroupMemberManager;