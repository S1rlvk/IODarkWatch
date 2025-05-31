import { NextResponse } from 'next/server';

export async function GET() {
  // Return summary information including last updated timestamp
  const summary = {
    lastUpdated: new Date().toISOString(),
    totalVessels: 12, // This would come from your actual data source
    activeVessels: 8,
    darkVessels: 4,
    alerts: 2
  };

  return NextResponse.json(summary);
} 