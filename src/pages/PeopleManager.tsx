import React, { useState } from 'react';
import { Plus, Trash, Edit, Search, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import PersonForm from '../components/PersonForm';
import PersonProfile from '../components/PersonProfile';

const PeopleManager: React.FC = () => {
  const { people, addPerson, updatePerson, removePerson, searchTerm } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);

  const handleEditPerson = (person: Person) => {
    setEditingPerson(person);
    setIsAddModalOpen(true);
  };

  const handleViewProfile = (person: Person) => {
    setSelectedPerson(person);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingPerson(null);
  };

  const handleCloseProfile = () => {
    setSelectedPerson(null);
  };

  const handleSavePerson = (person: Person) => {
    if (editingPerson) {
      updatePerson(person);
    } else {
      addPerson(person);
    }
    handleCloseModal();
  };

  const filteredPeople = people.filter(
    person => 
      person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      person.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciar Pessoas</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-300"
        >
          <Plus size={20} className="mr-2" />
          Adicionar Pessoa
        </button>
      </div>

      {/* People list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredPeople.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhuma pessoa encontrada</p>
            <p className="text-gray-400 mt-2">Tente adicionar uma nova pessoa ou altere sua busca</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredPeople.map((person) => (
              <li key={person.id}>
                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div 
                    className="flex items-center min-w-0 cursor-pointer"
                    onClick={() => handleViewProfile(person)}
                  >
                    <div className="flex-shrink-0">
                      {person.avatar ? (
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                          <span className="text-blue-600 font-medium text-lg">
                            {person.name.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {person.name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">{person.email}</div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => handleViewProfile(person)}
                      className="mr-2 p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                    >
                      <User size={18} />
                    </button>
                    <button
                      onClick={() => handleEditPerson(person)}
                      className="mr-2 p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => removePerson(person.id)}
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
        <PersonForm
          person={editingPerson}
          onClose={handleCloseModal}
          onSave={handleSavePerson}
        />
      )}

      {/* Profile Modal */}
      {selectedPerson && (
        <PersonProfile
          person={selectedPerson}
          onClose={handleCloseProfile}
        />
      )}
    </div>
  );
};

export default PeopleManager;