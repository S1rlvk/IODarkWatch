'use client';

// FORCE CACHE REFRESH - Updated: 2025-06-01 at 9:55 AM
// Updated beautiful dashboard - force Netlify redeploy
import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Ship, Satellite, Activity, Eye, MapPin, Clock } from 'lucide-react';

const Dashboard = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [activeAlerts, setActiveAlerts] = useState(12);
  const [isLive, setIsLive] = useState(true);
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      if (Math.random() > 0.95) {
        setActiveAlerts(prev => prev + (Math.random() > 0.5 ? 1 : -1));
      }
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Initialize real map
  useEffect(() => {
    if (typeof window !== 'undefined' && mapRef.current && !mapInstanceRef.current) {
      import('leaflet').then((L) => {
        // Create map centered on Indian Ocean
        const map = L.map(mapRef.current!).setView([-10, 75], 4);
        
        // Add OpenStreetMap tiles
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          attribution: '© OpenStreetMap contributors',
          maxZoom: 18,
        }).addTo(map);

        // Custom marker styles
        const createCustomIcon = (color: string, type: string) => {
          return L.divIcon({
            className: 'custom-marker',
            html: `<div style="
              width: 16px; 
              height: 16px; 
              background: ${color}; 
              border-radius: 50%; 
              box-shadow: 0 0 20px ${color}50;
              ${type === 'active' ? 'animation: pulse 2s infinite;' : ''}
              border: 2px solid white;
            "></div>`,
            iconSize: [20, 20],
            iconAnchor: [10, 10]
          });
        };

        // Real vessel positions in Indian Ocean
        const vessels = [
          {
            position: [-8.5, 76.2] as [number, number],
            type: 'dark',
            color: '#ef4444',
            popup: 'Unknown Vessel<br/>Dark Transit<br/>Confidence: 94%'
          },
          {
            position: [-12.1, 68.4] as [number, number],
            type: 'ais_gap',
            color: '#f59e0b',
            popup: 'Fishing Vessel<br/>AIS Gap<br/>Confidence: 87%'
          },
          {
            position: [-15.3, 73.8] as [number, number],
            type: 'deviation',
            color: '#ef4444',
            popup: 'Cargo Ship<br/>Route Deviation<br/>Confidence: 91%'
          },
          {
            position: [-5.2, 82.1] as [number, number],
            type: 'normal',
            color: '#10b981',
            popup: 'Container Ship<br/>Normal Track<br/>Confidence: 99%'
          },
          {
            position: [-18.7, 70.3] as [number, number],
            type: 'normal',
            color: '#3b82f6',
            popup: 'Oil Tanker<br/>Monitored<br/>Confidence: 96%'
          }
        ];

        // Add vessel markers
        vessels.forEach(vessel => {
          const marker = L.marker(vessel.position, {
            icon: createCustomIcon(vessel.color, vessel.type === 'dark' || vessel.type === 'ais_gap' ? 'active' : 'normal')
          }).addTo(map);
          
          marker.bindPopup(vessel.popup, {
            className: 'custom-popup'
          });
        });

        // Add coverage area circles
        L.circle([-10, 75], {
          color: '#06b6d4',
          fillColor: '#06b6d4',
          fillOpacity: 0.1,
          radius: 500000,
          weight: 2,
          opacity: 0.3
        }).addTo(map).bindPopup('Primary Coverage Area');

        L.circle([-15, 80], {
          color: '#3b82f6',
          fillColor: '#3b82f6',
          fillOpacity: 0.05,
          radius: 300000,
          weight: 1,
          opacity: 0.2
        }).addTo(map).bindPopup('Secondary Coverage');

        mapInstanceRef.current = map;

        // Add custom CSS for map elements
        const style = document.createElement('style');
        style.textContent = `
          .leaflet-container {
            background: linear-gradient(135deg, #1e3a8a40 0%, #06b6d440 50%, #1e40af40 100%) !important;
          }
          .custom-popup .leaflet-popup-content-wrapper {
            background: rgba(0, 0, 0, 0.8);
            color: white;
            border-radius: 8px;
            backdrop-filter: blur(10px);
          }
          .custom-popup .leaflet-popup-tip {
            background: rgba(0, 0, 0, 0.8);
          }
          .leaflet-control-zoom {
            background: rgba(0, 0, 0, 0.3) !important;
            border: 1px solid rgba(255, 255, 255, 0.2) !important;
            border-radius: 8px !important;
            backdrop-filter: blur(10px);
          }
          .leaflet-control-zoom a {
            background: rgba(255, 255, 255, 0.1) !important;
            color: #06b6d4 !important;
            border: none !important;
          }
          .leaflet-control-zoom a:hover {
            background: rgba(6, 182, 212, 0.2) !important;
          }
          @keyframes pulse {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.5; }
          }
        `;
        document.head.appendChild(style);
      });
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const mockAlerts = [
    {
      id: 1,
      vessel: "Unknown Vessel",
      coordinates: "8.5°S, 76.2°E",
      lastSeen: "23 minutes ago",
      confidence: 94,
      type: "Dark Transit",
      status: "active"
    },
    {
      id: 2,
      vessel: "Fishing Vessel",
      coordinates: "12.1°S, 68.4°E",
      lastSeen: "1.2 hours ago",
      confidence: 87,
      type: "AIS Gap",
      status: "monitoring"
    },
    {
      id: 3,
      vessel: "Cargo Ship",
      coordinates: "15.3°S, 73.8°E",
      lastSeen: "45 minutes ago",
      confidence: 91,
      type: "Route Deviation",
      status: "active"
    }
  ];

  const stats = [
    { label: "Active Alerts", value: activeAlerts, icon: AlertTriangle, color: "#ef4444" },
    { label: "Vessels Tracked", value: "2,847", icon: Ship, color: "#3b82f6" },
    { label: "SAR Scans Today", value: "156", icon: Satellite, color: "#10b981" },
    { label: "Coverage Area", value: "1.2M km²", icon: MapPin, color: "#8b5cf6" }
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f172a 0%, #000000 50%, #0f172a 100%)',
      color: 'white',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        background: 'rgba(0, 0, 0, 0.3)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(6, 182, 212, 0.2)',
        padding: '0 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '64px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ position: 'relative' }}>
                <Eye size={40} color="#06b6d4" />
                <div style={{
                  position: 'absolute',
                  top: '-2px',
                  right: '-2px',
                  width: '12px',
                  height: '12px',
                  background: '#06b6d4',
                  borderRadius: '50%',
                  animation: 'pulse 2s infinite'
                }}></div>
              </div>
              <h1 style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                margin: 0
              }}>
                IODarkWatch
              </h1>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(16, 185, 129, 0.1)',
              padding: '0.25rem 0.75rem',
              borderRadius: '9999px',
              border: '1px solid rgba(16, 185, 129, 0.3)'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: isLive ? '#10b981' : '#ef4444',
                borderRadius: '50%',
                animation: isLive ? 'pulse 2s infinite' : 'none'
              }}></div>
              <span style={{ fontSize: '0.875rem', fontWeight: '500', color: '#10b981' }}>
                {isLive ? 'LIVE' : 'OFFLINE'}
              </span>
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            padding: '0.5rem 1rem',
            borderRadius: '0.5rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            textAlign: 'right'
          }}>
            <div style={{ fontSize: '0.875rem', fontWeight: '500' }}>
              {currentTime.toLocaleTimeString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
              {currentTime.toLocaleDateString()}
            </div>
          </div>
        </div>
      </header>

      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Stats Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {stats.map((stat, index) => (
            <div key={index} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'scale(1.02)';
              e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'scale(1)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <p style={{ fontSize: '0.875rem', color: '#9ca3af', margin: '0 0 0.5rem 0' }}>
                    {stat.label}
                  </p>
                  <p style={{ fontSize: '2rem', fontWeight: 'bold', margin: 0 }}>
                    {stat.value}
                  </p>
                </div>
                <div style={{
                  padding: '0.75rem',
                  borderRadius: '0.75rem',
                  background: `linear-gradient(135deg, ${stat.color}20, ${stat.color}10)`
                }}>
                  <stat.icon size={32} color={stat.color} />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem' }}>
          {/* Real Map Area */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(10px)',
            borderRadius: '1rem',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1.5rem',
              borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Activity size={20} color="#06b6d4" />
                  Indian Ocean Coverage
                </h2>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(16, 185, 129, 0.1)',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '9999px',
                  border: '1px solid rgba(16, 185, 129, 0.3)'
                }}>
                  <Activity size={16} color="#10b981" style={{ animation: 'pulse 2s infinite' }} />
                  <span style={{ fontSize: '0.875rem', color: '#10b981', fontWeight: '500' }}>
                    Real-time
                  </span>
                </div>
              </div>
            </div>
            
            {/* Real Interactive Map */}
            <div style={{ height: '400px', position: 'relative' }}>
              <div ref={mapRef} style={{ height: '100%', width: '100%' }} />

              {/* Legend Overlay */}
              <div style={{
                position: 'absolute',
                bottom: '1rem',
                left: '1rem',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.75rem',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: 1000
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#06b6d4',
                  marginBottom: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <MapPin size={12} />
                  Legend
                </div>
                <div style={{ fontSize: '0.75rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#ef4444',
                      borderRadius: '50%',
                      boxShadow: '0 0 10px rgba(239, 68, 68, 0.5)'
                    }}></div>
                    <span style={{ color: '#d1d5db' }}>Dark Vessel</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#f59e0b',
                      borderRadius: '50%',
                      boxShadow: '0 0 10px rgba(245, 158, 11, 0.5)'
                    }}></div>
                    <span style={{ color: '#d1d5db' }}>AIS Gap</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{
                      width: '12px',
                      height: '12px',
                      background: '#10b981',
                      borderRadius: '50%',
                      boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                    }}></div>
                    <span style={{ color: '#d1d5db' }}>Normal</span>
                  </div>
                </div>
              </div>

              {/* SAR Info Overlay */}
              <div style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(0, 0, 0, 0.4)',
                backdropFilter: 'blur(10px)',
                borderRadius: '0.75rem',
                padding: '1rem',
                border: '1px solid rgba(255, 255, 255, 0.2)',
                zIndex: 1000
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: '500',
                  color: '#06b6d4',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Satellite size={12} style={{ animation: 'pulse 2s infinite' }} />
                  Last SAR Scan
                </div>
                <div style={{ fontSize: '0.75rem', color: '#d1d5db', marginTop: '0.25rem' }}>
                  {new Date(Date.now() - 120000).toLocaleTimeString()}
                </div>
              </div>
            </div>
          </div>

          {/* Alerts Panel */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Active Alerts */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <h2 style={{
                    fontSize: '1.25rem',
                    fontWeight: '600',
                    margin: 0,
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}>
                    <AlertTriangle size={20} color="#ef4444" />
                    Active Alerts
                  </h2>
                  <span style={{
                    background: 'rgba(239, 68, 68, 0.2)',
                    border: '1px solid rgba(239, 68, 68, 0.3)',
                    color: '#ef4444',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    padding: '0.25rem 0.75rem',
                    borderRadius: '9999px'
                  }}>
                    {activeAlerts}
                  </span>
                </div>
              </div>
              
              <div style={{
                padding: '1.5rem',
                maxHeight: '400px',
                overflowY: 'auto'
              }}>
                {mockAlerts.map((alert) => (
                  <div key={alert.id} style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '0.75rem',
                    padding: '1rem',
                    marginBottom: '1rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.borderColor = 'rgba(6, 182, 212, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
                    e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '12px',
                          height: '12px',
                          background: alert.status === 'active' ? '#ef4444' : '#f59e0b',
                          borderRadius: '50%',
                          boxShadow: `0 0 10px ${alert.status === 'active' ? 'rgba(239, 68, 68, 0.5)' : 'rgba(245, 158, 11, 0.5)'}`,
                          animation: alert.status === 'active' ? 'pulse 2s infinite' : 'none'
                        }}></div>
                        <span style={{ fontWeight: '500', fontSize: '0.875rem' }}>
                          {alert.vessel}
                        </span>
                      </div>
                      <span style={{
                        fontSize: '0.75rem',
                        color: '#9ca3af',
                        background: 'rgba(255, 255, 255, 0.1)',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.5rem',
                        border: '1px solid rgba(255, 255, 255, 0.2)'
                      }}>
                        {alert.type}
                      </span>
                    </div>
                    
                    <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <MapPin size={12} color="#06b6d4" />
                        <span style={{ color: '#d1d5db' }}>{alert.coordinates}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        marginBottom: '0.5rem'
                      }}>
                        <Clock size={12} color="#06b6d4" />
                        <span style={{ color: '#d1d5db' }}>{alert.lastSeen}</span>
                      </div>
                      <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingTop: '0.25rem'
                      }}>
                        <span>Confidence:</span>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <div style={{
                            width: '48px',
                            height: '6px',
                            background: '#374151',
                            borderRadius: '9999px',
                            overflow: 'hidden'
                          }}>
                            <div style={{
                              height: '100%',
                              background: 'linear-gradient(to right, #06b6d4, #3b82f6)',
                              borderRadius: '9999px',
                              width: `${alert.confidence}%`,
                              transition: 'all 0.3s ease'
                            }}></div>
                          </div>
                          <span style={{ fontWeight: '500', color: '#06b6d4' }}>
                            {alert.confidence}%
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* System Status */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '1rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              overflow: 'hidden'
            }}>
              <div style={{
                padding: '1.5rem',
                borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
              }}>
                <h2 style={{
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  margin: 0,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}>
                  <Activity size={20} color="#10b981" />
                  System Status
                </h2>
              </div>
              
              <div style={{ padding: '1.5rem' }}>
                {[
                  { name: "SAR Processing", status: "Online" },
                  { name: "AIS Correlation", status: "Active" },
                  { name: "Detection Engine", status: "Running" },
                  { name: "API Status", status: "Healthy" }
                ].map((service, index) => (
                  <div key={index} style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '0.75rem',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '0.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    marginBottom: index < 3 ? '1rem' : 0
                  }}>
                    <span style={{ fontSize: '0.875rem', color: '#d1d5db' }}>
                      {service.name}
                    </span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div style={{
                        width: '8px',
                        height: '8px',
                        background: '#10b981',
                        borderRadius: '50%',
                        boxShadow: '0 0 10px rgba(16, 185, 129, 0.5)'
                      }}></div>
                      <span style={{
                        fontSize: '0.875rem',
                        color: '#10b981',
                        fontWeight: '500'
                      }}>
                        {service.status}
                      </span>
                    </div>
                  </div>
                ))}

                <div style={{
                  paddingTop: '1rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.1)',
                  marginTop: '1rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af', marginBottom: '0.5rem' }}>
                    Last deployment: {new Date(Date.now() - 3600000).toLocaleString()}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>
                    Version: 2.1.4 • Uptime: 24h 12m
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CSS Animations */}
      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.5;
          }
        }
        
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '2fr 1fr'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>

      {/* Leaflet CSS */}
      <link
        rel="stylesheet"
        href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
        integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
        crossOrigin=""
      />
    </div>
  );
};

export default Dashboard; 