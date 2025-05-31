import { useState, useEffect, useRef, useCallback } from 'react';
import { Vessel } from '../types';
import { useVesselStore } from '../store/useVesselStore';

interface WebSocketMessage {
  type: 'vessels_update' | 'heartbeat' | 'error';
  data?: {
    vessels: Vessel[];
    lastUpdated: string;
  };
  error?: string;
}

export const useWebSocketVessels = (wsUrl?: string) => {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  
  const ws = useRef<WebSocket | null>(null);
  const reconnectTimeout = useRef<NodeJS.Timeout | null>(null);
  const heartbeatInterval = useRef<NodeJS.Timeout | null>(null);
  
  const setVessels = useVesselStore(state => state.setVessels);
  
  const MAX_RECONNECT_ATTEMPTS = 5;
  const RECONNECT_DELAY = 5000;
  const HEARTBEAT_INTERVAL = 30000;
  
  const connect = useCallback(() => {
    if (!wsUrl) {
      console.warn('WebSocket URL not provided, falling back to polling');
      return;
    }
    
    try {
      ws.current = new WebSocket(wsUrl);
      
      ws.current.onopen = () => {
        console.log('WebSocket connected');
        setIsConnected(true);
        setIsLoading(false);
        setError(null);
        setReconnectAttempts(0);
        
        // Start heartbeat
        heartbeatInterval.current = setInterval(() => {
          if (ws.current?.readyState === WebSocket.OPEN) {
            ws.current.send(JSON.stringify({ type: 'ping' }));
          }
        }, HEARTBEAT_INTERVAL);
      };
      
      ws.current.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          
          switch (message.type) {
            case 'vessels_update':
              if (message.data) {
                setVessels(message.data.vessels);
                setLastUpdated(message.data.lastUpdated);
              }
              break;
            case 'heartbeat':
              // Heartbeat received, connection is alive
              break;
            case 'error':
              setError(message.error || 'WebSocket error');
              break;
          }
        } catch (err) {
          console.error('Error parsing WebSocket message:', err);
        }
      };
      
      ws.current.onclose = () => {
        console.log('WebSocket disconnected');
        setIsConnected(false);
        
        if (heartbeatInterval.current) {
          clearInterval(heartbeatInterval.current);
          heartbeatInterval.current = null;
        }
        
        // Attempt to reconnect if not too many attempts
        if (reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
          setReconnectAttempts(prev => prev + 1);
          reconnectTimeout.current = setTimeout(() => {
            connect();
          }, RECONNECT_DELAY);
        } else {
          setError('Failed to connect after multiple attempts');
          setIsLoading(false);
        }
      };
      
      ws.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        setError('WebSocket connection error');
      };
      
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err);
      setError('Failed to create WebSocket connection');
      setIsLoading(false);
    }
  }, [wsUrl, reconnectAttempts, setVessels]);
  
  const disconnect = useCallback(() => {
    if (reconnectTimeout.current) {
      clearTimeout(reconnectTimeout.current);
      reconnectTimeout.current = null;
    }
    
    if (heartbeatInterval.current) {
      clearInterval(heartbeatInterval.current);
      heartbeatInterval.current = null;
    }
    
    if (ws.current) {
      ws.current.close();
      ws.current = null;
    }
    
    setIsConnected(false);
  }, []);
  
  const requestUpdate = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      ws.current.send(JSON.stringify({ type: 'request_update' }));
    }
  }, []);
  
  useEffect(() => {
    connect();
    
    return () => {
      disconnect();
    };
  }, [connect, disconnect]);
  
  return {
    isConnected,
    isLoading,
    lastUpdated,
    error,
    reconnectAttempts,
    requestUpdate,
    disconnect,
    connect: useCallback(() => {
      setReconnectAttempts(0);
      connect();
    }, [connect])
  };
}; 