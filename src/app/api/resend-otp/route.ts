// app/api/resend-otp/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/db/prisma";
import redis from "@/lib/otp/redis";
import { generateOTP } from "@/lib/otp/otpUtils";
import { sendEmail } from "@/lib/otp/sendMail";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ success: false, error: "Email requis" });
  }

  const user = await prisma.user.findUnique({ where: { email } });

  if (!user) {
    return NextResponse.json({ success: false, error: "Utilisateur introuvable" });
  }

  if (user.emailVerified) {
    return NextResponse.json({ success: false, error: "Email déjà vérifié" });
  }

  const otp = generateOTP();
  await redis.set(`otp:${email}`, otp, "EX", 600); // 10 minutes

  await sendEmail(
    email,
    "Nouveau code de vérification",
    "otp-verification",
    { email, otp }
  );

  return NextResponse.json({ success: true });
}
