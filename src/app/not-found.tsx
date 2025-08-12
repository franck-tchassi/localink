'use client';

export default function NotFound() {
  return (
    <div className="min-h-screen w-full bg-white px-4 py-20 flex justify-center">
      <div className="max-w-2xl text-center">
        {/* Logo */}
        <div className="mb-6 text-4xl font-bold text-primary">
          4logolocalisation4
        </div>

        {/* Titre */}
        <h1 className="text-2xl font-semibold text-gray-900 mb-4">
          Oops! We can’t find this page
        </h1>

        {/* Texte complémentaire */}
        <p className="text-base text-gray-700 mb-2">
          Don't worry—while we track down this missing page, let's make sure <strong>YOUR business</strong> isn't disappearing from local search results, too!
        </p>

        {/* Appel à l'action */}
        <p className="mt-4 text-lg font-medium text-blue-600 underline underline-offset-4 cursor-pointer">
          Will customers find you? Check it for free!
        </p>
      </div>
    </div>
  );
}
