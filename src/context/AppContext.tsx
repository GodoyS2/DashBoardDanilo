import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase, checkSupabaseConnection } from '../lib/supabase';

export interface Territory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

export interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[];
  avatar?: string;
  updatedAt: number;
}

export interface Location {
  id: string;
  name: string;
  address: string;
  visited: boolean;
  coordinates: {
    lat: number;
    lng: number;
  };
  assignedGroups: string[];
  assignedPeople: string[];
  updatedAt: number;
}

interface AppContextType {
  people: Person[];
  groups: Group[];
  locations: Location[];
  territories: Territory[];
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addPerson: (person: Person) => Promise<void>;
  updatePerson: (person: Person) => Promise<void>;
  removePerson: (id: string) => Promise<void>;
  addGroup: (group: Group) => Promise<void>;
  updateGroup: (group: Group) => Promise<void>;
  removeGroup: (id: string) => Promise<void>;
  addLocation: (location: Location) => Promise<void>;
  updateLocation: (location: Location) => Promise<void>;
  removeLocation: (id: string) => Promise<void>;
  addTerritory: (territory: Territory) => Promise<void>;
  updateTerritory: (territory: Territory) => Promise<void>;
  removeTerritory: (id: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType>({
  people: [],
  groups: [],
  locations: [],
  territories: [],
  searchTerm: '',
  setSearchTerm: () => {},
  addPerson: async () => {},
  updatePerson: async () => {},
  removePerson: async () => {},
  addGroup: async () => {},
  updateGroup: async () => {},
  removeGroup: async () => {},
  addLocation: async () => {},
  updateLocation: async () => {},
  removeLocation: async () => {},
  addTerritory: async () => {},
  updateTerritory: async () => {},
  removeTerritory: async () => {},
  isLoading: true,
  error: null
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [territories, setTerritories] = useState<Territory[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        const isConnected = await checkSupabaseConnection();
        if (!isConnected) {
          throw new Error('Unable to connect to the database. Please check your connection and try again.');
        }

        // Load territories
        const { data: territoriesData, error: territoriesError } = await supabase
          .from('territories')
          .select('*')
          .order('created_at', { ascending: false });
        
        if (territoriesError) throw territoriesError;
        setTerritories(territoriesData || []);

        // Load existing data
        const { data: peopleData, error: peopleError } = await supabase
          .from('people')
          .select('*');
        if (peopleError) throw peopleError;
        setPeople(peopleData || []);

        const { data: groupsData, error: groupsError } = await supabase
          .from('groups')
          .select(`
            *,
            group_members (
              person_id
            )
          `);
        if (groupsError) throw groupsError;
        
        const formattedGroups = groupsData?.map(group => ({
          id: group.id,
          name: group.name,
          description: group.description,
          avatar: group.avatar,
          members: group.group_members.map((m: any) => m.person_id),
          updatedAt: new Date(group.updated_at).getTime()
        })) || [];
        setGroups(formattedGroups);

        const { data: locationsData, error: locationsError } = await supabase
          .from('locations')
          .select(`
            *,
            location_assignments (
              group_id,
              person_id
            )
          `);
        if (locationsError) throw locationsError;
        
        const formattedLocations = locationsData?.map(location => ({
          id: location.id,
          name: location.name,
          address: location.address,
          visited: location.visited,
          coordinates: {
            lat: location.lat,
            lng: location.lng
          },
          assignedGroups: location.location_assignments
            .filter((a: any) => a.group_id)
            .map((a: any) => a.group_id),
          assignedPeople: location.location_assignments
            .filter((a: any) => a.person_id)
            .map((a: any) => a.person_id),
          updatedAt: new Date(location.updated_at).getTime()
        })) || [];
        setLocations(formattedLocations);
      } catch (error) {
        console.error('Error loading data:', error);
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []);

  const addTerritory = async (territory: Territory) => {
    try {
      const { data, error } = await supabase
        .from('territories')
        .insert([{
          name: territory.name,
          description: territory.description,
          image_url: territory.image_url
        }])
        .select()
        .single();
      
      if (error) throw error;
      setTerritories(prev => [data, ...prev]);
    } catch (error) {
      console.error('Error adding territory:', error);
      throw error;
    }
  };

  const updateTerritory = async (territory: Territory) => {
    try {
      const { error } = await supabase
        .from('territories')
        .update({
          name: territory.name,
          description: territory.description,
          image_url: territory.image_url
        })
        .eq('id', territory.id);
      
      if (error) throw error;
      setTerritories(prev => prev.map(t => t.id === territory.id ? territory : t));
    } catch (error) {
      console.error('Error updating territory:', error);
      throw error;
    }
  };

  const removeTerritory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('territories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setTerritories(prev => prev.filter(t => t.id !== id));
    } catch (error) {
      console.error('Error removing territory:', error);
      throw error;
    }
  };

  // Existing methods...
  const addPerson = async (person: Person) => {
    try {
      const { data, error } = await supabase
        .from('people')
        .insert([{
          name: person.name,
          email: person.email,
          phone: person.phone,
          bio: person.bio,
          avatar: person.avatar
        }])
        .select()
        .single();
      
      if (error) throw error;
      setPeople(prev => [...prev, data]);
    } catch (error) {
      console.error('Error adding person:', error);
      throw error;
    }
  };

  const updatePerson = async (person: Person) => {
    try {
      const { error } = await supabase
        .from('people')
        .update({
          name: person.name,
          email: person.email,
          phone: person.phone,
          bio: person.bio,
          avatar: person.avatar
        })
        .eq('id', person.id);
      
      if (error) throw error;
      setPeople(prev => prev.map(p => p.id === person.id ? person : p));
    } catch (error) {
      console.error('Error updating person:', error);
      throw error;
    }
  };

  const removePerson = async (id: string) => {
    try {
      const { error } = await supabase
        .from('people')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setPeople(prev => prev.filter(p => p.id !== id));
      setGroups(prev => prev.map(group => ({
        ...group,
        members: group.members.filter(memberId => memberId !== id)
      })));
    } catch (error) {
      console.error('Error removing person:', error);
      throw error;
    }
  };

  const addGroup = async (group: Group) => {
    try {
      const { data: groupData, error: groupError } = await supabase
        .from('groups')
        .insert([{
          name: group.name,
          description: group.description,
          avatar: group.avatar
        }])
        .select()
        .single();
      
      if (groupError) throw groupError;

      if (group.members.length > 0) {
        const { error: membersError } = await supabase
          .from('group_members')
          .insert(
            group.members.map(personId => ({
              group_id: groupData.id,
              person_id: personId
            }))
          );
        
        if (membersError) throw membersError;
      }

      setGroups(prev => [...prev, { ...group, id: groupData.id }]);
    } catch (error) {
      console.error('Error adding group:', error);
      throw error;
    }
  };

  const updateGroup = async (group: Group) => {
    try {
      const { error: groupError } = await supabase
        .from('groups')
        .update({
          name: group.name,
          description: group.description,
          avatar: group.avatar
        })
        .eq('id', group.id);
      
      if (groupError) throw groupError;

      const { error: deleteError } = await supabase
        .from('group_members')
        .delete()
        .eq('group_id', group.id);
      
      if (deleteError) throw deleteError;

      if (group.members.length > 0) {
        const { error: membersError } = await supabase
          .from('group_members')
          .insert(
            group.members.map(personId => ({
              group_id: group.id,
              person_id: personId
            }))
          );
        
        if (membersError) throw membersError;
      }

      setGroups(prev => prev.map(g => g.id === group.id ? group : g));
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  };

  const removeGroup = async (id: string) => {
    try {
      const { error } = await supabase
        .from('groups')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setGroups(prev => prev.filter(g => g.id !== id));
    } catch (error) {
      console.error('Error removing group:', error);
      throw error;
    }
  };

  const addLocation = async (location: Location) => {
    try {
      const { data: locationData, error: locationError } = await supabase
        .from('locations')
        .insert([{
          name: location.name,
          address: location.address,
          visited: location.visited,
          lat: location.coordinates.lat,
          lng: location.coordinates.lng
        }])
        .select()
        .single();
      
      if (locationError) throw locationError;

      const assignments = [
        ...location.assignedGroups.map(groupId => ({
          location_id: locationData.id,
          group_id: groupId,
          person_id: null
        })),
        ...location.assignedPeople.map(personId => ({
          location_id: locationData.id,
          group_id: null,
          person_id: personId
        }))
      ];

      if (assignments.length > 0) {
        const { error: assignError } = await supabase
          .from('location_assignments')
          .insert(assignments);
        
        if (assignError) throw assignError;
      }

      setLocations(prev => [...prev, { ...location, id: locationData.id }]);
    } catch (error) {
      console.error('Error adding location:', error);
      throw error;
    }
  };

  const updateLocation = async (location: Location) => {
    try {
      const { error: locationError } = await supabase
        .from('locations')
        .update({
          name: location.name,
          address: location.address,
          visited: location.visited,
          lat: location.coordinates.lat,
          lng: location.coordinates.lng
        })
        .eq('id', location.id);
      
      if (locationError) throw locationError;

      const { error: deleteError } = await supabase
        .from('location_assignments')
        .delete()
        .eq('location_id', location.id);
      
      if (deleteError) throw deleteError;

      const assignments = [
        ...location.assignedGroups.map(groupId => ({
          location_id: location.id,
          group_id: groupId,
          person_id: null
        })),
        ...location.assignedPeople.map(personId => ({
          location_id: location.id,
          group_id: null,
          person_id: personId
        }))
      ];

      if (assignments.length > 0) {
        const { error: assignError } = await supabase
          .from('location_assignments')
          .insert(assignments);
        
        if (assignError) throw assignError;
      }

      setLocations(prev => prev.map(l => l.id === location.id ? location : l));
    } catch (error) {
      console.error('Error updating location:', error);
      throw error;
    }
  };

  const removeLocation = async (id: string) => {
    try {
      const { error } = await supabase
        .from('locations')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      setLocations(prev => prev.filter(l => l.id !== id));
    } catch (error) {
      console.error('Error removing location:', error);
      throw error;
    }
  };

  return (
    <AppContext.Provider
      value={{
        people,
        groups,
        locations,
        territories,
        searchTerm,
        setSearchTerm,
        addPerson,
        updatePerson,
        removePerson,
        addGroup,
        updateGroup,
        removeGroup,
        addLocation,
        updateLocation,
        removeLocation,
        addTerritory,
        updateTerritory,
        removeTerritory,
        isLoading,
        error
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);