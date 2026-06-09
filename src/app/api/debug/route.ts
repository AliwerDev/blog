import { NextResponse } from 'next/server';

export async function GET() {
  const envKeys = Object.keys(process.env).map(key => {
    const value = process.env[key];
    return {
      key,
      exists: !!value,
      length: value ? value.length : 0,
      preview: value && !key.toLowerCase().includes('secret') && !key.toLowerCase().includes('token') && !key.toLowerCase().includes('pass') && !key.toLowerCase().includes('auth') && !key.toLowerCase().includes('key') ? value.substring(0, 20) : 'HIDDEN',
    };
  });

  return NextResponse.json({
    envKeys,
    NODE_ENV: process.env.NODE_ENV,
  });
}
