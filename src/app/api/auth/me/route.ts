import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User, { IUser } from '@/models/user'
import { connectDB } from '@/lib/mongodb'

export async function GET (req: NextRequest) {
  try {
    const token = req.cookies.get('token')?.value

    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 }
      )
    }

    // Decode token
    let decoded: { id: string; email: string }
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET!) as {
        id: string
        email: string
      }
    } catch {
      return NextResponse.json(
        { success: false, message: 'Invalid or expired token' },
        { status: 401 }
      )
    }

    // Fetch latest user data
    await connectDB()
    const user = (await User.findById<IUser>(decoded.id).lean()) as IUser | null

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      user: {
        id: (user._id as unknown as { toString: () => string }).toString(),
        email: user.email,
        name: user.name || '',
        picture: user.picture || '',
        termsAccepted: user.termsAccepted || false
      }
    })
  } catch (error) {
    console.error('AUTH ME ERROR:', error)
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    )
  }
}
