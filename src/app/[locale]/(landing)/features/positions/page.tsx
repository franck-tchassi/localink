// app/features/positions/page.tsx
import { Metadata } from "next";
import FeatureDetail from "@/components/FeatureDetail";
import { MapPin, Route, Clock, Layers } from "lucide-react";

export const metadata: Metadata = {
  title: "Positions & Routes - Localink",
  description: "Gestion avancée de vos points géographiques et itinéraires",
};

export default function PositionsPage() {
  return (
    <FeatureDetail
      title="Positions & Routes"
      subtitle="Optimisation des déplacements et zones de couverture"
      image="/features/routes-preview.jpg"
      features={[
        {
          icon: <MapPin className="w-5 h-5" />,
          title: "Gestion des POI",
          description: "Points d'intérêt personnalisés"
        },
        {
          icon: <Route className="w-5 h-5" />,
          title: "Planification d'itinéraires",
          description: "Optimisation des trajets"
        },
        {
          icon: <Clock className="w-5 h-5" />,
          title: "Analyse temporelle",
          description: "Visualisation des temps de parcours"
        }
      ]}
      cta={{
        text: "Optimiser mes itinéraires",
        href: "/auth/sign-up?feature=positions"
      }}
    >
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Applications typiques</h3>
        
        <div className="space-y-4">
          {[
            {
              title: "Logistique",
              desc: "Optimisation des tournées de livraison"
            },
            {
              title: "Services sur site",
              desc: "Planification des interventions techniques"
            },
            {
              title: "Réseaux commerciaux",
              desc: "Gestion des territoires de vente"
            }
          ].map((item, index) => (
            <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
              <h4 className="font-medium">{item.title}</h4>
              <p className="text-gray-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </FeatureDetail>
  );
}