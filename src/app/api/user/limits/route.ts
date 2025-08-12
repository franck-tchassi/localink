import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { validateSessionToken } from '@/actions/auth';
import { parse } from 'cookie';

const PLAN_LIMITS = {
  FREE:    { maxClients: 3,   maxPointsPerMap: 200,  maxRoutesPerMap: 3,  supportType: 'none' },
  PRO:     { maxClients: 50,  maxPointsPerMap: 2500, maxRoutesPerMap: 20, supportType: 'email' },
  PREMIUM: { maxClients: 150, maxPointsPerMap: Number.MAX_SAFE_INTEGER, maxRoutesPerMap: 50, supportType: 'priority' },
};

export async function GET(request: NextRequest) {
  try {
    const cookiesHeader = request.headers.get('cookie');
    if (!cookiesHeader) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const cookies = parse(cookiesHeader);
    const token = cookies.session;
    if (!token) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const sessionResult = await validateSessionToken(token);
    if (!sessionResult.user?.id) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    const userId = sessionResult.user.id;
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        subscriptions: {
          where: {
            status: 'ACTIVE',
            currentPeriodEnd: { gt: new Date() }
          },
          orderBy: { currentPeriodEnd: 'desc' },
          take: 1
        }
      }
    });

    if (!user) return NextResponse.json({ error: "Utilisateur non trouvé" }, { status: 404 });

    // 1. Priorité à la subscription ACTIVE Stripe (table subscriptions)
    let plan: "FREE" | "PRO" | "PREMIUM" = "FREE";
    if (user.subscriptions.length > 0) {
      plan = user.subscriptions[0].planType as "FREE" | "PRO" | "PREMIUM";
    } else if (user.subscriptionLevel === "PRO" || user.subscriptionLevel === "PREMIUM") {
      // 2. Sinon, fallback sur subscriptionLevel du user
      plan = user.subscriptionLevel as "PRO" | "PREMIUM";
    }

    const limits = PLAN_LIMITS[plan];

    // Pour info affichage dans l’UI
    const clientCount = await prisma.client.count({ where: { userId } });

    return NextResponse.json({
      plan,
      ...limits,
      currentClientCount: clientCount,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur interne" }, { status: 500 });
  }
}