import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/user'
import { connectDB } from '@/lib/mongodb'

export async function POST (req: NextRequest) {
  try {
    const { email } = await req.json()
    await connectDB()

    const user = await User.findOneAndUpdate(
      { email },
      { termsAccepted: true },
      { new: true }
    )

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET!,
      {
        expiresIn: '7d'
      }
    )

    const response = NextResponse.json({ success: true })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('ACCEPT TERMS ERROR:', error)
    return NextResponse.json(
      { success: false, message: 'Failed to accept terms' },
      { status: 500 }
    )
  }
}
