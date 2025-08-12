

import { getCurrentSession } from '@/actions/auth';
import { prisma } from '@/db/prisma';
import Subscription from './Subscription';


export default async function SubscriptionLayout() {
  const { user } = await getCurrentSession();

  if (!user) {
    throw new Error('Non autorisé');
  }

  // Récupération de l'utilisateur et de ses abonnements actifs
  const userData = await prisma.user.findUnique({
    where: { id: user.id },
    include: {
      subscriptions: {
        where: {
          status: 'ACTIVE',
          currentPeriodEnd: { gt: new Date() },
        },
        orderBy: { currentPeriodEnd: 'desc' },
        take: 1,
      },
      clients: true,
    },
  });

  if (!userData) {
    throw new Error('Utilisateur non trouvé');
  }

  // Détermination du plan actuel, du coût et des dates
  let currentPlan = 'Gratuit';
  let planCost = 0;
  let renewalDate = '-';
  let activeUntil = '-';
  let additionalSlots = 0;
  let subscriptionStatus = 'Inactif';
  let nextBillingDate = '-';
  let subscriptionId = null;

  // S'il y a une subscription ACTIVE (donc payante et à jour)
  if (userData.subscriptions.length > 0) {
    const subscription = userData.subscriptions[0];
    subscriptionId = subscription.id;
    subscriptionStatus = 'Actif';

    switch (subscription.planType) {
      case 'PRO':
        currentPlan = 'Pro';
        planCost = 39.99;
        break;
      case 'PREMIUM':
        currentPlan = 'Premium';
        planCost = 99.99;
        break;
      default:
        currentPlan = 'Gratuit';
    }

    renewalDate = new Date(subscription.currentPeriodEnd).toLocaleDateString('fr-FR');
    activeUntil = renewalDate;
    nextBillingDate = renewalDate;
  } else {
    // Pas d'abo Stripe actif : fallback sur user.subscriptionLevel (pour éviter incohérences)
    switch (userData.subscriptionLevel) {
      case 'PRO':
        currentPlan = 'Pro';
        planCost = 39.99;
        subscriptionStatus = 'Actif';
        break;
      case 'PREMIUM':
        currentPlan = 'Premium';
        planCost = 99.99;
        subscriptionStatus = 'Actif';
        break;
      default:
        currentPlan = 'Gratuit';
    }
  }

  // Calcul du nombre d'emplacements supplémentaires (clients au-delà du quota du plan)
  const includedSlots =
    currentPlan === 'Pro' ? 5 :
    currentPlan === 'Premium' ? 10 : 1;
  additionalSlots = Math.max(0, (userData.clients?.length || 0) - includedSlots);

  return (
    <Subscription
      currentPlan={currentPlan}
      renewalDate={renewalDate}
      activeUntil={activeUntil}
      planCost={planCost}
      additionalSlots={additionalSlots}
      subscriptionStatus={subscriptionStatus}
      nextBillingDate={nextBillingDate}
      subscriptionId={subscriptionId}
      userId={user.id}
    />
  );
}