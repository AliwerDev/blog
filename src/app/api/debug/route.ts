import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    KV_REST_API_URL_exists: !!process.env.KV_REST_API_URL,
    KV_REST_API_URL_value: process.env.KV_REST_API_URL ? process.env.KV_REST_API_URL.substring(0, 15) + '...' : null,
    KV_REST_API_TOKEN_exists: !!process.env.KV_REST_API_TOKEN,
    NODE_ENV: process.env.NODE_ENV,
  });
}
