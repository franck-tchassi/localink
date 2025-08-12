// app/features/clients/page.tsx
import { Metadata } from "next";
import FeatureDetail from "@/components/FeatureDetail";
import { Users, FileText, Bell, PieChart } from "lucide-react";

export const metadata: Metadata = {
  title: "Gestion Clients - Localink",
  description: "Suivi complet de votre portefeuille clients",
};

export default function ClientsPage() {
  return (
    <FeatureDetail
      title="Gestion Clients"
      subtitle="Centralisez et analysez votre relation client"
      image="/features/clients-preview.jpg"
      features={[
        {
          icon: <Users className="w-5 h-5" />,
          title: "Fiche client unifiée",
          description: "Toutes les données au même endroit"
        },
        {
          icon: <FileText className="w-5 h-5" />,
          title: "Historique des interactions",
          description: "Suivi des échanges et contrats"
        },
        {
          icon: <Bell className="w-5 h-5" />,
          title: "Alertes personnalisées",
          description: "Notifications importantes"
        }
      ]}
      cta={{
        text: "Gérer mes clients",
        href: "/auth/sign-up?feature=clients"
      }}
    >
      <div className="mt-12">
        <h3 className="text-xl font-semibold mb-4">Intégrations disponibles</h3>
        
        <div className="flex flex-wrap gap-3">
          {["CRM", "Outlook", "Google Contacts", "Mailchimp", "Zapier"].map((item, index) => (
            <div key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
              {item}
            </div>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">📊 Statistiques avancées</h4>
          <p>Analysez la répartition géographique de votre clientèle et identifiez les zones à fort potentiel</p>
        </div>
      </div>
    </FeatureDetail>
  );
}