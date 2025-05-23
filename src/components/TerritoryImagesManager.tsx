import React, { useState } from 'react';
import { X, Upload, Image as ImageIcon, UserPlus, Users, Trash, Eye, XCircle, Mail } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';

interface TerritoryImagesManagerProps {
  territory: Territory;
  onClose: () => void;
  onSave: (territory: Territory) => void;
}

const TerritoryImagesManager: React.FC<TerritoryImagesManagerProps> = ({
  territory,
  onClose,
  onSave
}) => {
  const { people, groups } = useAppContext();
  const [images, setImages] = useState<TerritoryImage[]>(territory.images || []);
  const [selectedImage, setSelectedImage] = useState<TerritoryImage | null>(null);
  const [previewImage, setPreviewImage] = useState<TerritoryImage | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState('');
  const [sendingEmail, setSendingEmail] = useState(false);
  const [emailError, setEmailError] = useState<string | null>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          const newImage: TerritoryImage = {
            id: uuidv4(),
            url: reader.result as string,
            assignedGroups: [],
            assignedPeople: [],
            createdAt: new Date().toISOString()
          };
          setImages(prev => [...prev, newImage]);
        };
        reader.readAsDataURL(file);
      } catch (error) {
        setUploadError('Erro ao fazer upload da imagem');
      }
    }
  };

  const handleRemoveImage = (imageId: string) => {
    setImages(prev => prev.filter(img => img.id !== imageId));
    if (selectedImage?.id === imageId) {
      setSelectedImage(null);
    }
    if (previewImage?.id === imageId) {
      setPreviewImage(null);
    }
  };

  const handleAssignGroup = (imageId: string, groupId: string) => {
    setImages(prev => prev.map(img => {
      if (img.id === imageId) {
        const assignedGroups = img.assignedGroups.includes(groupId)
          ? img.assignedGroups.filter(id => id !== groupId)
          : [...img.assignedGroups, groupId];
        return { ...img, assignedGroups };
      }
      return img;
    }));
  };

  const handleAssignPerson = (imageId: string, personId: string) => {
    setImages(prev => prev.map(img => {
      if (img.id === imageId) {
        const assignedPeople = img.assignedPeople.includes(personId)
          ? img.assignedPeople.filter(id => id !== personId)
          : [...img.assignedPeople, personId];
        return { ...img, assignedPeople };
      }
      return img;
    }));
  };

  const handleSave = () => {
    onSave({
      ...territory,
      images
    });
  };

  const handleSendEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setEmailError('Email é obrigatório');
      return;
    }

    try {
      setSendingEmail(true);
      setEmailError(null);

      const response = await fetch(`${import.meta.env.VITE_SUPABASE_URL}/functions/v1/share-territory`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          territory_id: territory.id,
          email,
        }),
      });

      if (!response.ok) {
        throw new Error('Erro ao enviar email');
      }

      setShowEmailModal(false);
      setEmail('');
    } catch (error) {
      setEmailError(error.message);
    } finally {
      setSendingEmail(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="w-full">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Gerenciar Imagens: {territory.name}
                  </h3>
                  <button
                    onClick={onClose}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <X size={20} />
                  </button>
                </div>

                {/* Upload section */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Adicionar Nova Imagem
                  </label>
                  <div className="mt-1 flex justify-center px-4 py-3 border-2 border-gray-300 border-dashed rounded-md">
                    <div className="space-y-1 text-center">
                      <Upload className="mx-auto h-8 w-8 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="image-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>Upload uma imagem</span>
                          <input
                            id="image-upload"
                            name="image-upload"
                            type="file"
                            className="sr-only"
                            accept="image/*"
                            onChange={handleImageUpload}
                          />
                        </label>
                      </div>
                      <p className="text-xs text-gray-500">PNG, JPG até 10MB</p>
                    </div>
                  </div>
                  {uploadError && (
                    <p className="mt-2 text-sm text-red-600">{uploadError}</p>
                  )}
                </div>

                {/* Images grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {images.map(image => (
                    <div
                      key={image.id}
                      className={`relative rounded-lg overflow-hidden border-2 ${
                        selectedImage?.id === image.id ? 'border-indigo-500' : 'border-transparent'
                      }`}
                      onClick={() => setSelectedImage(image)}
                    >
                      <img
                        src={image.url}
                        alt=""
                        className="w-full h-24 object-cover"
                      />
                      <div className="absolute top-1 right-1 flex space-x-1">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setPreviewImage(image);
                          }}
                          className="p-1 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 transition-colors"
                          title="Visualizar imagem"
                        >
                          <Eye size={14} />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveImage(image.id);
                          }}
                          className="p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                          title="Remover imagem"
                        >
                          <Trash size={14} />
                        </button>
                      </div>
                      <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-50 text-white p-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <Users size={12} />
                          <span>{image.assignedGroups.length}</span>
                          <UserPlus size={12} />
                          <span>{image.assignedPeople.length}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Assignments section */}
                {selectedImage && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-lg font-medium text-gray-900 mb-4">
                      Atribuições da Imagem
                    </h4>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Groups */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Grupos</h5>
                        <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          {groups.map(group => (
                            <div key={group.id} className="p-2 hover:bg-gray-50">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`group-${group.id}`}
                                  checked={selectedImage.assignedGroups.includes(group.id)}
                                  onChange={() => handleAssignGroup(selectedImage.id, group.id)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor={`group-${group.id}`}
                                  className="ml-2 block text-sm text-gray-900"
                                >
                                  {group.name} ({group.members.length} membros)
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* People */}
                      <div>
                        <h5 className="text-sm font-medium text-gray-700 mb-2">Pessoas</h5>
                        <div className="border border-gray-200 rounded-md divide-y divide-gray-200">
                          {people.map(person => (
                            <div key={person.id} className="p-2 hover:bg-gray-50">
                              <div className="flex items-center">
                                <input
                                  type="checkbox"
                                  id={`person-${person.id}`}
                                  checked={selectedImage.assignedPeople.includes(person.id)}
                                  onChange={() => handleAssignPerson(selectedImage.id, person.id)}
                                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                />
                                <label
                                  htmlFor={`person-${person.id}`}
                                  className="ml-2 block text-sm text-gray-900"
                                >
                                  {person.name}
                                </label>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              onClick={() => setShowEmailModal(true)}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              <Mail className="w-5 h-5 mr-2" />
              Enviar por Email
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-indigo-600 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Salvar Alterações
            </button>
            <button
              type="button"
              onClick={onClose}
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancelar
            </button>
          </div>
        </div>
      </div>

      {/* Email Modal */}
      {showEmailModal && (
        <div className="fixed inset-0 z-[70] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>
            <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <form onSubmit={handleSendEmail}>
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="sm:flex sm:items-start">
                    <div className="w-full">
                      <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                        Enviar Imagens por Email
                      </h3>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          className={`mt-1 block w-full px-3 py-2 border ${
                            emailError ? 'border-red-300' : 'border-gray-300'
                          } rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                          placeholder="Digite o email do destinatário"
                        />
                        {emailError && (
                          <p className="mt-2 text-sm text-red-600">{emailError}</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                  <button
                    type="submit"
                    disabled={sendingEmail}
                    className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm disabled:opacity-50"
                  >
                    {sendingEmail ? 'Enviando...' : 'Enviar'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setShowEmailModal(false)}
                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Image Preview Modal */}
      {previewImage && (
        <div className="fixed inset-0 z-[60] overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen">
            <div className="fixed inset-0 bg-black opacity-75" onClick={() => setPreviewImage(null)}></div>
            <div className="relative bg-white rounded-lg max-w-4xl w-full mx-4">
              <div className="absolute top-0 right-0 pt-4 pr-4">
                <button
                  onClick={() => setPreviewImage(null)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <XCircle size={24} />
                </button>
              </div>
              <img
                src={previewImage.url}
                alt=""
                className="w-full h-auto max-h-[80vh] object-contain p-4"
              />
              <div className="bg-white p-4 border-t">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="flex items-center">
                      <Users size={16} className="text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">{previewImage.assignedGroups.length} grupos</span>
                    </div>
                    <div className="flex items-center">
                      <UserPlus size={16} className="text-gray-500 mr-1" />
                      <span className="text-sm text-gray-600">{previewImage.assignedPeople.length} pessoas</span>
                    </div>
                  </div>
                  <span className="text-sm text-gray-500">
                    Adicionada em {new Date(previewImage.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TerritoryImagesManager;