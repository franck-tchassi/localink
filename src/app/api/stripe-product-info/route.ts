//api/stripe-product-info/route.ts
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
        { error: 'priceId requis' }, 
        { status: 400 }
      );
    }

    // Récupère le prix
    const price = await stripe.prices.retrieve(priceId);
    
    // Vérifie si le produit existe
    if (!price.product) {
      return NextResponse.json(
        { error: 'Produit non trouvé' },
        { status: 404 }
      );
    }

    // Récupère le produit
    const productId = typeof price.product === 'string' ? price.product : price.product.id;
    const product = await stripe.products.retrieve(productId);

    // Vérifie si le produit n'est pas supprimé
    if (product.deleted) {
      return NextResponse.json(
        { error: 'Le produit a été supprimé' },
        { status: 404 }
      );
    }

    // Formatage des données de réponse
    const responseData = {
      price: {
        id: price.id,
        unit_amount: price.unit_amount,
        currency: price.currency,
        recurring: price.recurring,
        type: price.type,
      },
      product: {
        id: product.id,
        name: product.name,
        description: product.description,
        images: product.images,
        metadata: product.metadata,
      },
    };

    return NextResponse.json(responseData);

  } catch (error: unknown) {
    console.error('Erreur Stripe product info:', error);

    if (error instanceof Stripe.errors.StripeError) {
      return NextResponse.json(
        { error: error.message }, 
        { status: error.statusCode || 500 }
      );
    }

    const message = error instanceof Error ? error.message : 'Erreur inconnue';
    return NextResponse.json(
      { error: message }, 
      { status: 500 }
    );
  }
}