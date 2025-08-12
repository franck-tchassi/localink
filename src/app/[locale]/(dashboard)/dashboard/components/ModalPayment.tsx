'use client';

import { useState } from 'react';

const prices = [
  {
    id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PRO!,
    name: 'Pro',
    description: 'Accès aux fonctionnalités avancées',
    price: '10€ / mois',
    level: 'pro',
  },
  {
    id: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_PREMIUM!,
    name: 'Premium',
    description: 'Tout le Pro + fonctionnalités exclusives',
    price: '20€ / mois',
    level: 'premium',
  },
];

export default function SubscribePage() {
  const [loadingPriceId, setLoadingPriceId] = useState<string | null>(null);

  const handleSubscribe = async (priceId: string) => {
    setLoadingPriceId(priceId);

    try {
      const res = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ priceId }),
      });

      const data = await res.json();

      if (res.ok && data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Erreur de redirection vers Stripe.');
      }
    } catch (err) {
      console.error('Erreur lors de la souscription:', err);
      alert('Erreur inattendue.');
    } finally {
      setLoadingPriceId(null);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-3xl font-bold mb-8 text-center">Choisissez votre abonnement</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {prices.map((plan) => (
          <div key={plan.id} className="border rounded-xl p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-2">{plan.name}</h2>
            <p className="text-gray-600 mb-4">{plan.description}</p>
            <p className="text-lg font-bold mb-6">{plan.price}</p>
            <button
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700 transition disabled:opacity-50"
              disabled={!!loadingPriceId}
              onClick={() => handleSubscribe(plan.id)}
            >
              {loadingPriceId === plan.id ? 'Redirection...' : 'Souscrire'}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
