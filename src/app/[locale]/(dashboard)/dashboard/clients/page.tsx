"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { Trash2, Edit3, ChevronRight, Plus, Search, X } from 'lucide-react';
import Swal from 'sweetalert2';
import { useI18n } from '@/locales/client';

type Client = {
  id: number;
  nomEntreprise: string;
  adresseDepart: string;
  urlEntreprise: string;
  telEntreprise: string;
  urlMyBusiness: string;
  motsCles: string;
  createdAt: Date;
};

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(20);
  const router = useRouter();

  const fetchClients = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/clients');
      
      if (!response.ok) {
        throw new Error(response.status === 401 
          ? 'Authentification requise' 
          : 'Erreur lors du chargement des clients');
      }
      
      const data = await response.json();
      setClients(data.map((client: Client) => ({
        ...client,
        createdAt: new Date(client.createdAt)
      })));
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue';
      setError(message);
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  const handleLoadClient = async (client: Client) => {
    try {
      sessionStorage.setItem('currentClientData', JSON.stringify(client));
      router.push(`/dashboard/generator?clientId=${client.id}&prefill=true`);
    } catch (error) {
      console.error('Erreur:', error);
      toast.error('Erreur lors du chargement du client');
    }
  };

  const handleDeleteClient = async (clientId: number) => {
    const result = await Swal.fire({
      title: 'Confirmer la suppression',
      text: "Cette action est irréversible. Voulez-vous continuer ?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Oui, supprimer',
      cancelButtonText: 'Annuler',
      backdrop: `
        rgba(0,0,0,0.4)
        url("/images/nyan-cat.gif")
        left top
        no-repeat
      `
    });

    if (!result.isConfirmed) return;

    try {
      const response = await fetch(`/api/clients/${clientId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(response.status === 404 
          ? 'Client introuvable' 
          : 'Échec de la suppression');
      }

      setClients(prev => prev.filter(c => c.id !== clientId));
      
      toast.success('Client supprimé avec succès', {
        position: 'top-right',
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erreur lors de la suppression';
      toast.error(message, {
        position: 'top-right',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const filteredClients = clients.filter(client =>
    client.nomEntreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.adresseDepart.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const t =useI18n()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
                {t("dashboards.clients.title")}
              </h1>
            </div>
            <div className="mt-4 flex md:mt-0 md:ml-4">
              <Link
                href="/dashboard/generator"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-1" />
                {t("dashboards.clients.new_kml")}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search and filter */}
        <div className="mb-8">
          <div className="relative rounded-md shadow-sm max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200"
              placeholder="Rechercher un client..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1); // Reset to first page on search
              }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute inset-y-0 cursor-pointer right-0 pr-3 flex items-center hover:text-gray-500 transition-colors"
              >
                <X className="h-5 w-5 text-gray-400" />
              </button>
            )}
          </div>
        </div>

        {/* Loading state */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="rounded-md bg-red-50 p-4 mb-8 border border-red-100">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Erreur de chargement</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>{error}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && !error && filteredClients.length === 0 && (
          <div className="text-center bg-white py-16 px-6 rounded-lg shadow-sm border border-gray-200">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">{t("dashboards.clients.not_think")}</h3>
            <p className="mt-1 text-gray-500">
              {searchTerm ? 'Aucun résultat pour votre recherche.' : t("dashboards.clients.new_client")}
            </p>
            <div className="mt-6">
              <Link
                href="/dashboard/generator"
                className="inline-flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
              >
                <Plus className="h-5 w-5 mr-1" />
                {t("dashboards.clients.new_kml")}
              </Link>
            </div>
          </div>
        )}

        {/* Clients list */}
        {!isLoading && !error && filteredClients.length > 0 && (
          <div className="bg-white shadow overflow-hidden sm:rounded-lg border border-gray-200">
            {/* Scrollable container with custom scrollbar */}
            <div className="max-h-[600px] overflow-y-auto custom-scrollbar">
              <ul className="divide-y divide-gray-200">
                {currentItems.map((client) => (
                  <li key={client.id} className="px-4 py-4 hover:bg-gray-50 transition-colors duration-200 group">
                    <div className="flex items-center justify-between space-x-4">
                      <div className="flex items-center min-w-0 flex-1">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                          <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-md font-semibold text-gray-900 truncate">
                            {client.nomEntreprise}
                          </h3>
                          <p className="text-sm text-gray-500 truncate">
                            {client.adresseDepart}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Créé le {formatDate(client.createdAt)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleLoadClient(client)}
                          className="inline-flex items-center cursor-pointer px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                        >
                          <ChevronRight className="h-4 w-4 mr-1" />
                          Utiliser
                        </button>
                        <button
                          onClick={() => handleDeleteClient(client.id)}
                          className="inline-flex items-center cursor-pointer px-3 py-1.5 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Supprimer
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-gray-50 px-6 py-3 flex items-center justify-between border-t border-gray-200">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Précédent
                  </button>
                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                  >
                    Suivant
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Affichage <span className="font-medium">{indexOfFirstItem + 1}</span> à <span className="font-medium">
                        {Math.min(indexOfLastItem, filteredClients.length)}
                      </span> sur <span className="font-medium">{filteredClients.length}</span> résultats
                    </p>
                  </div>
                  <div>
                    <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                      <button
                        onClick={() => setCurrentPage(1)}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="sr-only">Première page</span>
                        «
                      </button>
                      <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === 1 ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="sr-only">Précédent</span>
                        ‹
                      </button>

                      {/* Page numbers */}
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((number) => (
                        <button
                          key={number}
                          onClick={() => paginate(number)}
                          className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === number 
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600' 
                            : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'}`}
                        >
                          {number}
                        </button>
                      ))}

                      <button
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="sr-only">Suivant</span>
                        ›
                      </button>
                      <button
                        onClick={() => setCurrentPage(totalPages)}
                        disabled={currentPage === totalPages}
                        className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${currentPage === totalPages ? 'text-gray-300 cursor-not-allowed' : 'text-gray-500 hover:bg-gray-50'}`}
                      >
                        <span className="sr-only">Dernière page</span>
                        »
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          height: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
      `}</style>
    </div>
  );
}