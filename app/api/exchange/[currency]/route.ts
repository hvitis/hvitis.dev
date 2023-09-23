import { NextRequest, NextResponse } from 'next/server'

const API_URL = `http://api.exchangeratesapi.io/v1/latest?access_key=${process.env.NEXT_PUBLIC_EXCHANGE_RATES_API_KEY}`

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  // const amount = request.nextUrl.searchParams.get('amount')
  // const { currency } = params
  try {
    const data = await fetch(API_URL)
    const json = await data.json()
    return NextResponse.json(json)
  } catch {
    return NextResponse.json(
      { message: 'Something went wrong' },
      {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      }
    )
  }
}
