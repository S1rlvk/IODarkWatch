import React from 'react';
import maplibregl from 'maplibre-gl';

interface VesselMarkerProps {
  vessel: {
    id: string;
    mmsi: string;
    name: string;
    type: string;
    position: [number, number];
    speed: number;
    course: number;
    isDark: boolean;
  };
  onClick: () => void;
}

export class VesselMarker {
  private marker: maplibregl.Marker;
  private vessel: VesselMarkerProps['vessel'];
  private onClick: () => void;

  constructor({ vessel, onClick }: VesselMarkerProps) {
    this.vessel = vessel;
    this.onClick = onClick;

    // Create marker element
    const el = document.createElement('div');
    el.className = 'vessel-marker';
    el.style.width = '24px';
    el.style.height = '24px';
    el.style.background = vessel.isDark ? '#ff4444' : '#0080ff';
    el.style.borderRadius = '50%';
    el.style.border = '2px solid white';
    el.style.cursor = 'pointer';
    el.style.transform = `rotate(${vessel.course}deg)`;

    // Add vessel icon
    const icon = document.createElement('div');
    icon.style.width = '100%';
    icon.style.height = '100%';
    icon.style.display = 'flex';
    icon.style.alignItems = 'center';
    icon.style.justifyContent = 'center';
    icon.style.color = 'white';
    icon.style.fontSize = '12px';
    icon.textContent = '🚢';
    el.appendChild(icon);

    // Create popup
    const popup = new maplibregl.Popup({
      offset: 25,
      closeButton: false,
    }).setHTML(`
      <div style="padding: 8px;">
        <h4 style="margin: 0 0 4px 0;">${vessel.name || 'Unknown Vessel'}</h4>
        <p style="margin: 0;">MMSI: ${vessel.mmsi}</p>
        <p style="margin: 0;">Type: ${vessel.type}</p>
        <p style="margin: 0;">Speed: ${vessel.speed} knots</p>
        ${vessel.isDark ? '<p style="margin: 4px 0 0 0; color: #ff4444;">⚠️ Dark Vessel</p>' : ''}
      </div>
    `);

    // Create marker
    this.marker = new maplibregl.Marker({
      element: el,
      rotationAlignment: 'map',
    })
      .setLngLat(vessel.position)
      .setPopup(popup);

    // Add click handler
    el.addEventListener('click', () => {
      this.onClick();
    });
  }

  addTo(map: maplibregl.Map) {
    this.marker.addTo(map);
  }

  remove() {
    this.marker.remove();
  }

  update(vessel: VesselMarkerProps['vessel']) {
    this.vessel = vessel;
    this.marker.setLngLat(vessel.position);
    this.marker.getElement().style.transform = `rotate(${vessel.course}deg)`;
    this.marker.getElement().style.background = vessel.isDark ? '#ff4444' : '#0080ff';
  }
} 