// app/api/generate-kml/route.ts

import { NextRequest, NextResponse } from 'next/server';
import polyline from '@mapbox/polyline';
import { prisma } from '@/db/prisma';
import { validateSessionToken } from '@/actions/auth';
import { parse } from 'cookie';
import { SubscriptionStatus, SubscriptionPlan, ClientStats } from '@prisma/client';

interface KMLPoint {
  Nom: string;
  Latitude: number;
  Longitude: number;
  Description: string;
}

interface UserPlanLimits {
  maxClients: number;
  maxPointsPerMap: number;
  maxRoutesPerMap: number;
  supportType: string;
}

interface KMLRequestData {
  nomEntreprise: string;
  urlEntreprise: string;
  urlMyBusiness: string;
  telEntreprise: string;
  motsCles: string;
  adresseDepart: string;
  nombrePoints: number;
  nombreCercles: number;
  nombreItineraires: number;
}

// Mappage des statuts Stripe vers Prisma
const statusMap: Record<string, SubscriptionStatus> = {
  active: 'ACTIVE',
  canceled: 'CANCELED',
  past_due: 'PAST_DUE',
  unpaid: 'UNPAID',
  trialing: 'TRIALING',
  incomplete: 'INCOMPLETE',
  incomplete_expired: 'INCOMPLETE_EXPIRED'
};

async function getUserPlanLimits(userId: number): Promise<UserPlanLimits> {
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

  if (!user) throw new Error('User not found');

  if (user.subscriptionLevel === 'PRO') {
    return {
      maxClients: 50,
      maxPointsPerMap: 2500,
      maxRoutesPerMap: 20,
      supportType: 'email'
    };
  } else if (user.subscriptionLevel === 'PREMIUM') {
    return {
      maxClients: 150,
      maxPointsPerMap: Number.MAX_SAFE_INTEGER,
      maxRoutesPerMap: 50,
      supportType: 'priority'
    };
  }

  if (user.subscriptions.length > 0) {
    const subscription = user.subscriptions[0];
    
    if (subscription.planType === 'PRO') {
      return {
        maxClients: 50,
        maxPointsPerMap: 2500,
        maxRoutesPerMap: 20,
        supportType: 'email'
      };
    } else if (subscription.planType === 'PREMIUM') {
      return {
        maxClients: 150,
        maxPointsPerMap: Number.MAX_SAFE_INTEGER,
        maxRoutesPerMap: 50,
        supportType: 'priority'
      };
    }
  }

  return {
    maxClients: 3,
    maxPointsPerMap: 200,
    maxRoutesPerMap: 3,
    supportType: 'none'
  };
}

function generateDataPoints(data: KMLRequestData, center: { lat: number; lng: number }) {
  const keywords = data.motsCles.split(';').map(kw => kw.trim()).filter(Boolean);
  if (!keywords.length) return { points: [], circleRadii: [] };

  const companyDescription =
    `${data.nomEntreprise} — <a href="${data.urlEntreprise}" target="_blank">Site web</a>, Tel : <a href="tel:${data.telEntreprise}">${data.telEntreprise}</a>`;

  const allPoints: KMLPoint[] = [];
  const circleRadii: number[] = [];
  let keywordIndex = 0;
  const pointsPerCircle = Math.max(1, Math.floor(data.nombrePoints / data.nombreCercles));
  const circleSpacing = 0.05;
  const firstCircleRadius = 0.04;

  for (let i = 0; i < data.nombreCercles; i++) {
    const currentRadius = firstCircleRadius + (i * circleSpacing);
    circleRadii.push(currentRadius);

    for (let j = 0; j < pointsPerCircle; j++) {
      const angle = (2 * Math.PI / pointsPerCircle) * j;
      const latOffset = currentRadius * Math.sin(angle);
      const lngOffset = currentRadius * Math.cos(angle) / Math.cos(center.lat * Math.PI / 180);
      const currentKeyword = keywords[keywordIndex % keywords.length];

      allPoints.push({
        Nom: currentKeyword,
        Latitude: center.lat + latOffset,
        Longitude: center.lng + lngOffset,
        Description: `<b>Service :</b> ${currentKeyword}<br>${companyDescription}`,
      });
      keywordIndex++;
    }
  }
  return { points: allPoints, circleRadii };
}

async function generateKMLString(
  data: KMLRequestData,
  center: { lat: number; lng: number },
  points: KMLPoint[],
  circleRadii: number[]
): Promise<string> {
  const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

  const createCircleCoords = (lat: number, lng: number, radius: number, segments = 100) => {
    let coords = '';
    for (let i = 0; i <= segments; i++) {
      const angle = (2 * Math.PI / segments) * i;
      const dx = radius * Math.cos(angle) / Math.cos(lat * Math.PI / 180);
      const dy = radius * Math.sin(angle);
      coords += `${lng + dx},${lat + dy},0\n`;
    }
    return coords;
  };

  let kmlContent = `<?xml version="1.0" encoding="UTF-8"?>
<kml xmlns="http://www.opengis.net/kml/2.2">
  <Document>
    <name>Carte SEO pour ${data.nomEntreprise}</name>
    <Style id="poly-red"><PolyStyle><color>640000ff</color></PolyStyle></Style>
    <Style id="poly-blue"><PolyStyle><color>64ff0000</color></PolyStyle></Style>
    <Style id="poly-green"><PolyStyle><color>6400ff00</color></PolyStyle></Style>
    <Style id="route-style"><LineStyle><color>ff0000ff</color><width>4</width></LineStyle></Style>
`;

  const polyColors = ['#poly-red', '#poly-blue', '#poly-green'];
  let innerRadius = 0;
  for (let i = 0; i < circleRadii.length; i++) {
    const outerRadius = circleRadii[i];
    kmlContent += `<Placemark>
      <name>Zone ${i + 1}</name>
      <styleUrl>${polyColors[i % polyColors.length]}</styleUrl>
      <Polygon>
        <outerBoundaryIs><LinearRing><coordinates>${createCircleCoords(center.lat, center.lng, outerRadius)}</coordinates></LinearRing></outerBoundaryIs>
        ${innerRadius > 0 ? `<innerBoundaryIs><LinearRing><coordinates>${createCircleCoords(center.lat, center.lng, innerRadius)}</coordinates></LinearRing></innerBoundaryIs>` : ''}
      </Polygon>
    </Placemark>
`;
    innerRadius = outerRadius;
  }

  for (const point of points) {
    kmlContent += `<Placemark>
      <name>${point.Nom}</name>
      <description><![CDATA[${point.Description}]]></description>
      <Point><coordinates>${point.Longitude},${point.Latitude},0</coordinates></Point>
    </Placemark>
`;
  }

  if (points.length > 0 && data.nombreItineraires > 0) {
    for (let i = 0; i < data.nombreItineraires; i++) {
      const destPoint = points[Math.floor(i * (points.length / data.nombreItineraires))];
      try {
        const response = await fetch(
          "https://routes.googleapis.com/directions/v2:computeRoutes",
          {
            method: 'POST',
            headers: {
              "Content-Type": "application/json",
              "X-Goog-Api-Key": GOOGLE_API_KEY!,
              "X-Goog-FieldMask": "routes.polyline.encodedPolyline"
            },
            body: JSON.stringify({
              origin: { location: { latLng: { latitude: center.lat, longitude: center.lng } } },
              destination: { location: { latLng: { latitude: destPoint.Latitude, longitude: destPoint.Longitude } } },
              travelMode: "DRIVE",
            })
          }
        );
        if (!response.ok)
          throw new Error(`Google Routes API error: ${response.statusText}`);
        const routeData = await response.json();

        if (routeData.routes && routeData.routes.length > 0) {
          const encodedPolyline = routeData.routes[0].polyline.encodedPolyline;
          const decodedCoords = polyline
            .decode(encodedPolyline)
            .map(([lat, lng]) => `${lng},${lat},0`)
            .join('\n');
          kmlContent += `<Placemark>
            <name>Itinéraire ${i + 1}</name>
            <styleUrl>#route-style</styleUrl>
            <LineString><coordinates>${decodedCoords}</coordinates></LineString>
          </Placemark>
`;
        }
      } catch (error) {
        console.error("Route generation error:", error);
      }
    }
  }

  kmlContent += `  </Document>
</kml>`;

  return kmlContent;
}

export async function POST(request: NextRequest) {
  try {
    // Auth
    const cookiesHeader = request.headers.get('cookie');
    if (!cookiesHeader) {
      return new NextResponse(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }

    const cookies = parse(cookiesHeader);
    const token = cookies.session;

    if (!token) {
      return new NextResponse(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }

    const sessionResult = await validateSessionToken(token);
    if (!sessionResult.user || !sessionResult.user.id) {
      return new NextResponse(JSON.stringify({ error: "Non autorisé" }), { status: 401 });
    }

    const userId = sessionResult.user.id;
    const data: KMLRequestData = await request.json();
    const GOOGLE_API_KEY = process.env.NEXT_PUBLIC_GOOGLE_API_KEY;

    if (!GOOGLE_API_KEY) {
      return new NextResponse(JSON.stringify({ error: "Clé API Google non configurée." }), { status: 500 });
    }

    // Vérification des limites du plan
    const planLimits = await getUserPlanLimits(userId);

    // Nombre de clients déjà créés
    const clientCount = await prisma.client.count({
      where: { userId }
    });

    if (clientCount >= planLimits.maxClients) {
      return NextResponse.json(
        { 
          upgradeRequired: true, 
          suggestedPlan: planLimits.maxClients <= 3 ? "pro" : "premium",
          limit: planLimits.maxClients,
          current: clientCount
        },
        { status: 200 }
      );
    }
    if (data.nombrePoints > planLimits.maxPointsPerMap) {
      return NextResponse.json(
        { 
          upgradeRequired: true, 
          suggestedPlan: planLimits.maxPointsPerMap === 200 ? "pro" : "premium",
          limit: planLimits.maxPointsPerMap,
          requested: data.nombrePoints
        },
        { status: 200 }
      );
    }

    if (data.nombreItineraires > planLimits.maxRoutesPerMap) {
      return NextResponse.json(
        { 
          upgradeRequired: true, 
          suggestedPlan: planLimits.maxRoutesPerMap === 3 ? "pro" : "premium",
          limit: planLimits.maxRoutesPerMap,
          requested: data.nombreItineraires
        },
        { status: 200 }
      );
    }

    // Upsert du client
    const client = await prisma.client.upsert({
      where: {
        userId_nomEntreprise: {
          userId,
          nomEntreprise: data.nomEntreprise,
        }
      },
      update: {
        urlEntreprise: data.urlEntreprise,
        telEntreprise: data.telEntreprise,
        motsCles: data.motsCles,
        urlMyBusiness: data.urlMyBusiness || "",
        adresseDepart: data.adresseDepart,
        updatedAt: new Date(),
      },
      create: {
        userId,
        nomEntreprise: data.nomEntreprise,
        urlEntreprise: data.urlEntreprise,
        urlMyBusiness: data.urlMyBusiness || "",
        telEntreprise: data.telEntreprise,
        motsCles: data.motsCles,
        adresseDepart: data.adresseDepart,
      },
      include: {
        stats: true
      }
    });

    // Géocoder l'adresse de départ
    const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(data.adresseDepart)}&key=${GOOGLE_API_KEY}`;
    const geocodeResponse = await fetch(geocodeUrl);
    const geocodeData = await geocodeResponse.json();

    if (!geocodeData.results || geocodeData.results.length === 0) {
      return new NextResponse(JSON.stringify({ error: `Adresse introuvable: ${data.adresseDepart}` }), { status: 400 });
    }

    const center = geocodeData.results[0].geometry.location;

    // Générer les données
    const { points, circleRadii } = generateDataPoints(data, center);
    if (points.length === 0) {
      return new NextResponse(JSON.stringify({ error: "Aucun mot-clé fourni, impossible de générer les points." }), { status: 400 });
    }

    // KML generation
    const kmlString = await generateKMLString(data, center, points, circleRadii);

    // Mise à jour des statistiques du client
if (!client.statsId) {
  // Crée les stats si elles n'existent pas
  const stats = await prisma.clientStats.create({
    data: {
      totalPoints: points.length,
      totalMaps: 1,
      totalItineraries: data.nombreItineraires,
    }
  });
  
  // Lie les stats au client
  await prisma.client.update({
    where: { id: client.id },
    data: { statsId: stats.id }
  });
} else {
  // Met à jour les stats existantes
  await prisma.clientStats.update({
    where: { id: client.statsId },
    data: {
      totalPoints: { increment: points.length },
      totalMaps: { increment: 1 },
      totalItineraries: { increment: data.nombreItineraires },
    }
  });
}

    const fileName = `carte_seo_${data.nomEntreprise.replace(/\s+/g, '_').toLowerCase()}.kml`;

    return new Response(kmlString, {
      status: 200,
      headers: {
        'Content-Type': 'application/vnd.google-earth.kml+xml',
        'Content-Disposition': `attachment; filename="${fileName}"`,
      },
    });

  } catch (error: unknown) {
    console.error(error);
    const message = error instanceof Error ? error.message : "Une erreur interne est survenue.";
    return new NextResponse(JSON.stringify({ error: message }), { status: 500 });
  }
}