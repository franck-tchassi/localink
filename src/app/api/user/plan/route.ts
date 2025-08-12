// app/api/user/plan/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import { getCurrentSession } from "@/actions/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getCurrentSession();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Trouver l'abonnement actif le plus récent
    const activeSubscription = await prisma.subscription.findFirst({
      where: {
        userId: session.user.id,
        currentPeriodEnd: { gt: new Date() }
      },
      orderBy: { currentPeriodEnd: "desc" }
    });

    // Si pas d'abonnement actif, fallback sur subscriptionLevel
    const plan =
      activeSubscription?.planType ||
      (
        await prisma.user.findUnique({
          where: { id: session.user.id },
          select: { subscriptionLevel: true }
        })
      )?.subscriptionLevel ||
      "FREE";

    return NextResponse.json({ plan });
  } catch (error) {
    console.error("Error fetching user plan:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
