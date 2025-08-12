"use client";

import { useState, useEffect } from 'react';
import {
  Check,
  MapPin,
  Globe,
  BarChart2,
  Shield,
  Route,
  Layers
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import FAQSection from '@/components/layout/FAQSection';
import HighlightText from '@/components/layout/HighlightText';
import { useI18n } from '@/locales/client';
import { useRouter } from 'next/navigation';
import { getCurrentSession } from '@/actions/auth';

// Base type for all plans
type PlanBase = {
  id: string;
  name: string;
  price: string;
  period: string;
  description: string;
  cta: string;
  popular: boolean;
  features: string[];
  action: (plan?: Plan) => void;
};

// Extended type for paid plans
type PlanPayant = PlanBase & {
  link: string;
  priceId: string;
};

type Plan = PlanBase | PlanPayant;

export default function PricingPage() {
  const t = useI18n();
  const router = useRouter();
  const [session, setSession] = useState<any | null>(null);
  const [userPlan, setUserPlan] = useState<string | null>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const session = await getCurrentSession();
      setSession(session);
    };
    checkAuth();
  }, []);

  

  const isAuthenticated = !!session?.user;

  // Ajoute cet useEffect :
  useEffect(() => {
    if (!isAuthenticated) return;
    fetch('/api/user/limits')
      .then((res) => res.ok ? res.json() : null)
      .then((data) => {
        if (data && data.plan) setUserPlan(data.plan.toLowerCase());
      });
  }, [isAuthenticated]);

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
      price: '39.99$',
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
      price: '99.99$',
      id: 'premium'
    }
  ];

  const plans: Plan[] = [
    {
      id: 'free',
      name: `${t('landing.pricing.plan.plan_1.title')}`,
      price: '0$',
      period: `/${t('landing.pricing.plan.plan_1.month')}`,
      description: `${t('landing.pricing.plan.plan_1.subtitle')}`,
       cta:
        userPlan === 'free'
          ? 'Votre plan actuel'
          : isAuthenticated
          ? t('landing.pricing.plan.plan_1.signin')
          : t('landing.pricing.plan.plan_1.signin'),
      popular: false,
      features: [
        `${t('landing.pricing.plan.plan_1.inclus.sub_1')}`,
        `${t('landing.pricing.plan.plan_1.inclus.sub_2')}`,
        `${t('landing.pricing.plan.plan_1.inclus.sub_3')}`
      ],
      action: () => {
        if (!isAuthenticated) {
          router.push('/auth/sign-in');
        }
        // Ne rien faire si déjà connecté
      }
    },
    {
      ...{
        id: 'pro',
        name: `${t('landing.pricing.plan.plan_2.title')}`,
        price: '39.99$',
        period: `/${t('landing.pricing.plan.plan_2.month')}`,
        description: `${t('landing.pricing.plan.plan_2.subtitle')}`,
        cta:
        userPlan === 'pro'
          ? 'Votre plan actuel'
          : t('landing.pricing.plan.plan_2.signin'),
        popular: true,
        features: [
          `${t('landing.pricing.plan.plan_2.inclus.sub_1')}`,
          `${t('landing.pricing.plan.plan_2.inclus.sub_2')}`,
          `${t('landing.pricing.plan.plan_2.inclus.sub_3')}`,
          `${t('landing.pricing.plan.plan_2.inclus.sub_4')}`
        ],
       action: (plan?: Plan) => {
        if (!isAuthenticated) {
          router.push('/auth/sign-in');
        } else if ("link" in plan! && plan!.link) {
          window.open(plan!.link, "_blank");
        }
      },
      },
      ...stripePlans.find((p) => p.id === 'pro')
    },
    {
      ...{
        id: 'premium',
        name: `${t('landing.pricing.plan.plan_3.title')}`,
        price: '99.99$',
        period: `/${t('landing.pricing.plan.plan_3.month')}`,
        description: `${t('landing.pricing.plan.plan_3.subtitle')}`,
        cta:
        userPlan === 'premium'
          ? 'Votre plan actuel'
          : t('landing.pricing.plan.plan_3.signin'),
        popular: false,
        features: [
          `${t('landing.pricing.plan.plan_3.inclus.sub_1')}`,
          `${t('landing.pricing.plan.plan_3.inclus.sub_2')}`,
          `${t('landing.pricing.plan.plan_3.inclus.sub_3')}`,
          `${t('landing.pricing.plan.plan_3.inclus.sub_4')}`
        ],
        action: (plan?: Plan) => {
        if (!isAuthenticated) {
          router.push('/auth/sign-in');
        } else if ("link" in plan! && plan!.link) {
          window.open(plan!.link, "_blank");
        }
      },
      },
      ...stripePlans.find((p) => p.id === 'premium')
    }
  ];

  const features = [
    {
      icon: <Layers className="w-5 h-5 text-blue-500" />,
      title: `${t('landing.compare_plan.features.title_1')}`,
      description: `${t('landing.compare_plan.features.subtitle_1')}`
    },
    {
      icon: <MapPin className="w-5 h-5 text-blue-500" />,
      title: `${t('landing.compare_plan.features.title_2')}`,
      description: `${t('landing.compare_plan.features.subtitle_2')}`
    },
    {
      icon: <Route className="w-5 h-5 text-blue-500" />,
      title: `${t('landing.compare_plan.features.title_3')}`,
      description: `${t('landing.compare_plan.features.subtitle_3')}`
    },
    {
      icon: <Globe className="w-5 h-5 text-blue-500" />,
      title: `${t('landing.compare_plan.features.title_4')}`,
      description: `${t('landing.compare_plan.features.subtitle_4')}`
    },
    {
      icon: <BarChart2 className="w-5 h-5 text-blue-500" />,
      title: `${t('landing.compare_plan.features.title_5')}`,
      description: `${t('landing.compare_plan.features.subtitle_5')}`
    },
    {
      icon: <Shield className="w-5 h-5 text-blue-500" />,
      title: `${t('landing.compare_plan.features.title_6')}`,
      description: `${t('landing.compare_plan.features.subtitle_6')}`
    }
  ];

  if (isAuthenticated === null) {
    return (
      <div className="flex justify-center items-center h-screen">Chargement...</div>
    );
  }

  return (
    <main className="py-16 px-4 sm:px-6 lg:px-8" aria-label="Tarification">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            {t('landing.pricing.title_1')}{' '}
            <HighlightText variant="fancy-slant" color="blue">
              {t('landing.pricing.title_2')}
            </HighlightText>
          </h1>
          <p className="mt-6 text-xl text-gray-600 max-w-3xl mx-auto">
            {t('landing.pricing.subtitle')}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={index}
              className={`relative rounded-2xl shadow-lg overflow-hidden border transition-all duration-300 hover:shadow-xl ${
                plan.popular
                  ? 'border-blue-500 ring-2 ring-blue-200 transform hover:-translate-y-1'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 right-0 bg-blue-500 text-white px-4 py-1 text-sm font-bold transform translate-x-2 -translate-y-2 rotate-6">
                  RECOMMANDÉ
                </div>
              )}

              <div className="p-8 bg-white">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  {plan.name}
                </h2>
                <p className="text-gray-600 mb-6">{plan.description}</p>
                <div className="flex items-baseline mb-6">
                  <span className="text-5xl font-bold text-gray-900">
                    {plan.price}
                  </span>
                  <span className="ml-1 text-lg text-gray-500">
                    {plan.period}
                  </span>
                </div>
                <Button
                  className={`w-full py-6 text-lg transition-all ${
                    plan.popular
                      ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-lg'
                      : plan.id === 'free' && isAuthenticated
                      ? 'bg-gray-300 cursor-not-allowed'
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                  }`}
                  onClick={() => plan.action(plan)}
                  disabled={plan.id === 'free' && isAuthenticated}
                >
                  {plan.cta}
                </Button>
              </div>

              <div className="border-t border-gray-200 bg-gray-50 p-8">
                <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wide mb-4">
                  {t('landing.pricing.plan.plan_1.inclus.title')}
                </h3>
                <ul className="space-y-3">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start">
                      <Check className="text-green-500 mt-0.5 mr-3 flex-shrink-0" />
                      <span className="text-gray-700">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {/* Feature comparison */}
        <div className="mt-24 max-w-6xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-50 to-gray-50 py-8 px-6">
            <h2 className="text-3xl font-bold text-center text-gray-900">
              {t('landing.compare_plan.title')}
            </h2>
            <p className="mt-2 text-center text-gray-500 max-w-2xl mx-auto">
              {t('landing.compare_plan.sub_title')}
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="py-4 px-6 text-left w-1/3 min-w-[300px] bg-gray-50">
                    <span className="sr-only">Fonctionnalités</span>
                  </th>
                  {plans.map((plan, index) => (
                    <th
                      key={index}
                      className={`py-4 px-6 text-center ${
                        plan.popular ? 'bg-blue-50' : 'bg-gray-50'
                      }`}
                    >
                      <div className="flex flex-col items-center">
                        <span className="font-bold text-lg">{plan.name}</span>
                        <span className="text-sm text-gray-500">
                          {plan.price}
                          {plan.period}
                        </span>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {features.map((feature, index) => (
                  <tr
                    key={index}
                    className="border-b border-gray-200 last:border-b-0 hover:bg-gray-50"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center">
                        <div className="flex-shrink-0">{feature.icon}</div>
                        <div className="ml-4">
                          <div className="font-medium text-gray-900">
                            {feature.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {feature.description}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Gratuit */}
                    <td className="py-4 px-6 text-center">
                      {index < 3 ? (
                        <Check className="mx-auto text-green-500" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Professionnel */}
                    <td className="py-4 px-6 text-center bg-blue-50">
                      {index < 5 ? (
                        <Check className="mx-auto text-green-500" />
                      ) : (
                        <span className="text-gray-400">—</span>
                      )}
                    </td>

                    {/* Premium */}
                    <td className="py-4 px-6 text-center">
                      <Check className="mx-auto text-green-500" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="bg-gray-50 px-6 py-4 text-center text-sm text-gray-500">
            {t('landing.compare_plan.features.footer')}
          </div>
        </div>

        <FAQSection />
      </div>
    </main>
  );
}