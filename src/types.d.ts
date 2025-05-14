// Person type
interface Person {
  id: string;
  name: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
}

// Group type
interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[];
  avatar?: string;
  updatedAt: number;
}

// Location type
interface Location {
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

// Territory Image type
interface TerritoryImage {
  id: string;
  url: string;
  description?: string;
  assignedGroups: string[];
  assignedPeople: string[];
  createdAt: string;
}

// Territory type
interface Territory {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at?: string;
  updated_at?: string;
  images?: TerritoryImage[];
}