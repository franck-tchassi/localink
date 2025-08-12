"use client";

import { Dispatch, SetStateAction } from "react";

interface GuideModalProps {
  isOpen: boolean;
  onClose: Dispatch<SetStateAction<boolean>>;
}

export default function GuideModal({ isOpen, onClose }: GuideModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Fond semi-transparent */}
      <div 
        className="absolute inset-0 bg-black/40 bg-opacity-75 backdrop-blur-"
        onClick={() => onClose(false)}
      />
      
      {/* Contenu du modal */}
      <div 
        className="relative w-full max-w-2xl bg-white rounded-lg shadow-xl overflow-hidden"
      >
        {/* En-tête */}
        <div className="flex items-center justify-between p-6 border-b">
          <h3 className="text-xl font-semibold text-gray-900">
            Guide d'utilisation
          </h3>
          <button
            onClick={() => onClose(false)}
            className="text-gray-500 cursor-pointer hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        {/* Corps du modal */}
        <div className="p-6 space-y-4">
          <ul className="space-y-4 text-gray-800">
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">
                1
              </span>
              <span>Renseignez les informations de votre entreprise (nom, site web, téléphone et adresse de référence).</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">
                2
              </span>
              <span>Ajoutez vos mots-clés SEO principaux, séparés par des point-virgules.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">
                3
              </span>
              <span>Configurez les paramètres de génération.</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="flex-shrink-0 flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-600">
                4
              </span>
              <span>Cliquez sur "Générer mon fichier KML" pour créer et télécharger votre fichier.</span>
            </li>
          </ul>
        </div>
        
        {/* Pied de page */}
        <div className="bg-gray-50 px-6 py-4 flex justify-end">
          <button
            onClick={() => onClose(false)}
            className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            J'ai compris
          </button>
        </div>
      </div>
    </div>
  );
}