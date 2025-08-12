import { NextResponse } from 'next/server';
import { prisma } from '@/db/prisma';
import { validateSessionToken } from '@/actions/auth';
import { parse } from 'cookie';


export async function GET(request: Request) {
  try {
    // Authentification
    const cookies = parse(request.headers.get('cookie') || '');
    const token = cookies.session;

    if (!token) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const sessionResult = await validateSessionToken(token);
    if (!sessionResult.user?.id) {
      return NextResponse.json({ error: "Session invalide" }, { status: 401 });
    }

    // Récupération de la liste
    const clients = await prisma.client.findMany({
      where: { userId: sessionResult.user.id },
      select: {
        id: true,
        nomEntreprise: true,
        adresseDepart: true,
        urlEntreprise: true,
        telEntreprise: true,
        motsCles: true,
        createdAt: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(clients);

  } catch (error) {
    console.error('Erreur GET /api/clients:', error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}