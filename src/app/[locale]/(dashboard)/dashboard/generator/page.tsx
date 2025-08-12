"use client";

"use client";

import { useState, FormEvent, useEffect } from "react";
import { useSearchParams, useRouter } from 'next/navigation';
import ImportModal from '../components/ImportModal';
import GuideModal from "../components/GuideModal";
import { Badge } from "@/components/ui/badge";
import { SubscriptionPlan } from "../../../../../../generated/prisma/client";
import { useI18n } from '@/locales/client';


interface UserLimits {
  plan: "FREE" | "PRO" | "PREMIUM";
  maxClients: number;
  maxPointsPerMap: number;
  maxRoutesPerMap: number;
  currentClientCount: number;

}
interface FormData {
  nomEntreprise: string;
  urlEntreprise: string;
  urlMyBusiness: string;
  telEntreprise: string;
  motsCles: string;
  adresseDepart: string;
  nombrePoints: number;
  nombreCercles: number;
  nombreItineraires: number;
}

export default function KMLGeneratorPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [kmlContent, setKmlContent] = useState<string | null>(null);

 const [userLimits, setUserLimits] = useState<UserLimits>({
  plan: "FREE",
  maxClients: 3,
  maxPointsPerMap: 200,
  maxRoutesPerMap: 3,
  currentClientCount: 0,
  
  
 
});
  const [formData, setFormData] = useState<FormData>({
    nomEntreprise: '',
    urlEntreprise: '',
    urlMyBusiness: '',
    telEntreprise: '',
    motsCles: '',
    adresseDepart: '',
    nombrePoints: 100,
    nombreCercles: 5,
    nombreItineraires: 10
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);

  // Charger les données client depuis sessionStorage
  useEffect(() => {
    const loadClientData = () => {
      const savedData = sessionStorage.getItem('currentClientData');
      if (savedData) {
        try {
          const clientData = JSON.parse(savedData);
          setFormData(prev => ({
            ...prev,
            ...clientData,
            nombrePoints: clientData.nombrePoints || 100,
            nombreCercles: clientData.nombreCercles || 5,
            nombreItineraires: clientData.nombreItineraires || 10
          }));
          sessionStorage.removeItem('currentClientData');
        } catch (err) {
          console.error("Erreur de parsing des données client:", err);
        }
      }
    };
    loadClientData();
  }, []);

  // Charger les limites de l'utilisateur
  useEffect(() => {
    const fetchUserLimits = async () => {
      try {
        const response = await fetch('/api/user/limits');
        if (response.ok) {
          const limits = await response.json();
          setUserLimits(limits);
          
          // Mettre à jour les valeurs par défaut selon le plan
          setFormData(prev => ({
            ...prev,
            nombrePoints: Math.min(prev.nombrePoints, limits.maxPointsPerMap),
            nombreItineraires: Math.min(prev.nombreItineraires, limits.maxRoutesPerMap)
          }));
        }
      } catch (error) {
        console.error("Erreur lors du chargement des limites:", error);
      }
    };
    fetchUserLimits();
  }, []);



  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Validation des limites avant envoi
      if (formData.nombrePoints > userLimits.maxPointsPerMap) {
        throw new Error(`Limite de points dépassée (max: ${userLimits.maxPointsPerMap})`);
      }

      if (formData.nombreItineraires > userLimits.maxRoutesPerMap) {
        throw new Error(`Limite d'itinéraires dépassée (max: ${userLimits.maxRoutesPerMap})`);
      }

      const response = await fetch("/api/generate-kml", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      let json: any = null;
      try { json = await response.clone().json(); } catch {}

      // Redirection si upgrade nécessaire
      if (json?.upgradeRequired) {
        router.push(`/dashboard/account/billing?plan=${json.suggestedPlan}`);
        return;
      }

      if (!response.ok) {
        throw new Error(json?.error || "Erreur lors de la génération");
      }

      // Traitement du fichier KML généré
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Téléchargement automatique
      const a = document.createElement("a");
      a.href = url;
      a.download = `carte-seo-${formData.nomEntreprise || 'client'}.kml`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      // Préparation pour l'import
      const reader = new FileReader();
      reader.onload = (e) => {
        setKmlContent(e.target?.result as string);
        setShowImportModal(true);
      };
      reader.readAsDataURL(blob);

    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof FormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleOpenInMaps = () => {
    if (!kmlContent) return;
    
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
  };

  const t = useI18n()
  

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">{t("dashboards.generator.title_1")}</h1>
          <button
            onClick={() => setShowGuideModal(true)}
            className="inline-flex cursor-pointer items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {t("dashboards.generator.guide")}
          </button>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white shadow overflow-hidden rounded-lg">
          <div className="px-4 py-5 sm:px-6 bg-gradient-to-r from-blue-600 to-indigo-600">
            <h2 className="text-lg leading-6 font-medium text-white">
              {t("dashboards.generator.title_2")}
            </h2>
            <p className="mt-1 text-sm text-blue-100">
              {t("dashboards.generator.description")}
            </p>
          </div>
          
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6 space-y-8">
            {/* Section Entreprise */}
            <section className="space-y-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-blue-500 rounded-md p-2">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg leading-6 font-medium text-gray-900">
                  {t("dashboards.generator.info_entreprise")}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label htmlFor="nom_entreprise" className="block text-sm font-medium text-gray-700">
                    {t("dashboards.generator.name")} *
                  </label>
                  <input
                    type="text"
                    id="nom_entreprise"
                    value={formData.nomEntreprise}
                    onChange={(e) => handleChange('nomEntreprise', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="url_entreprise" className="block text-sm font-medium text-gray-700">
                    {t("dashboards.generator.site")} *
                  </label>
                  <input
                    type="url"
                    id="url_entreprise"
                    value={formData.urlEntreprise}
                    onChange={(e) => handleChange('urlEntreprise', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="url_mybusiness" className="block text-sm font-medium text-gray-700">
                    {t("dashboards.generator.url_business")} *
                  </label>
                  <input
                    type="url"
                    id="url_mybusiness"
                    value={formData.urlMyBusiness}
                    onChange={(e) => handleChange('urlMyBusiness', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-3">
                  <label htmlFor="tel_entreprise" className="block text-sm font-medium text-gray-700">
                    {t("dashboards.generator.tel")} *
                  </label>
                  <input
                    type="tel"
                    id="tel_entreprise"
                    value={formData.telEntreprise}
                    onChange={(e) => handleChange('telEntreprise', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="adresse_depart" className="block text-sm font-medium text-gray-700">
                    {t("dashboards.generator.address")} *
                  </label>
                  <input
                    type="text"
                    id="adresse_depart"
                    value={formData.adresseDepart}
                    onChange={(e) => handleChange('adresseDepart', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div className="sm:col-span-6">
                  <label htmlFor="mots_cles" className="block text-sm font-medium text-gray-700">
                    {t("dashboards.generator.cle")} * <span className="text-gray-500">(séparés par des point-virgules)</span>
                  </label>
                  <textarea
                    id="mots_cles"
                    rows={3}
                    value={formData.motsCles}
                    onChange={(e) => handleChange('motsCles', e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </section>

            {/* Section Paramètres */}
            <section className="space-y-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-2">
                  <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="ml-3 text-lg leading-6 font-medium text-gray-900">
                  {t("dashboards.generator.sittings")}
                </h3>
              </div>

              <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-3">
                <div>
                  <label htmlFor="nombre_points" className="block text-sm font-medium text-gray-700">
                    {t("dashboards.generator.localisation.title")} (max: {userLimits.maxPointsPerMap})
                  </label>
                  <input
                    type="number"
                    id="nombre_points"
                    value={formData.nombrePoints}
                    onChange={(e) => handleChange('nombrePoints', Number(e.target.value))}
                    min="1"
                    max={userLimits.maxPointsPerMap}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="nombre_cercles" className="block text-sm font-medium text-gray-700">
                    {t("dashboards.generator.zones.title")}
                  </label>
                  <input
                    type="number"
                    id="nombre_cercles"
                    value={formData.nombreCercles}
                    onChange={(e) => handleChange('nombreCercles', Number(e.target.value))}
                    min="1"
                    
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                  <p className="mt-2 text-sm text-gray-500">{t("dashboards.generator.zones.sousTitle_1")} 1 et 20 {t("dashboards.generator.zones.sousTitle_2")}</p>
                </div>

                <div>
                  <label htmlFor="nombre_itineraires" className="block text-sm font-medium text-gray-700">
                    {t("dashboards.generator.itineraire")} (max: {userLimits.maxRoutesPerMap})
                  </label>
                  <input
                    type="number"
                    id="nombre_itineraires"
                    value={formData.nombreItineraires}
                    onChange={(e) => handleChange('nombreItineraires', Number(e.target.value))}
                    min="0"
                    max={userLimits.maxRoutesPerMap}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    required
                  />
                </div>
              </div>
            </section>

           

            {/* Submit section */}
            <div className="pt-5">
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`ml-3 inline-flex justify-center cursor-pointer py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Génération en cours...
                    </>
                  ) : (
                    <>
                      <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                      Générer mon fichier KML
                    </>
                  )}
                </button>
              </div>

              {error && (
                <div className="mt-4 rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">Erreur</h3>
                      <div className="mt-2 text-sm text-red-700">
                        <p>{error}</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </form>
        </div>
      </main>
      {/* Guide Modal */}
      <GuideModal isOpen={showGuideModal} onClose={setShowGuideModal} />

      {/* Import Modal */}
      
        <ImportModal 
        isOpen={showImportModal} 
        onClose={() => setShowImportModal(false)} 
        kmlContent={kmlContent} 
      />
      
    </div>
  );
}


function LoadingSpinner() {
  return (
    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );
}

function DownloadIcon() {
  return (
    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
  );
}

function ErrorAlert({ message }: { message: string }) {
  return (
    <div className="mt-4 rounded-md bg-red-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <div className="ml-3">
          <h3 className="text-sm font-medium text-red-800">Erreur</h3>
          <div className="mt-2 text-sm text-red-700">
            <p>{message}</p>
          </div>
        </div>
      </div>
    </div>
  );
}