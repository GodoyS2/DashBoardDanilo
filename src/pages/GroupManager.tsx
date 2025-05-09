import React, { useState } from 'react';
import { Plus, Trash, Edit, Search, UserPlus, Users } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import GroupForm from '../components/GroupForm';
import GroupMemberManager from '../components/GroupMemberManager';
import GroupProfile from '../components/GroupProfile';

const GroupManager: React.FC = () => {
  const { groups, addGroup, updateGroup, removeGroup } = useAppContext();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState<Group | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [showMemberManager, setShowMemberManager] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  const handleEditGroup = (group: Group) => {
    setEditingGroup(group);
    setIsAddModalOpen(true);
  };

  const handleViewProfile = (group: Group) => {
    setSelectedGroup(group);
    setShowProfile(true);
  };

  const handleCloseModal = () => {
    setIsAddModalOpen(false);
    setEditingGroup(null);
  };

  const handleCloseProfile = () => {
    setShowProfile(false);
    setSelectedGroup(null);
  };

  const handleManageMembers = (group: Group) => {
    setSelectedGroup(group);
    setShowMemberManager(true);
    setShowProfile(false);
  };

  const closeMemberManager = () => {
    setShowMemberManager(false);
    setSelectedGroup(null);
  };

  const handleSaveGroup = (group: Group) => {
    if (editingGroup) {
      updateGroup(group);
    } else {
      addGroup(group);
    }
    handleCloseModal();
  };

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    group.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Gerenciador de Grupos</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors duration-300"
        >
          <Plus size={20} className="mr-2" />
          Criar Grupo
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:border-emerald-500 focus:ring-emerald-500 sm:text-sm"
          placeholder="Buscar grupos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Groups list */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Nenhum grupo encontrado</p>
            <p className="text-gray-400 mt-2">Tente criar um novo grupo ou altere sua busca</p>
          </div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filteredGroups.map((group) => (
              <li key={group.id}>
                <div className="px-6 py-4 flex items-center justify-between hover:bg-gray-50">
                  <div 
                    className="flex items-center min-w-0 cursor-pointer"
                    onClick={() => handleViewProfile(group)}
                  >
                    <div className="flex-shrink-0">
                      {group.avatar ? (
                        <img
                          src={group.avatar}
                          alt={group.name}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-emerald-100 flex items-center justify-center">
                          <Users className="h-6 w-6 text-emerald-600" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4 flex-1 min-w-0">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 truncate">
                          {group.name}
                        </div>
                        <div className="ml-2 px-2 py-0.5 text-xs bg-emerald-100 text-emerald-800 rounded-full">
                          {group.members.length} membros
                        </div>
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {group.description || 'Sem descrição'}
                      </div>
                    </div>
                  </div>
                  <div className="ml-4 flex-shrink-0 flex">
                    <button
                      onClick={() => handleManageMembers(group)}
                      className="mr-2 p-2 text-gray-400 hover:text-emerald-600 rounded-full hover:bg-emerald-50"
                      title="Gerenciar membros"
                    >
                      <UserPlus size={18} />
                    </button>
                    <button
                      onClick={() => handleEditGroup(group)}
                      className="mr-2 p-2 text-gray-400 hover:text-blue-600 focus:outline-none focus:text-blue-600"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => removeGroup(group.id)}
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
        <GroupForm
          group={editingGroup}
          onClose={handleCloseModal}
          onSave={handleSaveGroup}
        />
      )}

      {/* Profile Modal */}
      {showProfile && selectedGroup && (
        <GroupProfile
          group={selectedGroup}
          onClose={handleCloseProfile}
          onManageMembers={() => handleManageMembers(selectedGroup)}
        />
      )}

      {/* Member Manager Modal */}
      {showMemberManager && selectedGroup && (
        <GroupMemberManager
          group={selectedGroup}
          onClose={closeMemberManager}
        />
      )}
    </div>
  );
};

export default GroupManager;