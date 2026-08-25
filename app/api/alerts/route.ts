import { NextResponse } from 'next/server';
import { generateVesselData, ALERT_META } from '@/app/lib/vessels';

// Derives alerts from the same simulated vessel dataset /api/vessels uses,
// rather than a separately hand-maintained list, so the two can't drift.
export async function GET() {
  const alerts = generateVesselData()
    .filter((v) => v.alertType !== null)
    .map((v) => ({
      id: v.id,
      type: ALERT_META[v.alertType as Exclude<typeof v.alertType, null>].label,
      vessel: v.name,
      severity: v.severity,
      timestamp: new Date(v.lastSeen).toISOString(),
      location: { lat: v.lat, lng: v.lng },
      description: v.reason,
    }));

  return NextResponse.json(alerts);
}
