export interface MapDiagnostics {
  leafletInstalled: boolean;
  reactLeafletInstalled: boolean;
  cssLoaded: boolean;
  networkConnected: boolean;
  windowDefined: boolean;
  documentDefined: boolean;
  errors: string[];
}

export const runMapDiagnostics = (): MapDiagnostics => {
  const diagnostics: MapDiagnostics = {
    leafletInstalled: false,
    reactLeafletInstalled: false,
    cssLoaded: false,
    networkConnected: true,
    windowDefined: typeof window !== 'undefined',
    documentDefined: typeof document !== 'undefined',
    errors: []
  };

  try {
    // Check if running in browser
    if (typeof window === 'undefined') {
      diagnostics.errors.push('Running in server environment (SSR)');
      return diagnostics;
    }

    // Check network connectivity
    if (!navigator.onLine) {
      diagnostics.networkConnected = false;
      diagnostics.errors.push('Device is offline');
    }

    // Check if Leaflet CSS is loaded
    const leafletCSS = document.querySelector('link[href*="leaflet"]');
    diagnostics.cssLoaded = !!leafletCSS;
    
    if (!leafletCSS) {
      diagnostics.errors.push('Leaflet CSS not found in document head');
    }

    // Try to import Leaflet
    try {
      import('leaflet').then(() => {
        diagnostics.leafletInstalled = true;
      }).catch((error) => {
        diagnostics.errors.push(`Leaflet import failed: ${error.message}`);
      });
    } catch (error) {
      diagnostics.errors.push(`Leaflet not available: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Try to import React Leaflet
    try {
      import('react-leaflet').then(() => {
        diagnostics.reactLeafletInstalled = true;
      }).catch((error) => {
        diagnostics.errors.push(`React Leaflet import failed: ${error.message}`);
      });
    } catch (error) {
      diagnostics.errors.push(`React Leaflet not available: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }

    // Check for common issues
    const mapContainers = document.querySelectorAll('.leaflet-container');
    if (mapContainers.length === 0) {
      diagnostics.errors.push('No Leaflet containers found in DOM');
    } else {
      mapContainers.forEach((container, index) => {
        const rect = container.getBoundingClientRect();
        if (rect.height === 0) {
          diagnostics.errors.push(`Map container ${index} has zero height`);
        }
      });
    }

    // Check for required environment variables (if any)
    // This is where you would check for API keys if needed
    
  } catch (error) {
    diagnostics.errors.push(`Diagnostic error: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  return diagnostics;
};

export const logDiagnostics = (): void => {
  const diagnostics = runMapDiagnostics();
  
  console.group('🗺️ Map Diagnostics');
  console.log('Leaflet installed:', diagnostics.leafletInstalled ? '✅' : '❌');
  console.log('React Leaflet installed:', diagnostics.reactLeafletInstalled ? '✅' : '❌');
  console.log('CSS loaded:', diagnostics.cssLoaded ? '✅' : '❌');
  console.log('Network connected:', diagnostics.networkConnected ? '✅' : '❌');
  console.log('Window defined:', diagnostics.windowDefined ? '✅' : '❌');
  console.log('Document defined:', diagnostics.documentDefined ? '✅' : '❌');
  
  if (diagnostics.errors.length > 0) {
    console.group('❌ Issues found:');
    diagnostics.errors.forEach(error => console.log(`• ${error}`));
    console.groupEnd();
  } else {
    console.log('✅ No issues detected');
  }
  
  console.groupEnd();
}; 