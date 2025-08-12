// pages/api/user/plan/route.ts
import { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "@/db/prisma";
import { getCurrentSession } from "@/actions/auth";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const session = await getCurrentSession();
    if (!session?.user) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    // Trouver l'abonnement actif le plus récent
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        
        currentPeriodEnd: { gt: new Date() }
      },
      orderBy: { currentPeriodEnd: 'desc' }
    });

    // Si pas d'abonnement actif, utiliser le subscriptionLevel de l'utilisateur
    const plan = activeSubscription?.planType || await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { subscriptionLevel: true }
    }).then(user => user?.subscriptionLevel) || 'FREE';

    return res.status(200).json({ plan });
    
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}