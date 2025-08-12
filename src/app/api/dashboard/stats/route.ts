import { NextResponse } from 'next/server';
import { parse } from 'cookie';
import { prisma } from '@/db/prisma';
import { validateSessionToken } from '@/actions/auth';

export async function GET(request: Request) {
  try {
    const cookies = parse(request.headers.get('cookie') || '');
    const token = cookies.session;

    if (!token) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const sessionResult = await validateSessionToken(token);
    const userId = sessionResult.user?.id;

    if (!userId) {
      return NextResponse.json({ error: "Session invalide" }, { status: 401 });
    }

    // Récupération des clients avec leurs stats
    const clients = await prisma.client.findMany({
      where: { userId },
      include: {
        stats: true,
      },
    });

    // Calculs globaux
    const totalClients = clients.length;
    let totalPoints = 0;
    let totalMaps = 0;
    let totalItineraries = 0;

    clients.forEach(client => {
      totalPoints += client.stats?.totalPoints ?? 0;
      totalMaps += client.stats?.totalMaps ?? 0;
      totalItineraries += client.stats?.totalItineraries ?? 0;
    });

    return NextResponse.json({
      totalClients,
      totalPoints,
      totalMaps,
      totalItineraries,
      clients: clients.map(c => ({
        id: c.id,
        nomEntreprise: c.nomEntreprise,
        stats: c.stats || {
          totalPoints: 0,
          totalMaps: 0,
          totalItineraries: 0,
        }
      }))
    });

  } catch (error) {
    console.error('Erreur GET /api/dashboard/stats:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
