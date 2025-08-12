import { completeRegistration } from '@/actions/auth';
import { NextRequest, NextResponse } from 'next/server';


export async function POST(req: NextRequest) {
  const { email, otp } = await req.json();

  if (!email || !otp) {
    return NextResponse.json({ 
      success: false, 
      error: "Email et OTP requis" 
    }, { status: 400 });
  }

  try {
    const result = await completeRegistration(email, otp);
    
    if (result.error) {
      return NextResponse.json({ 
        success: false, 
        error: result.error 
      }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true,
      user: result.user
    });
  } catch (err: any) {
    return NextResponse.json({ 
      success: false, 
      error: err.message || "Erreur serveur" 
    }, { status: 500 });
  }
}