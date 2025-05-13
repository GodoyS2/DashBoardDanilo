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
    </div>
  );
};

export default Dashboard;