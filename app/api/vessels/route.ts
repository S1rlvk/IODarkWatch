import { NextResponse } from 'next/server';
import { generateVesselData } from '@/app/lib/vessels';

export async function GET() {
  const vessels = generateVesselData();

  const response = {
    vessels,
    lastUpdated: new Date().toISOString(),
    count: vessels.length,
    summary: {
      darkVessel: vessels.filter((v) => v.alertType === 'dark_vessel').length,
      aisGap: vessels.filter((v) => v.alertType === 'ais_gap').length,
      spoofingSignature: vessels.filter((v) => v.alertType === 'spoofing_signature').length,
      routine: vessels.filter((v) => v.alertType === null).length,
      total: vessels.length,
    },
  };

  return NextResponse.json(response);
}
