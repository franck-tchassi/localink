'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'react-toastify';
import { Search, ChevronLeft, ChevronRight, MapPin, Map, Route, Building } from 'lucide-react';
import { useI18n } from '@/locales/client';

type ClientStat = {
  id: number;
  nomEntreprise: string;
  adresseEntreprise?: string;
  stats: {
    totalPoints: number;
    totalMaps: number;
    totalItineraries: number;
  };
};

type AdminStats = {
  totalClients: number;
  totalPoints: number;
  totalMaps: number;
  totalItineraries: number;
  clients: ClientStat[];
};

export default function AdminDashboard() {
  const [data, setData] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const router = useRouter();
  const t = useI18n();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/dashboard/stats');
        if (res.status === 401 || res.status === 403) {
          toast.error('Accès refusé.');
          router.push('/dashboard');
          return;
        }
        const json = await res.json();
        setData(json);
      } catch (error) {
        toast.error('Erreur lors du chargement des statistiques');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [router]);

  const filteredClients = data?.clients?.filter(client => 
    client.nomEntreprise.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (client.adresseEntreprise && client.adresseEntreprise.toLowerCase().includes(searchTerm.toLowerCase()))
  ) || [];

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredClients.length / itemsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-lg shadow-md max-w-md">
          <div className="text-red-500 text-2xl mb-4">Erreur de chargement</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">{t("dashboards.dashboard.title")}</h1>
          <p className="text-gray-600">{t("dashboards.dashboard.soustitle")}</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard 
            title= {t("dashboards.dashboard.stats.stat_1")} 
            value={data.totalClients} 
            icon={<Building className="h-6 w-6 text-indigo-600" />}
            color="bg-indigo-50"
          />
          <StatCard 
            title={t("dashboards.dashboard.stats.stat_2")}
            value={data.totalPoints} 
            icon={<MapPin className="h-6 w-6 text-green-600" />}
            color="bg-green-50"
          />
          <StatCard 
            title={t("dashboards.dashboard.stats.stat_3")} 
            value={data.totalMaps} 
            icon={<Map className="h-6 w-6 text-blue-600" />}
            color="bg-blue-50"
          />
          <StatCard 
            title={t("dashboards.dashboard.stats.stat_4")} 
            value={data.totalItineraries} 
            icon={<Route className="h-6 w-6 text-purple-600" />}
            color="bg-purple-50"
          />
        </div>

        {/* Search and Controls */}
        <div className="bg-white p-4 rounded-xl shadow-sm mb-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Rechercher client..."
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
              />
            </div>
            <div className="text-sm text-gray-600">
              {filteredClients.length} client{filteredClients.length !== 1 ? 's' : ''} trouvé{filteredClients.length !== 1 ? 's' : ''}
            </div>
          </div>
        </div>

        {/* Clients Grid */}
        {currentItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {currentItems.map(client => (
              <div key={client.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="p-5">
                  <div className="flex items-center mb-4">
                    <div className="bg-indigo-100 p-2 rounded-lg mr-3">
                      <Building className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{client.nomEntreprise}</h3>
                    </div>
                  </div>
                  
                  {client.adresseEntreprise && (
                    <div className="flex items-start text-sm text-gray-600 mb-4">
                      <MapPin className="flex-shrink-0 h-4 w-4 text-gray-400 mr-2 mt-0.5" />
                      <span>{client.adresseEntreprise}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <StatMiniCard 
                      value={client.stats.totalPoints} 
                      label="Points" 
                      icon={<MapPin className="h-4 w-4" />}
                    />
                    <StatMiniCard 
                      value={client.stats.totalMaps} 
                      label="Cartes" 
                      icon={<Map className="h-4 w-4" />}
                    />
                    <StatMiniCard 
                      value={client.stats.totalItineraries} 
                      label="Itinéraires" 
                      icon={<Route className="h-4 w-4" />}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="text-gray-400 mb-4">{t("dashboards.dashboard.not_think")}</div>
            <button 
              onClick={() => setSearchTerm('')}
              className="text-indigo-600 hover:text-indigo-800 font-medium"
            >
              {t("dashboards.dashboard.initialize")}
            </button>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8">
            <div className="text-sm text-gray-600">
              Page {currentPage} sur {totalPages}
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => paginate(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className={`p-2 rounded-lg ${currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
              >
                <ChevronLeft className="h-5 w-5" />
              </button>
              
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => paginate(pageNum)}
                    className={`w-10 h-10 flex items-center justify-center rounded-lg ${currentPage === pageNum ? 'bg-indigo-600 text-white' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
                  >
                    {pageNum}
                  </button>
                );
              })}

              <button
                onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className={`p-2 rounded-lg ${currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'}`}
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon,
  color
}: {
  title: string;
  value: number;
  icon: React.ReactNode;
  color: string;
}) {
  return (
    <div className={`${color} p-5 rounded-xl shadow-sm`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <div className="p-3 rounded-lg bg-white bg-opacity-50">
          {icon}
        </div>
      </div>
    </div>
  );
}

function StatMiniCard({
  value,
  label,
  icon
}: {
  value: number;
  label: string;
  icon: React.ReactNode;
}) {
  return (
    <div className="bg-gray-50 p-2 rounded-lg text-center">
      <div className="flex items-center justify-center text-gray-500 mb-1">
        {icon}
        <span className="ml-1 text-xs">{label}</span>
      </div>
      <div className="font-semibold text-gray-900">{value}</div>
    </div>
  );
}