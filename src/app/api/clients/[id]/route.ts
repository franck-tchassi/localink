import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'cookie';
import { prisma } from '@/db/prisma';
import { validateSessionToken } from '@/actions/auth';

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookies = parse(request.headers.get('cookie') || '');
    const token = cookies.session;

    if (!token) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const sessionResult = await validateSessionToken(token);
    if (!sessionResult.user?.id) {
      return NextResponse.json({ error: "Session invalide" }, { status: 401 });
    }

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json({ error: "ID client manquant" }, { status: 400 });
    }

    const clientId = Number(id);
    if (isNaN(clientId)) {
      return NextResponse.json({ error: "ID client invalide" }, { status: 400 });
    }

    const client = await prisma.client.findUnique({
      where: {
        id: clientId,
        userId: sessionResult.user.id,
      },
      select: {
        id: true,
        nomEntreprise: true,
        urlEntreprise: true,
        telEntreprise: true,
        motsCles: true,
        adresseDepart: true,
        urlMyBusiness: true,
        createdAt: true,
      },
    });

    if (!client) {
      return NextResponse.json({ error: "Client non trouvé" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error('Erreur GET /api/clients/[id]:', error);
    return NextResponse.json({ error: "Erreur interne du serveur" }, { status: 500 });
  }
}

// supprimer  un client
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const cookies = parse(request.headers.get('cookie') || '');
    const token = cookies.session;

    if (!token) {
      return NextResponse.json({ error: "Authentification requise" }, { status: 401 });
    }

    const sessionResult = await validateSessionToken(token);
    if (!sessionResult.user?.id) {
      return NextResponse.json({ error: "Session invalide" }, { status: 401 });
    }

    const { id } = await context.params;

    const clientId = Number(id);
    if (isNaN(clientId)) {
      return NextResponse.json({ error: "ID client invalide" }, { status: 400 });
    }

    // Vérifie si le client existe bien pour cet utilisateur
    const existingClient = await prisma.client.findUnique({
      where: {
        id: clientId,
        userId: sessionResult.user.id,
      }
    });

    if (!existingClient) {
      return NextResponse.json({ error: "Client introuvable" }, { status: 404 });
    }

    // Suppression
    await prisma.client.delete({
      where: {
        id: clientId,
      }
    });

    return NextResponse.json({ message: "Client supprimé" });

  } catch (error) {
    console.error('Erreur DELETE /api/clients/[id]:', error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}