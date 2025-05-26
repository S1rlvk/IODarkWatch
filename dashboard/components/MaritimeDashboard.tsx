import React, { useEffect, useRef, useState } from 'react';
import maplibregl from 'maplibre-gl';
import 'maplibre-gl/dist/maplibre-gl.css';
import { VesselMarker } from './VesselMarker';
import { AlertPanel } from './AlertPanel';
import { TimelineView } from './TimelineView';
import { FilterControls } from './FilterControls';
import { useVesselData } from '../utils/useVesselData';
import { useDarkVesselAlerts } from '../utils/useDarkVesselAlerts';
import styles from '../../app/styles/Dashboard.module.css';
import { Vessel, Alert } from '../../app/types';

export const MaritimeDashboard: React.FC = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<maplibregl.Map | null>(null);
  const [selectedVessel, setSelectedVessel] = useState<Vessel | null>(null);
  const [timeRange, setTimeRange] = useState<[Date, Date]>([new Date(Date.now() - 24 * 60 * 60 * 1000), new Date()]);
  const [filters, setFilters] = useState({
    vesselTypes: [] as string[],
    minSpeed: 0,
    maxSpeed: 30,
    darkVesselsOnly: false,
  });

  // Fetch vessel data and dark vessel alerts
  const { vessels, loading: vesselsLoading } = useVesselData({ timeRange, filters });
  const { alerts, loading: alertsLoading } = useDarkVesselAlerts({
    start: timeRange[0].toISOString(),
    end: timeRange[1].toISOString()
  });

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map
    map.current = new maplibregl.Map({
      container: mapContainer.current,
      style: 'https://api.maptiler.com/maps/basic-v2/style.json?key=YOUR_MAPTILER_KEY',
      center: [65, 15], // Center on Indian Ocean
      zoom: 4,
      maxZoom: 18,
    });

    // Add navigation controls
    map.current.addControl(new maplibregl.NavigationControl(), 'top-right');

    // Add custom layers for maritime boundaries
    map.current.on('load', () => {
      // Add EEZ boundaries
      map.current?.addSource('eez-boundaries', {
        type: 'geojson',
        data: '/data/eez-boundaries.geojson',
      });

      map.current?.addLayer({
        id: 'eez-boundaries',
        type: 'line',
        source: 'eez-boundaries',
        paint: {
          'line-color': '#0080ff',
          'line-width': 2,
          'line-opacity': 0.5,
        },
      });

      // Add shipping lanes
      map.current?.addSource('shipping-lanes', {
        type: 'geojson',
        data: '/data/shipping-lanes.geojson',
      });

      map.current?.addLayer({
        id: 'shipping-lanes',
        type: 'line',
        source: 'shipping-lanes',
        paint: {
          'line-color': '#00ff00',
          'line-width': 1,
          'line-opacity': 0.3,
        },
      });
    });

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update vessel markers when data changes
  useEffect(() => {
    if (!map.current || !vessels) return;

    // Remove existing markers
    const markers = document.getElementsByClassName('vessel-marker');
    while (markers[0]) {
      markers[0].remove();
    }

    // Add new markers
    vessels.forEach((vessel) => {
      const marker = new VesselMarker({
        vessel,
        onClick: () => setSelectedVessel(vessel),
      });
      marker.addTo(map.current!);
    });
  }, [vessels]);

  return (
    <div className={styles.dashboard}>
      <div className={styles.mapContainer} ref={mapContainer} />
      
      <div className={styles.controls}>
        <FilterControls
          filters={filters}
          onFilterChange={setFilters}
          onTimeRangeChange={setTimeRange}
        />
        
        <AlertPanel
          alerts={alerts}
          loading={alertsLoading}
          onAlertClick={(alert) => {
            if (map.current) {
              map.current.flyTo({
                center: [alert.location.lat, alert.location.lng],
                zoom: 10,
              });
              setSelectedVessel(alert.vessel);
            }
          }}
        />
      </div>

      <div className={styles.timeline}>
        <TimelineView
          timeRange={timeRange}
          onTimeRangeChange={setTimeRange}
          events={alerts}
        />
      </div>

      {selectedVessel && (
        <div className={styles.vesselDetails}>
          <h3>{selectedVessel.name || 'Unknown Vessel'}</h3>
          <p>MMSI: {selectedVessel.mmsi}</p>
          <p>Type: {selectedVessel.type}</p>
          <p>Speed: {selectedVessel.speed} knots</p>
          <p>Course: {selectedVessel.course}°</p>
          <p>Last Update: {new Date(selectedVessel.lastUpdate).toLocaleString()}</p>
          {selectedVessel.isDark && (
            <div className={styles.darkVesselWarning}>
              ⚠️ Dark Vessel Alert
            </div>
          )}
        </div>
      )}
    </div>
  );
}; 