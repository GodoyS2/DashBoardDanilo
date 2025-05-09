import React, { useState, useEffect } from 'react';
import { X, MapPin, Users, User } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

interface LocationFormProps {
  location: Location | null;
  onClose: () => void;
  onSave: (location: Location) => void;
}

interface ViaCEPResponse {
  cep: string;
  logradouro: string;
  complemento: string;
  bairro: string;
  localidade: string;
  uf: string;
}

const LocationForm: React.FC<LocationFormProps> = ({ location, onClose, onSave }) => {
  const { people, groups } = useAppContext();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [cep, setCep] = useState('');
  const [numero, setNumero] = useState('');
  const [complemento, setComplemento] = useState('');
  const [visited, setVisited] = useState(false);
  const [coordinates, setCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [assignedGroups, setAssignedGroups] = useState<string[]>([]);
  const [assignedPeople, setAssignedPeople] = useState<string[]>([]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [lastCepData, setLastCepData] = useState<ViaCEPResponse | null>(null);

  useEffect(() => {
    if (location) {
      setName(location.name);
      setAddress(location.address);
      setVisited(location.visited);
      setCoordinates(location.coordinates);
      setAssignedGroups(location.assignedGroups || []);
      setAssignedPeople(location.assignedPeople || []);
    }
  }, [location]);

  const formatAddress = (data: ViaCEPResponse, numero?: string, complemento?: string): string => {
    const parts = [
      data.logradouro,
      numero,
      complemento,
      data.bairro,
      `${data.localidade} - ${data.uf}`,
      data.cep
    ].filter(Boolean);
    
    return parts.join(', ');
  };

  const handleCEPChange = async (value: string) => {
    const cepNumbers = value.replace(/\D/g, '');
    setCep(cepNumbers);

    if (cepNumbers.length === 8) {
      setLoading(true);
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cepNumbers}/json/`);
        const data: ViaCEPResponse = await response.json();
        
        if (!data.erro) {
          setLastCepData(data);
          const formattedAddress = formatAddress(data, numero, complemento);
          setAddress(formattedAddress);
          
          setCoordinates({
            lat: -23.5505,
            lng: -46.6333
          });
          
          setErrors(prev => ({ ...prev, address: '' }));
        } else {
          setErrors(prev => ({ ...prev, address: 'CEP não encontrado' }));
        }
      } catch (error) {
        setErrors(prev => ({ ...prev, address: 'Erro ao buscar CEP' }));
      }
      setLoading(false);
    }
  };

  const updateAddressWithNumber = (newNumero: string) => {
    setNumero(newNumero);
    if (lastCepData) {
      const formattedAddress = formatAddress(lastCepData, newNumero, complemento);
      setAddress(formattedAddress);
    }
  };

  const updateAddressWithComplemento = (newComplemento: string) => {
    setComplemento(newComplemento);
    if (lastCepData) {
      const formattedAddress = formatAddress(lastCepData, numero, newComplemento);
      setAddress(formattedAddress);
    }
  };

  const handleGroupToggle = (groupId: string) => {
    setAssignedGroups(prev => 
      prev.includes(groupId)
        ? prev.filter(id => id !== groupId)
        : [...prev, groupId]
    );
  };

  const handlePersonToggle = (personId: string) => {
    setAssignedPeople(prev => 
      prev.includes(personId)
        ? prev.filter(id => id !== personId)
        : [...prev, personId]
    );
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!name.trim()) {
      newErrors.name = 'Nome do local é obrigatório';
    }
    
    if (!address.trim()) {
      newErrors.address = 'Endereço é obrigatório';
    }
    
    if (!coordinates) {
      newErrors.address = 'Endereço inválido';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    onSave({
      id: location ? location.id : Date.now().toString(),
      name: name.trim(),
      address: address.trim(),
      visited,
      coordinates: coordinates!,
      assignedGroups,
      assignedPeople,
      updatedAt: Date.now()
    });
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    {location ? 'Editar Local' : 'Adicionar Novo Local'}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>
                
                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                      Nome do Local <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.name ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>

                  <div className="mb-4">
                    <label htmlFor="cep" className="block text-sm font-medium text-gray-700">
                      CEP <span className="text-red-600">*</span>
                    </label>
                    <input
                      type="text"
                      id="cep"
                      value={cep}
                      onChange={(e) => handleCEPChange(e.target.value)}
                      maxLength={8}
                      placeholder="00000000"
                      className={`mt-1 block w-full px-3 py-2 border ${
                        errors.cep ? 'border-red-300' : 'border-gray-300'
                      } rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label htmlFor="numero" className="block text-sm font-medium text-gray-700">
                        Número
                      </label>
                      <input
                        type="text"
                        id="numero"
                        value={numero}
                        onChange={(e) => updateAddressWithNumber(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                    <div>
                      <label htmlFor="complemento" className="block text-sm font-medium text-gray-700">
                        Complemento
                      </label>
                      <input
                        type="text"
                        id="complemento"
                        value={complemento}
                        onChange={(e) => updateAddressWithComplemento(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                      Endereço Completo <span className="text-red-600">*</span>
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        id="address"
                        value={address}
                        readOnly
                        className={`mt-1 block w-full px-3 py-2 border ${
                          errors.address ? 'border-red-300' : 'border-gray-300'
                        } rounded-md shadow-sm bg-gray-50 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm`}
                      />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        {loading ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-purple-500"></div>
                        ) : (
                          <MapPin size={16} className="text-gray-400" />
                        )}
                      </div>
                    </div>
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex items-center">
                      <input
                        id="visited"
                        type="checkbox"
                        checked={visited}
                        onChange={(e) => setVisited(e.target.checked)}
                        className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                      />
                      <label htmlFor="visited" className="ml-2 block text-sm text-gray-900">
                        Marcar como visitado
                      </label>
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Grupos Designados
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {groups.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">Nenhum grupo disponível</p>
                      ) : (
                        groups.map(group => (
                          <div key={group.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`group-${group.id}`}
                              checked={assignedGroups.includes(group.id)}
                              onChange={() => handleGroupToggle(group.id)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`group-${group.id}`}
                              className="ml-2 block text-sm text-gray-900"
                            >
                              {group.name} ({group.members.length} membros)
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Pessoas Designadas
                    </label>
                    <div className="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-md p-2">
                      {people.length === 0 ? (
                        <p className="text-gray-500 text-sm italic">Nenhuma pessoa disponível</p>
                      ) : (
                        people.map(person => (
                          <div key={person.id} className="flex items-center">
                            <input
                              type="checkbox"
                              id={`person-${person.id}`}
                              checked={assignedPeople.includes(person.id)}
                              onChange={() => handlePersonToggle(person.id)}
                              className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                            />
                            <label
                              htmlFor={`person-${person.id}`}
                              className="ml-2 block text-sm text-gray-900"
                            >
                              {person.name}
                            </label>
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="sm:flex sm:flex-row-reverse mt-5">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-purple-600 text-base font-medium text-white hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      {location ? 'Atualizar' : 'Adicionar'} Local
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationForm;