// app/api/auth/resend-code/route.ts
import { NextRequest, NextResponse } from 'next/server';
import User from '@/models/user';
import { connectDB } from '@/lib/mongodb';
import { sendVerificationEmail } from '@/lib/verification';

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const { email, verificationCode } = await req.json();

    if (!email) {
      return NextResponse.json(
        { success: false, message: 'Email is required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email });
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      );
    }

    // Update verification code
    user.verificationCode = verificationCode;
    await user.save();

    // Resend verification email
    await sendVerificationEmail(email, verificationCode);

    return NextResponse.json(
      { success: true, message: 'Verification code resent' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Resend code error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}