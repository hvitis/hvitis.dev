import { NextResponse } from 'next/server'

const CONVERTIO_URL = `https://api.convertkit.com/v3/forms/${process.env.NEXT_PUBLIC_CONVERTIO_FORM_ID}/subscribe`
const api_key = process.env.NEXT_PUBLIC_CONVERTIO_API_KEY

export async function GET(request: Request) {
  return NextResponse.json({ message: 'Oops!' })
}

export async function POST(request: Request) {
  const { email } = await request.json()

  const convertio = await fetch(CONVERTIO_URL, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    // mode: 'cors', // no-cors, *cors, same-origin
    // cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    // credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
    },
    // redirect: 'follow', // manual, *follow, error
    // referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify({ email, api_key }), // body data type must match "Content-Type" header
  })
  const convertio_data = await convertio.json()
  console.log(convertio_data)

  return NextResponse.json({ message: 'Jupi1' })
}
