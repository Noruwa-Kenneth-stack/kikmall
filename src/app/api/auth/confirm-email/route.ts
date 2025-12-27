import { NextRequest, NextResponse } from 'next/server'
import User from '@/models/user'
import { connectDB } from '@/lib/mongodb'

export async function POST (req: NextRequest) {
  try {
    await connectDB()
    const { email, code } = await req.json()

    if (!email || !code) {
      return NextResponse.json(
        { success: false, message: 'Email and code are required' },
        { status: 400 }
      )
    }

    const user = await User.findOne({ email })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    if (user.verificationCode !== code || user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Invalid or already verified code' },
        { status: 400 }
      )
    }

    // Mark user as verified
    user.isVerified = true
    user.verificationCode = '' // Clear verification code after success
    await user.save()

    return NextResponse.json(
      { success: true, message: 'Email verified successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Verification error:', error)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
