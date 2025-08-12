import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/db/prisma';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, { apiVersion: '2025-07-30.basil' });
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

// Mapping priceId -> planType
const priceIdToPlanType: Record<string, "PRO" | "PREMIUM"> = {
  [process.env.STRIPE_PRICE_ID_PRO!]: "PRO",
  [process.env.STRIPE_PRICE_ID_PREMIUM!]: "PREMIUM",
};

enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  CANCELED = 'CANCELED',
  PAST_DUE = 'PAST_DUE',
  UNPAID = 'UNPAID',
  TRIALING = 'TRIALING',
  INCOMPLETE = 'INCOMPLETE',
  INCOMPLETE_EXPIRED = 'INCOMPLETE_EXPIRED',
}

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature');
  if (!signature) {
    return new Response(JSON.stringify({ error: 'Webhook signature missing' }), { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret ?? '');
  } catch (err: any) {
    return new Response(JSON.stringify({ error: err.message }), { status: 400 });
  }

  const { data, type: eventType } = event;

  try {
    switch (eventType) {
      // Création ou update d'un abonnement
      case 'checkout.session.completed': {
        const session = data.object as Stripe.Checkout.Session;
        if (!session.customer || !session.subscription) throw new Error('Missing customer or subscription info');
        const customerId = session.customer as string;
        const stripeSubscriptionId = session.subscription as string;

        // Récupère la subscription Stripe pour avoir priceId, dates etc.
        const sub = await stripe.subscriptions.retrieve(stripeSubscriptionId);
        const stripePriceId = Array.isArray(sub.items.data) && sub.items.data[0]?.price?.id
          ? sub.items.data[0].price.id
          : '';
        const planType = priceIdToPlanType[stripePriceId] || 'PRO'; // Fallback sur PRO par sécurité

        const currentPeriodEnd = new Date();
        const status = sub.status?.toUpperCase() as keyof typeof SubscriptionStatus;

        // Récupère l'email du customer
        const customer = await stripe.customers.retrieve(customerId);
        if (!('email' in customer) || !customer.email) throw new Error('No customer email');
        const email = customer.email;

        // Trouve ou crée le user
        let user = await prisma.user.findUnique({ where: { email } });
        if (!user) {
          user = await prisma.user.create({
            data: {
              email,
              passwordHash: '', // à adapter
              stripeCustomerId: customerId,
              subscriptionLevel: planType,
            },
          });
        } else {
          // Mise à jour du stripeCustomerId + niveau d'abonnement
          await prisma.user.update({
            where: { id: user.id },
            data: {
              stripeCustomerId: customerId,
              subscriptionLevel: planType,
            },
          });
        }

        // Ajoute ou met à jour la Subscription (1 user peut avoir plusieurs abonnements dans l'historique)
        await prisma.subscription.upsert({
          where: {
            stripeSubscriptionId,
          },
          update: {
            status: status in SubscriptionStatus ? status : 'ACTIVE',
            currentPeriodEnd,
            planType,
            stripePriceId,
          },
          create: {
            userId: user.id,
            stripeSubscriptionId,
            stripePriceId,
            status: status in SubscriptionStatus ? status : 'ACTIVE',
            currentPeriodEnd,
            planType,
          },
        });

        break;
      }

      // Suppression/annulation d'un abonnement
      case 'customer.subscription.deleted': {
        const sub = data.object as Stripe.Subscription;
        const stripeSubscriptionId = sub.id;
        const customerId = sub.customer as string;
        const status = sub.status?.toUpperCase() as keyof typeof SubscriptionStatus;
        const currentPeriodEnd = new Date();

        // Met à jour la subscription
        await prisma.subscription.updateMany({
          where: { stripeSubscriptionId },
          data: {
            status: 'CANCELED',
            currentPeriodEnd,
          },
        });

        // Met à jour l'utilisateur à FREE si plus d'abo actif
        const user = await prisma.user.findFirst({ where: { stripeCustomerId: customerId } });
        if (user) {
          // On vérifie s'il reste une subscription active
          const activeSub = await prisma.subscription.findFirst({
            where: { userId: user.id, status: 'ACTIVE', currentPeriodEnd: { gt: new Date() } },
          });
          if (!activeSub) {
            await prisma.user.update({
              where: { id: user.id },
              data: { subscriptionLevel: 'FREE' },
            });
          }
        }
        break;
      }

      default:
        // Ignore les autres events
        break;
    }
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 400 });
  }

  return NextResponse.json({ received: true });
}