'use client';

import React, { Component, ReactNode } from 'react';
import { ExclamationTriangleIcon, ArrowPathIcon } from '@heroicons/react/24/outline';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: any;
}

class MapErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Map Error:', error, errorInfo);
    this.setState({
      error,
      errorInfo
    });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-full h-full flex items-center justify-center bg-bg-primary border border-red-500/20 rounded-lg">
          <div className="text-center p-8 max-w-md">
            <ExclamationTriangleIcon className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">Map Failed to Load</h3>
            <p className="text-gray-400 mb-6">
              {this.state.error?.message || 'An unexpected error occurred while loading the map'}
            </p>
            
            <div className="space-y-4">
              <button
                onClick={() => {
                  this.setState({ hasError: false, error: null, errorInfo: null });
                  window.location.reload();
                }}
                className="flex items-center gap-2 px-4 py-2 bg-accent-blue hover:bg-blue-600 text-white rounded-lg mx-auto transition-colors"
              >
                <ArrowPathIcon className="w-4 h-4" />
                Retry
              </button>
              
              <details className="text-left">
                <summary className="text-sm text-gray-500 cursor-pointer hover:text-gray-400">
                  Technical Details
                </summary>
                <div className="mt-2 p-4 bg-surface rounded text-xs text-gray-400 font-mono">
                  <pre className="whitespace-pre-wrap">
                    {this.state.error?.stack}
                  </pre>
                </div>
              </details>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default MapErrorBoundary; 