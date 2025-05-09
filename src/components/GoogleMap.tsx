import React, { useEffect, useState } from 'react';
import { GoogleMap as GoogleMapComponent, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { MapPin } from 'lucide-react';

interface GoogleMapProps {
  locations: Location[];
  onLocationClick?: (location: Location) => void;
}

const GoogleMap: React.FC<GoogleMapProps> = ({ locations, onLocationClick }) => {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<Error | null>(null);

  const mapStyles = {
    height: "100%",
    width: "100%"
  };

  const defaultCenter = {
    lat: -23.5505,
    lng: -46.6333
  };

  const onLoad = (map: google.maps.Map) => {
    setMap(map);
    setIsLoading(false);
    
    if (locations.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      locations.forEach(location => {
        bounds.extend(location.coordinates);
      });
      map.fitBounds(bounds);
    }
  };

  const handleMarkerClick = (location: Location) => {
    setSelectedLocation(location);
    if (onLocationClick) {
      onLocationClick(location);
    }
  };

  if (!import.meta.env.VITE_GOOGLE_MAPS_API_KEY) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 text-gray-500">
        <p>Google Maps API key not configured</p>
      </div>
    );
  }

  if (loadError) {
    return (
      <div className="flex items-center justify-center h-full bg-gray-50 text-red-500">
        <p>Error loading Google Maps: {loadError.message}</p>
      </div>
    );
  }

  return (
    <LoadScript 
      googleMapsApiKey={import.meta.env.VITE_GOOGLE_MAPS_API_KEY}
      onError={(error) => setLoadError(error)}
    >
      {isLoading ? (
        <div className="flex items-center justify-center h-full bg-gray-50">
          <p className="text-gray-500">Loading map...</p>
        </div>
      ) : (
        <GoogleMapComponent
          mapContainerStyle={mapStyles}
          zoom={13}
          center={defaultCenter}
          onLoad={onLoad}
        >
          {locations.map(location => (
            <Marker
              key={location.id}
              position={location.coordinates}
              onClick={() => handleMarkerClick(location)}
              icon={{
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: location.visited ? '#10b981' : '#ef4444',
                fillOpacity: 1,
                strokeWeight: 2,
                strokeColor: '#ffffff'
              }}
            />
          ))}

          {selectedLocation && (
            <InfoWindow
              position={selectedLocation.coordinates}
              onCloseClick={() => setSelectedLocation(null)}
            >
              <div className="p-2">
                <h3 className="font-medium text-gray-900">{selectedLocation.name}</h3>
                <p className="text-sm text-gray-600">{selectedLocation.address}</p>
                <div className="mt-1 text-xs text-gray-500">
                  {selectedLocation.visited ? 'Visitado' : 'Não visitado'}
                </div>
              </div>
            </InfoWindow>
          )}
        </GoogleMapComponent>
      )}
    </LoadScript>
  );
};

export default GoogleMap;