//api/create-subscription-intent/route.ts

import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
});

export async function POST(req: Request) {
  try {
    const { priceId } = await req.json();

    if (!priceId) {
      return NextResponse.json(
        { error: 'priceId is required' },
        { status: 400 }
      );
    }

    // Créer un PaymentIntent pour l'abonnement
    const paymentIntent = await stripe.paymentIntents.create({
      amount: 1000, // Montant en centimes (10.00€)
      currency: 'eur',
      payment_method_types: ['card'],
      metadata: {
        priceId: priceId,
      },
      // Pour les abonnements, on utilise setup_future_usage
      setup_future_usage: 'off_session',
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });

  } catch (error: unknown) {
    console.error('Error creating payment intent:', error);
    
    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message },
        { status: error.statusCode || 500 }
      );
    }

    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}