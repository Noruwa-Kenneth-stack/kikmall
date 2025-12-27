import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '@/models/user'
import { connectDB } from '@/lib/mongodb'
import {
  generateVerificationCode,
  sendVerificationEmail
} from '@/lib/verification'

export async function POST (req: NextRequest) {
  try {
    await connectDB()
    const { email, password, termsAccepted } = await req.json()

    if (!email || !password || termsAccepted === undefined) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email, password, and terms acceptance are required'
        },
        { status: 400 }
      )
    }

    if (!termsAccepted) {
      return NextResponse.json(
        {
          success: false,
          message: 'You must accept the Terms of Use and Privacy Policy'
        },
        { status: 400 }
      )
    }

    if (password.length < 7) {
      return NextResponse.json(
        {
          success: false,
          message: 'Password must be at least 7 characters long'
        },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const existingUser = await User.findOne({ email: normalizedEmail })
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'User already exists' },
        { status: 409 }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const verificationCode = generateVerificationCode()

    const newUser = await User.create({
      email: normalizedEmail,
      password: hashedPassword,
      verificationCode,
      isVerified: false,
      termsAccepted: true, // ✅ always true for manual signup
      provider: 'local' // ✅ mark as local signup
    })

    // Send verification email
    await sendVerificationEmail(email, verificationCode)

    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing in .env.local')
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      )
    }

    const token = jwt.sign(
      { id: newUser._id, email: newUser.email, termsAccepted: true },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json(
      {
        success: true,
        message: 'User registered successfully, please verify your email'
      },
      { status: 201 }
    )

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60,
      path: '/'
    })

    return response
  } catch (error) {
    console.error('REGISTER ERROR:', error)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
