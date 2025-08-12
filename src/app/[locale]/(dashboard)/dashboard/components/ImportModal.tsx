"use client";

interface ImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  kmlContent: string | null;
}

export default function ImportModal({ isOpen, onClose, kmlContent }: ImportModalProps) {
  const handleOpenInMaps = (e: React.MouseEvent) => {
    e.preventDefault();
    if (kmlContent) {
      const form = document.createElement("form");
      form.method = "POST";
      form.action = "https://www.google.com/maps/d/u/0/kml";
      form.target = "_blank";
      form.style.display = "none";

      const input = document.createElement("input");
      input.type = "hidden";
      input.name = "kml";
      input.value = kmlContent.split(',')[1];
      
      form.appendChild(input);
      document.body.appendChild(form);
      form.submit();
      document.body.removeChild(form);
    }
    onClose(); // Ferme le modal après l'ouverture
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Overlay avec animation */}
      <div 
        className="fixed inset-0 bg-black/40 bg-opacity-75 transition-opacity"
        onClick={onClose}
      ></div>

      {/* Contenu du modal */}
      <div 
        className="relative bg-white rounded-lg shadow-xl transform transition-all w-full max-w-lg mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-start">
            <h3 className="text-lg font-medium text-gray-900">
              Importer dans Google My Maps
            </h3>
            <button
              type="button"
              className="text-gray-400 cursor-pointer hover:text-gray-500"
              onClick={onClose}
            >
              <span className="sr-only">Fermer</span>
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <button
              onClick={handleOpenInMaps}
              className="w-full flex items-center cursor-pointer justify-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
              Ouvrir dans Google My Maps
            </button>

            <div className="bg-blue-50 p-4 rounded-md">
              <p className="text-sm text-blue-700">
                Alternative : <a href="https://www.google.com/maps/d/" target="_blank" rel="noopener" className="text-blue-600 hover:text-blue-800 underline">Ouvrir Google My Maps</a> et importer manuellement le fichier.
              </p>
            </div>
          </div>

          <div className="mt-6">
            <button
              type="button"
              className="w-full px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 transition-colors"
              onClick={onClose}
            >
              Fermer
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}