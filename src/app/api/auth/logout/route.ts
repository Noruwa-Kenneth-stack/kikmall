import { NextResponse } from 'next/server'

export async function POST () {
  try {
    // ✅ Clear the auth cookie
    const response = NextResponse.json({ success: true })
    response.cookies.set('token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      expires: new Date(0), // Expire immediately
      path: '/'
    })

    return response
  } catch (error) {
    console.error('Logout failed:', error)
    return NextResponse.json({ success: false }, { status: 500 })
  }
}
