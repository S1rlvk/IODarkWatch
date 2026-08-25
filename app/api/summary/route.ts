import { NextResponse } from 'next/server';
import { generateVesselData } from '@/app/lib/vessels';

export async function GET() {
  const vessels = generateVesselData();

  const summary = {
    lastUpdated: new Date().toISOString(),
    totalVessels: vessels.length,
    darkVessels: vessels.filter((v) => v.alertType === 'dark_vessel').length,
    aisGaps: vessels.filter((v) => v.alertType === 'ais_gap').length,
    spoofingSignatures: vessels.filter((v) => v.alertType === 'spoofing_signature').length,
    routine: vessels.filter((v) => v.alertType === null).length,
  };

  return NextResponse.json(summary);
}
