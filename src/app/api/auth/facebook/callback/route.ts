import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import User from '@/models/user'
import { connectDB } from '@/lib/mongodb'

export async function GET (req: NextRequest) {
  try {
    const url = new URL(req.url)
    const code = url.searchParams.get('code')

    if (!code) {
      return NextResponse.json(
        { success: false, message: 'No code provided' },
        { status: 400 }
      )
    }

    // 1. Exchange code for access token
    const tokenRes = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?${new URLSearchParams(
        {
          client_id: process.env.FACEBOOK_CLIENT_ID!,
          client_secret: process.env.FACEBOOK_CLIENT_SECRET!,
          redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/facebook/callback`,
          code
        }
      )}`
    )

    const tokenData = await tokenRes.json()
    const { access_token } = tokenData

    if (!access_token) {
      return NextResponse.json(
        { success: false, message: 'Failed to get Facebook token' },
        { status: 400 }
      )
    }

    // 2. Get user profile including picture
    const profileRes = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture.type(large)&access_token=${access_token}`
    )
    const profile = await profileRes.json()

    await connectDB()

    // 3. Find or create/update user
    let user = await User.findOne({ email: profile.email })

    if (!user) {
      user = await User.create({
        email: profile.email,
        password: null,
        name: profile.name,
        picture: profile.picture?.data?.url || '',
        isVerified: true,
         termsAccepted: true,
        provider: 'facebook'
      })

      // New Facebook user → enforce terms acceptance
      user.termsAccepted = true;
      await user.save();
    } else {
      let updated = false;
      if (!user.name) {
        user.name = profile.name
        updated = true
      }
      if (!user.picture && profile.picture?.data?.url) {
        user.picture = profile.picture.data.url
        updated = true
      }
      if (updated) await user.save()
    }

    
    // 4. Issue JWT with name + picture
    if (!process.env.JWT_SECRET) {
      console.error('JWT_SECRET is missing in .env.local')
      return NextResponse.json(
        { success: false, message: 'Server configuration error' },
        { status: 500 }
      )
    }

    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        picture: user.picture,
        termsAccepted: true
      },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )

    // 5. Send back HTML to close popup and trigger social-login-success
    const responseHtml = `
      <script>
        window.opener.postMessage({ type: "social-login-success" }, "${process.env.NEXT_PUBLIC_BASE_URL}");
        window.close();
      </script>
    `

    const response = new Response(responseHtml, {
      headers: { 'Content-Type': 'text/html' }
    })

    // Set JWT cookie
    response.headers.append(
      'Set-Cookie',
      `token=${token}; HttpOnly; Path=/; Max-Age=${
        7 * 24 * 60 * 60
      }; SameSite=Strict${
        process.env.NODE_ENV === 'production' ? '; Secure' : ''
      }`
    )

    return response
  } catch (error) {
    console.error('FACEBOOK OAUTH ERROR:', error)
    return NextResponse.json(
      { success: false, message: 'Facebook login failed' },
      { status: 500 }
    )
  }
}
