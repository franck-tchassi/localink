"use client";
import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useI18n } from '@/locales/client';

interface SubscriptionPageProps {
  currentPlan: string;
  renewalDate: string;
  activeUntil: string;
  planCost: number;
  additionalSlots: number;
  subscriptionStatus: string;
  nextBillingDate: string;
  subscriptionId: string | null;
  userId: number;
}

export default function Subscription({
  currentPlan = 'Gratuit',
  renewalDate = '-',
  activeUntil = '-',
  planCost = 0,
  additionalSlots = 0,
  subscriptionStatus = 'Inactif',
  nextBillingDate = '-',
  subscriptionId = null,
  userId,
}: SubscriptionPageProps) {
  const router = useRouter();
  const t = useI18n();
  const searchParams = useSearchParams();

  const [showModal, setShowModal] = useState(false);
  const [modalPlan, setModalPlan] = useState<string | null>(null);

  // Stripe info for paid plans
  const stripePlans = [
    {
      link:
        process.env.NODE_ENV === 'development'
          ? 'https://buy.stripe.com/test_eVq9AS91IbII9RY9Hrc3m02'
          : '',
      priceId:
        process.env.NODE_ENV === 'development'
          ? 'price_1RsL4iAkgFpt9TxPpR9FIVmv'
          : '',
      price: 39.99,
      id: 'pro'
    },
    {
      link:
        process.env.NODE_ENV === 'development'
          ? 'https://buy.stripe.com/test_aFacN4gua9AA8NUf1Lc3m03'
          : '',
      priceId:
        process.env.NODE_ENV === 'development'
          ? 'price_1RsL7bAkgFpt9TxPLAd3lF1L'
          : '',
      price: 99.99,
      id: 'premium'
    }
  ];

  // Plans disponibles avec Stripe info
  const availablePlans = [
    {
      id: 'pro',
      name: 'Pro',
      price: 39.99,
      features: [
        `${t("landing.pricing.plan.plan_2.inclus.sub_1")}`,
        `${t("landing.pricing.plan.plan_2.inclus.sub_2")}`,
        `${t("landing.pricing.plan.plan_2.inclus.sub_3")}`,
        `${t("landing.pricing.plan.plan_2.inclus.sub_4")}`
      ],
      link: stripePlans.find(p => p.id === 'pro')?.link || '',
      priceId: stripePlans.find(p => p.id === 'pro')?.priceId || '',
    },
    {
      id: 'premium',
      name: 'Premium',
      price: 99.99,
      features: [
        `${t("landing.pricing.plan.plan_3.inclus.sub_1")}`,
        `${t("landing.pricing.plan.plan_3.inclus.sub_2")}`,
        `${t("landing.pricing.plan.plan_3.inclus.sub_3")}`,
        `${t("landing.pricing.plan.plan_3.inclus.sub_4")}`
      ],
      recommended: true,
      link: stripePlans.find(p => p.id === 'premium')?.link || '',
      priceId: stripePlans.find(p => p.id === 'premium')?.priceId || '',
    }
  ];

  const isCurrentPlan = (planId: string) => {
    const planMap: Record<string, string> = {
      pro: 'pro',
      premium: 'premium'
    };
    return currentPlan.toLowerCase() === planMap[planId];
  };

  useEffect(() => {
    const plan = searchParams.get("plan");
    if ((plan === "pro" || plan === "premium") && !showModal) {
      setModalPlan(plan);
      setShowModal(true);
    }
  }, [searchParams, showModal]);

  const handleCloseModal = () => {
    setShowModal(false);
    setModalPlan(null);
    router.replace('/dashboard/account/subscription', { scroll: false });
  };

  const handleUpgrade = (plan: string) => {
    setModalPlan(plan);
    setShowModal(true);
  };

  const handleCancelSubscription = async () => {
    if (!subscriptionId) return;
    try {
      const response = await fetch('/api/cancel-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ subscriptionId, userId })
      });
      const result = await response.json();
      if (result.success) {
        router.refresh();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Section Abonnement actuel */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-xl font-bold text-white">Votre abonnement</h1>
          </div>
          <div className="px-6 py-4">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-800 mb-1">Plan actuel</h2>
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold">{currentPlan}</span>
                  <Badge variant={subscriptionStatus === 'Actif' ? 'default' : 'destructive'}>
                    {subscriptionStatus}
                  </Badge>
                </div>
              </div>
              {currentPlan === 'Gratuit' && (
                <Button onClick={() => handleUpgrade('pro')} className="mt-4 md:mt-0">
                  Passer à un abonnement payant
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Prochain paiement</h3>
                <p className="text-lg font-semibold">{nextBillingDate}</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Coût du forfait</h3>
                <p className="text-lg font-semibold">{planCost.toFixed(2)} €</p>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Emplacements supplémentaires</h3>
                <p className="text-lg font-semibold">{additionalSlots}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Section Plans disponibles */}
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="bg-blue-600 px-6 py-4">
            <h1 className="text-xl font-bold text-white">Plans disponibles</h1>
          </div>
          <div className="px-6 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {availablePlans.map((plan) => (
                <div 
                  key={plan.id} 
                  className={`border rounded-lg p-6 ${
                    isCurrentPlan(plan.id) ? 'border-green-500 bg-green-50' : 
                    plan.recommended ? 'border-blue-500 ring-2 ring-blue-200' : 'border-gray-200'
                  }`}
                >
                  {isCurrentPlan(plan.id) && (
                    <div className="bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full inline-block mb-3">
                      Votre plan
                    </div>
                  )}
                  <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                  <p className="text-3xl font-bold mb-4">{plan.price.toFixed(2)} €<span className="text-sm font-normal text-gray-500">/mois</span></p>
                  <ul className="space-y-2 mb-6">
                    {plan.features.map((feature, index) => (
                      <li key={index} className="flex items-center">
                        <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  {plan.link ? (
                    <a
                      href={plan.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full"
                    >
                      <Button
                        className="w-full"
                        variant={
                          isCurrentPlan(plan.id) ? 'secondary' : 
                          plan.recommended ? 'default' : 'outline'
                        }
                        disabled={isCurrentPlan(plan.id)}
                      >
                        {isCurrentPlan(plan.id) ? 'Plan actuel' : 'Souscrire'}
                      </Button>
                    </a>
                  ) : (
                    <Button
                      className="w-full"
                      variant={
                        isCurrentPlan(plan.id) ? 'secondary' : 
                        plan.recommended ? 'default' : 'outline'
                      }
                      disabled={isCurrentPlan(plan.id)}
                    >
                      {isCurrentPlan(plan.id) ? 'Plan actuel' : 'Souscrire'}
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}