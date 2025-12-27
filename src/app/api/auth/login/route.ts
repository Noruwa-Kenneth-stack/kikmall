import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import User from '@/models/user'
import { connectDB } from '@/lib/mongodb'

export async function POST (req: NextRequest) {
  try {
    await connectDB()
    const body = await req.json()

    // Check if social login
    if (body.provider) {
      const { email, name, picture } = body

      if (!email) {
        return NextResponse.json(
          { success: false, message: 'Email is required for social login' },
          { status: 400 }
        )
      }

      // Find or create/update user
      const user = await User.findOneAndUpdate(
        { email },
        {
          $set: {
            name: name || '',
            picture: picture || '',
            isVerified: true,
            termsAccepted: true,
            provider: body.provider
          }
        },
        { upsert: true, new: true }
      )

      // Generate JWT with latest data
      const token = jwt.sign(
        {
          id: user._id,
          email: user.email,
          name: user.name || '',
          picture: user.picture || '',
          termsAccepted: user.termsAccepted
        },
        process.env.JWT_SECRET!,
        { expiresIn: '7d' }
      )

      const response = NextResponse.json(
        { success: true, message: 'Social login successful' },
        { status: 200 }
      )

      response.cookies.set('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60,
        path: '/'
      })

      return response
    }

    // Normal login flow
    const { email, password } = body
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Email and password are required' },
        { status: 400 }
      )
    }

    const normalizedEmail = email.toLowerCase().trim()
    const user = await User.findOne({ email: normalizedEmail })

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'User not found' },
        { status: 401 }
      )
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, message: 'Please verify your email first' },
        { status: 403 }
      )
    }

    if (!user.termsAccepted) {
      return NextResponse.json(
        {
          success: false,
          message:
            'You must accept the Terms of Use and Privacy Policy before logging in'
        },
        { status: 403 }
      )
    }

    const isMatch = await bcrypt.compare(password, user.password || '')
    if (!isMatch) {
      return NextResponse.json(
        { success: false, message: 'Invalid password' },
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

    // Generate JWT
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name || '',
        picture: user.picture || '',
        termsAccepted: user.termsAccepted
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    const response = NextResponse.json(
      { success: true, message: 'Login successful' },
      { status: 200 }
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
    console.error('LOGIN ERROR:', error)
    return NextResponse.json(
      { success: false, message: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
