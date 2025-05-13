import React from 'react';
import { X, Image as ImageIcon, Calendar, Globe } from 'lucide-react';
import { Territory } from '../context/AppContext';

interface TerritoryPreviewProps {
  territory: Territory;
  onClose: () => void;
  onEdit: () => void;
}

const TerritoryPreview: React.FC<TerritoryPreviewProps> = ({ territory, onClose, onEdit }) => {
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>

        <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          <div className="bg-white">
            <div className="flex justify-end p-4">
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Image Section */}
            <div className="relative w-full h-64 sm:h-96 bg-gray-100">
              {territory.image_url ? (
                <img
                  src={territory.image_url}
                  alt={territory.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <ImageIcon className="h-16 w-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Content Section */}
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{territory.name}</h2>
                  {territory.description && (
                    <p className="mt-2 text-gray-600">{territory.description}</p>
                  )}
                </div>
                <button
                  onClick={onEdit}
                  className="ml-4 px-4 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Editar
                </button>
              </div>

              {/* Metadata */}
              <div className="mt-6 border-t border-gray-200 pt-4">
                <div className="flex items-center text-sm text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    Criado em: {new Date(territory.created_at || '').toLocaleDateString()}
                  </span>
                </div>
                {territory.updated_at && (
                  <div className="flex items-center text-sm text-gray-500 mt-2">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>
                      Última atualização: {new Date(territory.updated_at).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TerritoryPreview;