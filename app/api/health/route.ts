import { NextResponse } from 'next/server';

export async function GET() {
  // You could add more comprehensive health checks here, such as:
  // - Database connectivity checks
  // - External API dependency checks
  // - Memory usage checks

  return NextResponse.json(
    { 
      status: 'healthy',
      timestamp: new Date().toISOString(),
      version: process.env.NEXT_PUBLIC_APP_VERSION || '1.0.0',
      environment: process.env.NODE_ENV
    }, 
    { status: 200 }
  );
} 