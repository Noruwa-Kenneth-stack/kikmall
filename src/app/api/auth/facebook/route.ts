import { NextResponse } from 'next/server'

export async function GET () {
  const rootUrl = 'https://www.facebook.com/v18.0/dialog/oauth'

  const options = {
    client_id: process.env.FACEBOOK_CLIENT_ID!,
    redirect_uri: `${process.env.NEXT_PUBLIC_BASE_URL}/api/auth/facebook/callback`,
    scope: 'email,public_profile',
    response_type: 'code',
    auth_type: 'rerequest' // ensures re-prompt if user declined before
  }

  const qs = new URLSearchParams(options)
  return NextResponse.redirect(`${rootUrl}?${qs.toString()}`)
}
