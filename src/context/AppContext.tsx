import React, { createContext, useContext, useState, useEffect } from 'react';

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

const samplePeople: Person[] = [
  { 
    id: '1', 
    name: 'João Silva', 
    email: 'joao@exemplo.com', 
    phone: '(11) 98765-4321',
    bio: 'Desenvolvedor Full Stack com 5 anos de experiência',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'
  },
  { 
    id: '2', 
    name: 'Maria Santos', 
    email: 'maria@exemplo.com',
    bio: 'Designer UX/UI',
    avatar: 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg'
  },
  { 
    id: '3', 
    name: 'Pedro Costa', 
    email: 'pedro@exemplo.com', 
    phone: '(21) 99876-5432',
    bio: 'Gerente de Projetos',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg'
  }
];

const sampleGroups: Group[] = [
  { 
    id: '1', 
    name: 'Equipe de Marketing', 
    description: 'Membros do departamento de marketing', 
    members: ['1', '2'],
    avatar: 'https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg',
    updatedAt: Date.now()
  },
  { 
    id: '2', 
    name: 'Desenvolvimento', 
    description: 'Desenvolvedores de software', 
    members: ['3'],
    avatar: 'https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg',
    updatedAt: Date.now()
  }
];

const sampleLocations: Location[] = [
  { 
    id: '1', 
    name: 'Sede', 
    address: 'Av. Paulista, 1000, São Paulo, SP',
    visited: true,
    coordinates: { lat: -23.5505, lng: -46.6333 },
    assignedGroups: ['1'],
    assignedPeople: ['3'],
    updatedAt: Date.now()
  },
  { 
    id: '2', 
    name: 'Filial Rio', 
    address: 'Av. Atlântica, 500, Rio de Janeiro, RJ',
    visited: false,
    coordinates: { lat: -22.9068, lng: -43.1729 },
    assignedGroups: [],
    assignedPeople: ['1', '2'],
    updatedAt: Date.now()
  }
];

const MAX_STORED_ITEMS = 50;
const MAX_BIO_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 200;
const MAX_IMAGE_SIZE = 50 * 1024; // 50KB

const compressBase64Image = async (base64: string): Promise<string> => {
  if (base64.startsWith('http')) {
    return base64;
  }

  if (base64.length <= MAX_IMAGE_SIZE) {
    return base64;
  }

  const img = new Image();
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  return new Promise((resolve) => {
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      const aspectRatio = width / height;

      if (width > 300) {
        width = 300;
        height = width / aspectRatio;
      }

      canvas.width = width;
      canvas.height = height;

      ctx?.drawImage(img, 0, 0, width, height);
      
      const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7);
      
      canvas.remove();
      
      resolve(compressedBase64);
    };
    img.src = base64;
  });
};

const preparePersonForStorage = async (person: Person): Promise<Person> => {
  const { id, name, email, phone } = person;
  const bio = person.bio?.slice(0, MAX_BIO_LENGTH);
  const avatar = person.avatar ? await compressBase64Image(person.avatar) : undefined;
  return { id, name, email, phone, bio, avatar };
};

const prepareGroupForStorage = async (group: Group): Promise<Group> => {
  const { id, name, members, updatedAt } = group;
  const description = group.description?.slice(0, MAX_DESCRIPTION_LENGTH);
  const avatar = group.avatar ? await compressBase64Image(group.avatar) : undefined;
  return { id, name, description, members, avatar, updatedAt };
};

const prepareLocationForStorage = (location: Location): Location => {
  const { id, name, address, visited, coordinates, assignedGroups, assignedPeople, updatedAt } = location;
  return { id, name, address, visited, coordinates, assignedGroups, assignedPeople, updatedAt };
};

const safeLocalStorageSetItem = async (key: string, value: any): Promise<void> => {
  try {
    let dataToStore = value;

    if (key === 'people') {
      const people = JSON.parse(value);
      const preparedPeople = await Promise.all(people.map(preparePersonForStorage));
      dataToStore = JSON.stringify(preparedPeople.slice(-MAX_STORED_ITEMS));
    } else if (key === 'groups') {
      const groups = JSON.parse(value);
      const preparedGroups = await Promise.all(groups.map(prepareGroupForStorage));
      dataToStore = JSON.stringify(preparedGroups.slice(-MAX_STORED_ITEMS));
    } else if (key === 'locations') {
      const locations = JSON.parse(value);
      const preparedLocations = locations.map(prepareLocationForStorage);
      dataToStore = JSON.stringify(preparedLocations.slice(-MAX_STORED_ITEMS));
    }

    localStorage.setItem(key, dataToStore);
  } catch (error) {
    console.error(`Failed to save ${key} to localStorage:`, error);
  }
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [people, setPeople] = useState<Person[]>(() => {
    try {
      const savedPeople = localStorage.getItem('people');
      return savedPeople ? JSON.parse(savedPeople) : samplePeople;
    } catch (error) {
      console.error('Error loading people from localStorage:', error);
      return samplePeople;
    }
  });
  
  const [groups, setGroups] = useState<Group[]>(() => {
    try {
      const savedGroups = localStorage.getItem('groups');
      return savedGroups ? JSON.parse(savedGroups) : sampleGroups;
    } catch (error) {
      console.error('Error loading groups from localStorage:', error);
      return sampleGroups;
    }
  });
  
  const [locations, setLocations] = useState<Location[]>(() => {
    try {
      const savedLocations = localStorage.getItem('locations');
      return savedLocations ? JSON.parse(savedLocations) : sampleLocations;
    } catch (error) {
      console.error('Error loading locations from localStorage:', error);
      return sampleLocations;
    }
  });

  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    safeLocalStorageSetItem('people', JSON.stringify(people));
    safeLocalStorageSetItem('groups', JSON.stringify(groups));
    safeLocalStorageSetItem('locations', JSON.stringify(locations));
  }, [people, groups, locations]);

  const addPerson = (person: Person) => {
    setPeople(prev => [...prev, person]);
  };

  const updatePerson = (updatedPerson: Person) => {
    setPeople(prev => prev.map(person => 
      person.id === updatedPerson.id ? updatedPerson : person
    ));
  };

  const removePerson = (id: string) => {
    setPeople(prev => prev.filter(person => person.id !== id));
    setGroups(prev => prev.map(group => ({
      ...group,
      members: group.members.filter(memberId => memberId !== id),
      updatedAt: Date.now()
    })));
  };

  const addGroup = (group: Group) => {
    const newGroup = {
      ...group,
      updatedAt: Date.now()
    };
    setGroups(prev => [...prev, newGroup]);
  };

  const updateGroup = (updatedGroup: Group) => {
    const groupWithTimestamp = {
      ...updatedGroup,
      updatedAt: Date.now()
    };
    setGroups(prev => prev.map(group => 
      group.id === updatedGroup.id ? groupWithTimestamp : group
    ));
  };

  const removeGroup = (id: string) => {
    setGroups(prev => prev.filter(group => group.id !== id));
  };

  const addLocation = (location: Location) => {
    const newLocation = {
      ...location,
      updatedAt: Date.now()
    };
    setLocations(prev => [...prev, newLocation]);
  };

  const updateLocation = (updatedLocation: Location) => {
    const locationWithTimestamp = {
      ...updatedLocation,
      updatedAt: Date.now()
    };
    setLocations(prev => prev.map(location => 
      location.id === updatedLocation.id ? locationWithTimestamp : location
    ));
  };

  const removeLocation = (id: string) => {
    setLocations(prev => prev.filter(location => location.id !== id));
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