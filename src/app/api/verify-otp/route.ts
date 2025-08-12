// app/api/verify-otp/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { verifyOTP } from '@/lib/otp/otpUtils';
import { prisma } from '@/db/prisma';

export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ success: false, error: "Champs requis manquants" });
  }

  try {
    await verifyOTP(email, otp);

    await prisma.user.update({
      where: { email },
      data: { emailVerified: new Date() },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message });
  }
}
