// Person type
interface Person {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

// Group type
interface Group {
  id: string;
  name: string;
  description?: string;
  members: string[]; // Array of person IDs
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
  assignedGroups: string[]; // Array of group IDs
  assignedPeople: string[]; // Array of person IDs
  updatedAt: number;
}