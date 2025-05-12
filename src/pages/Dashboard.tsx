import React from 'react';
import { Users, MapPin, UserPlus, UserCheck } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import StatCard from '../components/StatCard';

const Dashboard: React.FC = () => {
  const { people, groups, locations } = useAppContext();
  
  const visitedLocations = locations.filter(location => location.visited).length;
  
  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Painel de Controle</h1>
        <div className="text-xs sm:text-sm text-gray-500">
          Última atualização: {new Date().toLocaleDateString()}
        </div>
      </div>
      
      {/* Stats grid - responsive layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        <StatCard 
          title="Total de Pessoas" 
          value={people.length.toString()} 
          icon={<UserPlus />} 
          trend={"+5%"} 
          color="bg-blue-500" 
        />
        <StatCard 
          title="Grupos Ativos" 
          value={groups.length.toString()} 
          icon={<Users />} 
          trend={"+2%"} 
          color="bg-emerald-500" 
        />
        <StatCard 
          title="Total de Locais" 
          value={locations.length.toString()} 
          icon={<MapPin />} 
          trend={"+12%"} 
          color="bg-purple-500" 
        />
        <StatCard 
          title="Locais Visitados" 
          value={`${visitedLocations}/${locations.length}`} 
          icon={<UserCheck />} 
          trend={`${Math.round((visitedLocations / Math.max(locations.length, 1)) * 100)}%`} 
          color="bg-amber-500" 
        />
      </div>
      
      {/* Recent activity - improved mobile layout */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-4 sm:px-6 py-4 sm:py-5 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Atividades Recentes</h3>
        </div>
        <div className="px-4 sm:px-6 py-4 sm:py-5">
          {people.length === 0 && groups.length === 0 && locations.length === 0 ? (
            <div className="text-center py-6 sm:py-8">
              <p className="text-gray-500 text-sm sm:text-base">Nenhuma atividade recente para exibir.</p>
              <p className="text-gray-500 text-xs sm:text-sm mt-2">Comece adicionando pessoas, grupos ou locais.</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {people.slice(0, 3).map(person => (
                <li key={person.id} className="py-3 sm:py-4 flex items-start sm:items-center">
                  <div className="mr-3 sm:mr-4 flex-shrink-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-blue-500 flex items-center justify-center text-white text-sm sm:text-base">
                      {person.name.charAt(0)}
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">{person.name} foi adicionado(a)</p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{person.email}</p>
                  </div>
                </li>
              ))}
              
              {groups.slice(0, 2).map(group => (
                <li key={group.id} className="py-3 sm:py-4 flex items-start sm:items-center">
                  <div className="mr-3 sm:mr-4 flex-shrink-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-emerald-500 flex items-center justify-center text-white">
                      <Users size={16} className="sm:h-5 sm:w-5" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">Grupo "{group.name}" foi criado</p>
                    <p className="text-xs sm:text-sm text-gray-500">{group.members.length} membros</p>
                  </div>
                </li>
              ))}
              
              {locations.slice(0, 2).map(location => (
                <li key={location.id} className="py-3 sm:py-4 flex items-start sm:items-center">
                  <div className="mr-3 sm:mr-4 flex-shrink-0">
                    <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-purple-500 flex items-center justify-center text-white">
                      <MapPin size={16} className="sm:h-5 sm:w-5" />
                    </div>
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium text-gray-900 truncate">
                      Local "{location.name}" foi {location.visited ? 'visitado' : 'adicionado'}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-500 truncate">{location.address}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;