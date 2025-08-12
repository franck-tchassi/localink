import { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Visibilité Maximale sur Google My Maps - Localink Pro",
  description: "Boostez votre présence locale avec des fichiers KML ultra-optimisés pour Google My Maps",
};

export default function VisibilityPage() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-blue-50 to-white py-20">
        <div className="container mx-auto px-6 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center gap-12">
            <div className="md:w-1/2">
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Boostez votre <span className="text-blue-600">visibilité locale</span> sur Google My Maps
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                Générez un fichier KML stratégique intégrant des milliers de points, itinéraires et zones pour dominer votre zone de chalandise.
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
                  Nos tarifs
                </a>
              </div>
            </div>
            <div className="md:w-1/2">
              <div className="relative aspect-video rounded-xl shadow-lg overflow-hidden border border-gray-200">
                <Image
                  src="/features/visibility-kml-hero.jpg"
                  alt="Optimisation visibilité Google My Maps"
                  fill
                  className="object-cover"
                  priority
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fonctionnement */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-6 max-w-4xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Un processus simple, <span className="text-blue-600">des résultats puissants</span>
          </h2>
          
          <div className="space-y-12">
            {/* Étape 1 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                  1
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Profil d'entreprise</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600 mb-4">
                  Renseignez les détails clés de votre activité : localisation, mots-clés, type de service. Nos algorithmes personnalisent chaque fichier KML en fonction.
                </p>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                  2
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Visibilité augmentée</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600 mb-4">
                  Nous générons automatiquement :
                </p>
                <ul className="grid md:grid-cols-2 gap-4 mb-4">
                  <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><span>Des positions géographiques cohérentes</span></li>
                  <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><span>Des trajets pertinents pour vos clients</span></li>
                  <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><span>Des polygones et zones d’influence bien définis</span></li>
                  <li className="flex items-start"><span className="text-green-500 mr-2">✓</span><span>Une cartographie crédible aux yeux de Google</span></li>
                </ul>
              </div>
            </div>

            {/* Étape 3 */}
            <div className="flex flex-col md:flex-row gap-8 items-center">
              <div className="md:w-1/3 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 text-2xl font-bold mb-4">
                  3
                </div>
                <h3 className="text-xl font-semibold text-gray-900">Export immédiat</h3>
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-600 mb-4">
                  Exportez un fichier KML prêt à l'emploi et importez-le dans Google My Maps en un clic.
                </p>
                <div className="relative aspect-video rounded-lg overflow-hidden border border-gray-200">
                  <Image
                    src="/features/kml-visibility-preview.jpg"
                    alt="Aperçu export KML visibilité"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages visibility */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 max-w-6xl">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Une <span className="text-blue-600">visibilité géographique</span> incomparable
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                🌐 Présence géolocalisée
              </h3>
              <p className="text-gray-600">
                Vos positions sont calculées selon la densité urbaine, les axes routiers, et vos clients cibles.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                🧭 Algorithme de cohérence
              </h3>
              <p className="text-gray-600">
                Notre IA empêche toute surcharge incohérente pour éviter les pénalités de Google tout en maximisant la couverture.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                📍 Indexation rapide
              </h3>
              <p className="text-gray-600">
                Grâce à nos structures KML enrichies, les zones ajoutées sont indexées plus rapidement dans Google Maps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Témoignage */}
      <section className="py-20 bg-blue-600 text-white">
        <div className="container mx-auto px-6 max-w-4xl text-center">
          <blockquote className="text-xl md:text-2xl font-medium mb-8">
            "Notre agence immobilière a vu une explosion des appels entrants grâce à la stratégie de visibilité cartographique automatisée par Localink."
          </blockquote>
          <div className="flex items-center justify-center">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white mr-4">
              <Image
                src="/testimonials/real-estate.jpg"
                alt="Responsable agence"
                width={64}
                height={64}
                className="object-cover"
              />
            </div>
            <div>
              <div className="font-bold">Claire Dubois</div>
              <div className="text-blue-100">Responsable, ImmoRéseau</div>
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
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Est-ce que Google pénalise ce type de KML ?</h3>
              <p className="text-gray-600">
                Non. Nos fichiers sont optimisés pour respecter les guidelines de Google tout en améliorant votre présence.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Combien de points puis-je générer ?</h3>
              <p className="text-gray-600">
                Cela dépend de votre plan, mais certains clients génèrent plus de 100 000 points cartographiés sans perte de performance.
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Puis-je cibler plusieurs zones géographiques ?</h3>
              <p className="text-gray-600">
                Oui. Notre outil vous permet de créer plusieurs fichiers KML adaptés à différentes zones de couverture.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
