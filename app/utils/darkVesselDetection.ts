import { Vessel } from '../types';

const TWELVE_HOURS_MS = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const POSITION_CHANGE_THRESHOLD = 0.001; // Minimum lat/lng change considered movement (roughly 100m)

export interface DarkVesselAnalysis {
  isDark: boolean;
  isSuspicious: boolean;
  reason: string[];
  lastTransmissionHours?: number;
}

/**
 * Analyzes a vessel to determine if it should be marked as "dark"
 */
export function analyzeDarkVessel(vessel: Vessel): DarkVesselAnalysis {
  const now = new Date();
  const reasons: string[] = [];
  let isDark = false;
  let isSuspicious = false;

  // Check for AIS transmission gap (12+ hours)
  if (vessel.lastAisTransmission) {
    const lastTransmission = new Date(vessel.lastAisTransmission);
    const timeSinceLastTransmission = now.getTime() - lastTransmission.getTime();
    const hoursSinceLastTransmission = timeSinceLastTransmission / (60 * 60 * 1000);

    if (timeSinceLastTransmission > TWELVE_HOURS_MS) {
      isDark = true;
      reasons.push(`AIS silent for ${Math.round(hoursSinceLastTransmission)} hours`);
    }
  }

  // Check for suspicious movement (speed 0 but position changes)
  if (vessel.previousPositions && vessel.previousPositions.length >= 2) {
    const recentPositions = vessel.previousPositions
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, 3); // Look at last 3 positions

    // Check if vessel reports speed 0 but position is changing
    const hasZeroSpeed = vessel.speed === 0;
    const hasMovement = checkForMovement(recentPositions);

    if (hasZeroSpeed && hasMovement) {
      isSuspicious = true;
      reasons.push('Speed reported as 0 but position changing');
    }

    // Check for erratic movement patterns
    const hasErraticMovement = checkErraticMovement(recentPositions);
    if (hasErraticMovement) {
      isSuspicious = true;
      reasons.push('Erratic movement pattern detected');
    }
  }

  // If no AIS match and vessel was previously active, mark as dark
  if (vessel.aisMatch === false && vessel.previousPositions && vessel.previousPositions.length > 0) {
    const wasPreviouslyActive = vessel.previousPositions.some(pos => 
      new Date(pos.timestamp).getTime() > (now.getTime() - TWELVE_HOURS_MS)
    );
    
    if (wasPreviouslyActive) {
      isDark = true;
      reasons.push('No AIS match for previously active vessel');
    }
  }

  return {
    isDark: isDark || isSuspicious,
    isSuspicious,
    reason: reasons,
    lastTransmissionHours: vessel.lastAisTransmission ? 
      (now.getTime() - new Date(vessel.lastAisTransmission).getTime()) / (60 * 60 * 1000) : 
      undefined
  };
}

/**
 * Checks if there's significant movement between positions
 */
function checkForMovement(positions: Array<{lat: number; lng: number; timestamp: string}>): boolean {
  if (positions.length < 2) return false;

  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];
    
    const latDiff = Math.abs(prev.lat - curr.lat);
    const lngDiff = Math.abs(prev.lng - curr.lng);
    
    if (latDiff > POSITION_CHANGE_THRESHOLD || lngDiff > POSITION_CHANGE_THRESHOLD) {
      return true;
    }
  }
  
  return false;
}

/**
 * Checks for erratic movement patterns that might indicate spoofing
 */
function checkErraticMovement(positions: Array<{lat: number; lng: number; timestamp: string; speed: number}>): boolean {
  if (positions.length < 3) return false;

  const speeds = positions.map(p => p.speed);
  const speedVariation = Math.max(...speeds) - Math.min(...speeds);
  
  // Flag if speed varies dramatically (more than 20 knots difference)
  if (speedVariation > 20) {
    return true;
  }

  // Check for impossible speed changes
  for (let i = 1; i < positions.length; i++) {
    const prev = positions[i - 1];
    const curr = positions[i];
    
    const timeDiff = (new Date(prev.timestamp).getTime() - new Date(curr.timestamp).getTime()) / 1000; // seconds
    const distance = calculateDistance(prev.lat, prev.lng, curr.lat, curr.lng); // km
    const calculatedSpeed = (distance / timeDiff) * 3600; // km/h
    const calculatedSpeedKnots = calculatedSpeed * 0.539957; // Convert to knots
    
    const reportedSpeed = curr.speed;
    
    // If calculated speed differs significantly from reported speed
    if (Math.abs(calculatedSpeedKnots - reportedSpeed) > 15) {
      return true;
    }
  }

  return false;
}

/**
 * Calculates distance between two points using Haversine formula
 */
function calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLng = (lng2 - lng1) * Math.PI / 180;
  const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng/2) * Math.sin(dLng/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

/**
 * Updates vessel status based on dark vessel analysis
 */
export function updateVesselStatus(vessel: Vessel): Vessel {
  const analysis = analyzeDarkVessel(vessel);
  
  let newStatus: Vessel['status'] = vessel.status;
  
  if (analysis.isDark) {
    newStatus = 'dark';
  } else if (analysis.isSuspicious) {
    newStatus = 'alert';
  } else if (vessel.status === 'dark' || vessel.status === 'alert') {
    // Reset to active if no longer dark/suspicious
    newStatus = 'active';
  }

  return {
    ...vessel,
    status: newStatus,
    suspicious: analysis.isSuspicious
  };
}

/**
 * Processes an array of vessels and updates their dark/suspicious status
 */
export function processVesselsForDarkDetection(vessels: Vessel[]): Vessel[] {
  return vessels.map(vessel => updateVesselStatus(vessel));
} 