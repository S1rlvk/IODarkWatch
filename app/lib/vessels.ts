// Shared vessel data model and mock generator.
//
// This is the single source of truth for the Vessel shape and the demo
// dataset, imported by both the API routes and the dashboard client so the
// two never drift out of sync the way they used to (see docs/adr/0001).
//
// All data here is simulated. Coordinates are placed in the Arabian Sea,
// Bay of Bengal, and other Indian Ocean corridors the project is about —
// see CONTEXT.md for what each alert type means.

export type AlertType = 'dark_vessel' | 'ais_gap' | 'spoofing_signature' | null;

export interface Vessel {
  id: string;
  name: string | null; // null for Dark Vessels: satellite-only contacts have no AIS identity to report
  type: string;
  mmsi: string | null;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  length: number;
  confidence: number;
  lastSeen: number;
  alertType: AlertType;
  severity: 'high' | 'medium' | 'low';
  reason: string;
  lastAisTransmission?: string; // ais_gap only
  satelliteSource?: string; // dark_vessel only
}

export const ALERT_META: Record<
  Exclude<AlertType, null>,
  { label: string; color: string; description: string }
> = {
  dark_vessel: {
    label: 'Dark Vessel',
    color: '#ef4444',
    description: 'Satellite detection with no matching AIS broadcast',
  },
  ais_gap: {
    label: 'AIS Gap',
    color: '#f59e0b',
    description: 'Transponder silent for 12+ hours',
  },
  spoofing_signature: {
    label: 'Spoofing Signature',
    color: '#eab308',
    description: 'AIS-reported speed and position are inconsistent',
  },
};

interface VesselSeed {
  id: string;
  name: string | null;
  type: string;
  mmsi: string | null;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  length: number;
  confidence: number;
  lastSeenMinutesAgo: number;
  alertType: AlertType;
  severity: 'high' | 'medium' | 'low';
  reason: string;
  lastAisTransmissionHoursAgo?: number;
  satelliteSource?: string;
}

// Fixed seed positions so the "movement" jitter in generateVesselData()
// always stays anchored to a real Indian Ocean location.
const SEEDS: VesselSeed[] = [
  {
    id: 'DV001',
    name: null,
    type: 'Unidentified',
    mmsi: null,
    lat: 12.58,
    lng: 45.15, // Gulf of Aden / Bab-el-Mandeb approach
    speed: 9.4,
    heading: 210,
    length: 95,
    confidence: 0.81,
    lastSeenMinutesAgo: 20,
    alertType: 'dark_vessel',
    severity: 'high',
    reason: 'Satellite pass detected a vessel-sized contact with no corresponding AIS broadcast at this position.',
    satelliteSource: 'Sentinel-1 SAR (simulated pass)',
  },
  {
    id: 'DV002',
    name: null,
    type: 'Unidentified',
    mmsi: null,
    lat: 5.35,
    lng: 48.55, // off the Somali coast
    speed: 6.1,
    heading: 300,
    length: 60,
    confidence: 0.74,
    lastSeenMinutesAgo: 40,
    alertType: 'dark_vessel',
    severity: 'high',
    reason: 'Satellite pass detected a vessel-sized contact with no corresponding AIS broadcast at this position.',
    satelliteSource: 'Sentinel-1 SAR (simulated pass)',
  },
  {
    id: 'AG001',
    name: 'MV Horizon',
    type: 'Cargo',
    mmsi: '419123456',
    lat: 19.05,
    lng: 71.62, // Arabian Sea, off Mumbai
    speed: 12.5,
    heading: 45,
    length: 180,
    confidence: 0.92,
    lastSeenMinutesAgo: 35,
    alertType: 'ais_gap',
    severity: 'high',
    reason: 'Previously active vessel; AIS transponder has been silent for 20 hours.',
    lastAisTransmissionHoursAgo: 20,
  },
  {
    id: 'AG002',
    name: 'Pacific Star',
    type: 'Tanker',
    mmsi: '419654321',
    lat: 13.05,
    lng: 82.35, // Bay of Bengal, off Chennai
    speed: 8.2,
    heading: 120,
    length: 220,
    confidence: 0.87,
    lastSeenMinutesAgo: 55,
    alertType: 'ais_gap',
    severity: 'high',
    reason: 'Previously active vessel; AIS transponder has been silent for 15 hours.',
    lastAisTransmissionHoursAgo: 15,
  },
  {
    id: 'SS001',
    name: 'MV Crimson Tide',
    type: 'Tanker',
    mmsi: '564112233',
    lat: 5.62,
    lng: 98.44, // northern Malacca Strait approach
    speed: 0,
    heading: 0,
    length: 190,
    confidence: 0.78,
    lastSeenMinutesAgo: 15,
    alertType: 'spoofing_signature',
    severity: 'medium',
    reason: 'Reporting speed 0 while position keeps changing — consistent with a spoofed AIS feed.',
  },
  {
    id: 'SS002',
    name: 'F/V Atlantic Dawn',
    type: 'Fishing',
    mmsi: '419887766',
    lat: 11.62,
    lng: 92.58, // Andaman Sea
    speed: 6.8,
    heading: 90,
    length: 45,
    confidence: 0.65,
    lastSeenMinutesAgo: 70,
    alertType: 'spoofing_signature',
    severity: 'medium',
    reason: 'Reported speed swings by 20+ knots between updates with no plausible course change.',
  },
  {
    id: 'RT001',
    name: 'MV Coastal Express',
    type: 'Cargo',
    mmsi: '419556677',
    lat: 6.05,
    lng: 80.32, // off Colombo, Sri Lanka
    speed: 14.2,
    heading: 180,
    length: 150,
    confidence: 0.95,
    lastSeenMinutesAgo: 10,
    alertType: null,
    severity: 'low',
    reason: 'Routine AIS transmission, no anomalies detected.',
  },
  {
    id: 'RT002',
    name: 'S/V Trade Wind',
    type: 'Pleasure Craft',
    mmsi: '419998811',
    lat: 10.62,
    lng: 72.68, // Lakshadweep Sea
    speed: 6.8,
    heading: 135,
    length: 18,
    confidence: 0.91,
    lastSeenMinutesAgo: 25,
    alertType: null,
    severity: 'low',
    reason: 'Routine AIS transmission, no anomalies detected.',
  },
];

export function generateVesselData(): Vessel[] {
  const now = Date.now();

  return SEEDS.map((seed) => ({
    id: seed.id,
    name: seed.name,
    type: seed.type,
    mmsi: seed.mmsi,
    lat: seed.lat + (Math.random() - 0.5) * 0.01,
    lng: seed.lng + (Math.random() - 0.5) * 0.01,
    speed: seed.speed === 0 ? 0 : seed.speed + (Math.random() - 0.5) * 1.5,
    heading: seed.heading + (Math.random() - 0.5) * 8,
    length: seed.length,
    confidence: seed.confidence,
    lastSeen: now - 1000 * 60 * seed.lastSeenMinutesAgo,
    alertType: seed.alertType,
    severity: seed.severity,
    reason: seed.reason,
    ...(seed.lastAisTransmissionHoursAgo !== undefined && {
      lastAisTransmission: new Date(now - 1000 * 60 * 60 * seed.lastAisTransmissionHoursAgo).toISOString(),
    }),
    ...(seed.satelliteSource && { satelliteSource: seed.satelliteSource }),
  }));
}
