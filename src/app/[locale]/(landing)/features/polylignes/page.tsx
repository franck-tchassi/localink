// app/features/polylignes/page.tsx
import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Génération Massive de Polylignes - Localink Pro",
  description: "Multipliez votre visibilité sur Google My Maps avec nos polylignes optimisées",
};

export default function PolylignesPage() {
  return (
    <div className="bg-white">
      {/* Hero avec valeur pro */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                <span className="text-blue-600">Polylignes stratégiques</span> pour dominer Google My Maps
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Générez automatiquement des centaines de milliers de positions, dizaines d'itinéraires et polylignes optimisés pour maximiser votre visibilité.
              </p>
              <div className="flex flex-wrap gap-4">
                <a 
                  href="/demo" 
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium"
                >
                  Voir une démo
                </a>
                <a 
                  href="/tarifs" 
                  className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg font-medium"
                >
                  Comparer les plans
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative aspect-video rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <Image
                  src="/features/kml-visibility-hero.jpg"
                  alt="Visibilité Google My Maps avec Localink"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comment <span className="text-blue-600">Localink</span> booste votre visibilité
          </h2>
          
          <div className="space-y-12">
            {/* Étape 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Configuration rapide</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600 mb-4">
                  Entrez simplement les informations de votre entreprise (nom, secteur, zone de couverture) et nos algorithmes font le reste.
                </p>
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <code className="text-sm text-gray-800">
                    {`{
  "entreprise": "Votre Marque",
  "secteur": "Restauration rapide",
  "rayon": "20 km",
  "mots-clés": ["burger", "fastfood", "livraison"]
}`}
                  </code>
                </div>
              </div>
            </div>
            
            {/* Étape 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Génération automatique</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600 mb-4">
                  Notre système crée automatiquement :
                </p>
                <ul className="grid md:grid-cols-2 gap-4 mb-4">
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Des centaines de milliers de positions stratégiques</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Des dizaines d'itinéraires optimisés</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Des polylignes de couverture précises</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-green-500 mr-2">✓</span>
                    <span>Des zones d'influence calculées</span>
                  </li>
                </ul>
              </div>
            </div>
            
            {/* Étape 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Export KML clé en main</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600 mb-4">
                  Téléchargez un fichier KML parfaitement optimisé pour Google My Maps avec :
                </p>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/features/kml-export-preview.jpg"
                    alt="Exemple d'export KML"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages concurrentiels */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Pourquoi nos <span className="text-blue-600">polylignes</span> sont uniques
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                </svg>
                Optimisation SEO
              </h3>
              <p className="text-gray-600">
                Nos polylignes intègrent automatiquement vos mots-clés stratégiques pour maximiser votre visibilité dans les recherches locales.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/>
                </svg>
                Fiabilité absolue
              </h3>
              <p className="text-gray-600">
                Algorithmes testés sur 10 000+ entreprises pour générer des positions crédibles et conformes aux guidelines de Google.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <svg className="w-6 h-6 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"/>
                </svg>
                Sécurité renforcée
              </h3>
              <p className="text-gray-600">
                Technologie brevetée qui varie intelligemment les paramètres pour une augmentation naturelle de votre visibilité sans risque de pénalité.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignage */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <blockquote className="text-xl md:text-2xl font-medium mb-8">
            "En 3 mois avec Localink, nos fiches Google My Maps sont passées de 50 à 12 000 vues/mois. Le fichier KML généré a couvert notre zone de chalandise avec une précision incroyable."
          </blockquote>
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mr-4">
              <Image
                src="/testimonials/restaurant-owner.jpg"
                alt="Directeur restaurant"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-bold">Pierre Martin</div>
              <div className="text-blue-100">Directeur, Burger & Co (12 succursales)</div>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Questions <span className="text-blue-600">fréquentes</span>
          </h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Comment Google My Maps traite-t-il ces polylignes ?</h3>
              <p className="text-gray-600">
                Nos fichiers KML sont optimisés pour être parfaitement interprétés par Google My Maps. Les polylignes apparaissent comme des couches supplémentaires, mettant en valeur votre zone d'activité de manière professionnelle.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quelle est la fréquence de mise à jour recommandée ?</h3>
              <p className="text-gray-600">
                Pour des résultats optimaux, nous recommandons de régénérer et réimporter votre fichier KML chaque mois. Nos clients pro voient en moyenne une augmentation de 30% de visibilité par cycle.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Puis-je personnaliser l'apparence des polylignes ?</h3>
              <p className="text-gray-600">
                Absolument ! Vous pouvez modifier couleurs, épaisseurs et styles directement dans notre interface avant génération du KML. Nous proposons également des templates pré-configurés.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}