import { NextResponse } from 'next/server'
import { CreateContact, ContactsApi } from '@getbrevo/brevo'

export async function POST (req: Request) {
  try {
    // ✅ 1. Parse incoming JSON body
    const { email }: { email: string } = await req.json()
    console.log('📩 New subscription request:', email)

    // ✅ 2. Validate email format
    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { message: 'Invalid email address.' },
        { status: 400 }
      )
    }

    // ✅ 3. Initialize Brevo API client
    const apiInstance = new ContactsApi()
    const apiKeyAuth = (
      apiInstance as unknown as {
        authentications: { apiKey: { apiKey: string } }
      }
    ).authentications.apiKey
    apiKeyAuth.apiKey = process.env.BREVO_API_KEY || ''

    // ✅ 4. Prepare contact payload
    const createContact: CreateContact = {
      email,
      listIds: [Number(process.env.BREVO_LIST_ID)],
      updateEnabled: true
    }

    console.log('📦 Sending payload to Brevo:', createContact)

    // ✅ 5. Make API request
    const response = await apiInstance.createContact(createContact)

    console.log('✅ Brevo API success response:', response)

    return NextResponse.json(
      { message: 'Successfully subscribed!' },
      { status: 200 }
    )
  } catch (error) {
    console.error('❌ Brevo API error occurred!')

    // ✅ Strongly typed error logging
    if (error instanceof Error) {
      console.error('💡 Error Message:', error.message)
      console.error('🛠️ Error Stack:', error.stack)
    }

    // ✅ Check if Brevo returned a response object
    const brevoError = error as {
      response?: {
        body?: unknown
        text?: string
      }
    }

    if (brevoError.response) {
      console.error(
        '🔍 Brevo Error Response:',
        brevoError.response.body || brevoError.response.text
      )
    }

    return NextResponse.json(
      { message: 'Subscription failed. Please try again later.' },
      { status: 500 }
    )
  }
}
