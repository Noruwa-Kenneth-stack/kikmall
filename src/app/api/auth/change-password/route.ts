import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '@/models/user'
import { connectDB } from '@/lib/mongodb'

export async function POST (req: NextRequest) {
  try {
    await connectDB()
    const { email, oldPassword, newPassword } = await req.json()

    if (!email || !oldPassword || !newPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 7) {
      return NextResponse.json(
        {
          success: false,
          message: 'New password must be at least 7 characters long'
        },
        { status: 400 }
      )
    }

    // Verify JWT token from cookie
    const token = req.cookies.get('token')?.value
    if (!token) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: No token provided' },
        { status: 401 }
      )
    }

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing in .env.local')
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      )
    }

    let decoded: { id: string; email: string }
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET) as {
        id: string
        email: string
      }
    } catch (error) {
      console.error('JWT verification error:', error)
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Invalid token' },
        { status: 401 }
      )
    }

    // Verify user
    const normalizedEmail = email.toLowerCase().trim()
    if (normalizedEmail !== decoded.email) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Email mismatch' },
        { status: 401 }
      )
    }

    const user = await User.findOne({ email: normalizedEmail })
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 404 }
      )
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password)
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Current password is incorrect' },
        { status: 401 }
      )
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // Update user
    user.password = hashedPassword
    await user.save()

    console.log('Password changed for user:', normalizedEmail) // Debug log

    return NextResponse.json(
      { success: true, message: 'Password changed successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('CHANGE PASSWORD ERROR:', error)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
