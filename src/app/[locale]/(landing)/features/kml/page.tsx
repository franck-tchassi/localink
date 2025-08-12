// app/features/kml/page.tsx
import { Metadata } from "next";

import { CheckCircle, Upload, Palette, Download, Code } from "lucide-react";
import { FeatureDetail } from "@/components/FeatureDetail";

export const metadata: Metadata = {
  title: "Génération KML - Localink",
  description: "Transformez vos données en fichiers KML optimisés pour Google My Maps",
};

export default function KMLPage() {
  return (
    <FeatureDetail
      title="Génération KML"
      subtitle="Optimisation pour Google My Maps"
      image="/features/kml-preview.jpg"
      features={[
        {
          
          title: "Import multiple",
          description: "Importez depuis Excel, CSV ou APIs"
        },
        {
          
          title: "Style avancé",
          description: "Personnalisation des icônes et couleurs"
        },
        {
        
          title: "Export instantané",
          description: "Téléchargement en KML/KMZ"
        }
      ]}
      cta={{
        text: "Essayer la génération KML",
        href: "/auth/sign-up?feature=kml"
      }}
    >
      <div className="grid md:grid-cols-2 gap-8 mt-12">
        <div>
          <h3 className="text-xl font-semibold mb-4">Fonctionnalités clés</h3>
          <ul className="space-y-3">
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Conversion automatique des adresses en coordonnées GPS</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Gestion des catégories et filtres</span>
            </li>
            <li className="flex items-start">
              <CheckCircle className="h-5 w-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
              <span>Modèles prédéfinis pour différents usages</span>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Cas d'utilisation</h3>
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Pour les entreprises :</h4>
            <p>Visualisez vos points de vente, zones de livraison ou territoires couverts</p>
            
            <h4 className="font-medium mt-4 mb-2">Pour les collectivités :</h4>
            <p>Cartographiez vos équipements publics et infrastructures</p>
          </div>
        </div>
      </div>
    </FeatureDetail>
  );
}