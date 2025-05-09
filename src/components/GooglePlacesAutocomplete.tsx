import React, { useEffect, useRef, useState } from 'react';

interface GooglePlacesAutocompleteProps {
  onPlaceSelect: (place: any) => void;
  defaultValue?: string;
  error?: string;
}

const GooglePlacesAutocomplete: React.FC<GooglePlacesAutocompleteProps> = ({
  onPlaceSelect,
  defaultValue = '',
  error
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [value, setValue] = useState(defaultValue);
  
  useEffect(() => {
    // Mock implementation for demo purposes
    // In a real application, we would load the Google Maps API and set up real autocomplete
    const mockAutocomplete = document.createElement('div');
    mockAutocomplete.style.position = 'absolute';
    mockAutocomplete.style.width = '100%';
    mockAutocomplete.style.zIndex = '100';
    mockAutocomplete.style.backgroundColor = 'white';
    mockAutocomplete.style.border = '1px solid #ddd';
    mockAutocomplete.style.borderRadius = '4px';
    mockAutocomplete.style.marginTop = '2px';
    mockAutocomplete.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
    mockAutocomplete.style.display = 'none';
    
    inputRef.current?.parentNode?.appendChild(mockAutocomplete);
    
    const mockedPlaces = [
      {
        description: '123 Main St, New York, NY, USA',
        formatted_address: '123 Main St, New York, NY, USA',
        geometry: { 
          location: { 
            lat: () => 40.7128, 
            lng: () => -74.0060 
          } 
        }
      },
      {
        description: '456 Market St, San Francisco, CA, USA',
        formatted_address: '456 Market St, San Francisco, CA, USA',
        geometry: { 
          location: { 
            lat: () => 37.7749, 
            lng: () => -122.4194 
          } 
        }
      },
      {
        description: '789 Michigan Ave, Chicago, IL, USA',
        formatted_address: '789 Michigan Ave, Chicago, IL, USA',
        geometry: { 
          location: { 
            lat: () => 41.8781, 
            lng: () => -87.6298 
          } 
        }
      }
    ];
    
    const handleInputChange = () => {
      const inputValue = inputRef.current?.value || '';
      setValue(inputValue);
      
      if (inputValue.length > 2) {
        mockAutocomplete.innerHTML = '';
        mockAutocomplete.style.display = 'block';
        
        mockedPlaces.forEach(place => {
          if (place.description.toLowerCase().includes(inputValue.toLowerCase())) {
            const item = document.createElement('div');
            item.className = 'p-2 hover:bg-gray-100 cursor-pointer';
            item.textContent = place.description;
            item.addEventListener('click', () => {
              setValue(place.description);
              mockAutocomplete.style.display = 'none';
              onPlaceSelect(place);
            });
            mockAutocomplete.appendChild(item);
          }
        });
        
        if (mockAutocomplete.children.length === 0) {
          mockAutocomplete.style.display = 'none';
        }
      } else {
        mockAutocomplete.style.display = 'none';
      }
    };
    
    const handleDocumentClick = (e: MouseEvent) => {
      if (e.target !== inputRef.current) {
        mockAutocomplete.style.display = 'none';
      }
    };
    
    inputRef.current?.addEventListener('input', handleInputChange);
    document.addEventListener('click', handleDocumentClick);
    
    return () => {
      inputRef.current?.removeEventListener('input', handleInputChange);
      document.removeEventListener('click', handleDocumentClick);
      mockAutocomplete.remove();
    };
  }, [onPlaceSelect]);

  return (
    <input
      ref={inputRef}
      type="text"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Search for an address..."
      className={`mt-1 block w-full px-3 py-2 border ${
        error ? 'border-red-300' : 'border-gray-300'
      } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
    />
  );
};

export default GooglePlacesAutocomplete;