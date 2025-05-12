import React, { createContext, useContext, useState } from 'react';

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
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  addPerson: (person: Person) => void;
  updatePerson: (person: Person) => void;
  removePerson: (id: string) => void;
  addGroup: (group: Group) => void;
  updateGroup: (group: Group) => void;
  removeGroup: (id: string) => void;
  addLocation: (location: Location) => void;
  updateLocation: (location: Location) => void;
  removeLocation: (id: string) => void;
}

const AppContext = createContext<AppContextType>({
  people: [],
  groups: [],
  locations: [],
  searchTerm: '',
  setSearchTerm: () => {},
  addPerson: () => {},
  updatePerson: () => {},
  removePerson: () => {},
  addGroup: () => {},
  updateGroup: () => {},
  removeGroup: () => {},
  addLocation: () => {},
  updateLocation: () => {},
  removeLocation: () => {}
});

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>([]);
  const [groups, setGroups] = useState<Group[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  const addPerson = (person: Person) => {
    setPeople(prev => [...prev, person]);
  };

  const updatePerson = (person: Person) => {
    setPeople(prev => prev.map(p => p.id === person.id ? person : p));
  };

  const removePerson = (id: string) => {
    setPeople(prev => prev.filter(p => p.id !== id));
    setGroups(prev => prev.map(group => ({
      ...group,
      members: group.members.filter(memberId => memberId !== id)
    })));
  };

  const addGroup = (group: Group) => {
    setGroups(prev => [...prev, group]);
  };

  const updateGroup = (group: Group) => {
    setGroups(prev => prev.map(g => g.id === group.id ? group : g));
  };

  const removeGroup = (id: string) => {
    setGroups(prev => prev.filter(g => g.id !== id));
  };

  const addLocation = (location: Location) => {
    setLocations(prev => [...prev, location]);
  };

  const updateLocation = (location: Location) => {
    setLocations(prev => prev.map(l => l.id === location.id ? location : l));
  };

  const removeLocation = (id: string) => {
    setLocations(prev => prev.filter(l => l.id !== id));
  };

  return (
    <AppContext.Provider
      value={{
        people,
        groups,
        locations,
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
        removeLocation
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);