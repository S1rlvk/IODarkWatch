# Real-Time Vessel Position Updates

This document describes the real-time vessel position update features implemented in IODarkWatch.

## Features Implemented

### 1. Automatic Data Refresh (30-second intervals)
- Uses SWR (Stale-While-Revalidate) for efficient data fetching
- Automatically refreshes vessel data every 30 seconds
- Provides stale data while fetching fresh data in the background
- Revalidates on window focus and reconnection

### 2. Real-Time Visual Indicators
- **Refresh Indicator Component**: Shows current refresh status
- **Live Data Status**: Displays "Live Data" or "Updating..." status
- **Countdown Timer**: Shows time until next automatic refresh
- **Data Staleness Indicator**: Warning when data is older than expected
- **Manual Refresh Button**: Allows users to trigger immediate data refresh

### 3. Enhanced User Experience
- **Loading Overlays**: Different loading states for initial load vs. refresh
- **Timestamp Display**: Shows last update time in multiple locations
- **Real-time Countdown**: Updates every second to show time until next refresh
- **Visual Feedback**: Spinners and pulse animations during data updates

### 4. Simulated Vessel Movement
- Vessels show realistic movement patterns with small position changes
- Speed variations for active vessels
- Timestamp updates with each data refresh

## Implementation Details

### Core Hooks

#### `useRealTimeVessels`
- Main hook for real-time vessel data management
- Uses SWR with 30-second refresh interval
- Provides loading states, error handling, and manual refresh capability
- Tracks time since last update with real-time countdown

#### `useWebSocketVessels` (Alternative)
- WebSocket-based real-time implementation
- Automatic reconnection with exponential backoff
- Heartbeat mechanism for connection health monitoring
- Can be used as an alternative to polling when WebSocket infrastructure is available

### Components

#### `RefreshIndicator`
- Displays current refresh status with visual indicators
- Shows countdown to next refresh
- Provides manual refresh button
- Indicates data staleness with color coding

### API Enhancements

#### `/api/vessels`
- Enhanced to return `lastUpdated` timestamp
- Simulates realistic vessel movement
- Provides consistent data structure for real-time updates

#### `/api/summary`
- New endpoint providing summary information
- Includes system-wide last updated timestamp
- Can be extended for additional dashboard metrics

## Usage

The real-time features are automatically enabled in the dashboard. The system will:

1. Start fetching vessel data immediately on page load
2. Continue refreshing every 30 seconds
3. Show visual indicators for all refresh states
4. Allow manual refresh via the refresh button
5. Display countdown timers and staleness warnings

## Configuration

### Refresh Interval
The refresh interval can be modified in `app/hooks/useRealTimeVessels.ts`:

```typescript
const REFRESH_INTERVAL = 30000; // 30 seconds
```

### Staleness Threshold
Data is considered stale after refresh interval + buffer:

```typescript
const isDataStale = timeSinceLastUpdate > (REFRESH_INTERVAL / 1000) + 10
```

## WebSocket Alternative

To use WebSocket instead of polling, replace the `useRealTimeVessels` hook with `useWebSocketVessels`:

```typescript
const {
  isConnected,
  isLoading,
  lastUpdated,
  error,
  requestUpdate
} = useWebSocketVessels('ws://localhost:3001/ws');
```

## Technical Benefits

1. **Efficient Bandwidth Usage**: SWR provides intelligent caching and deduplication
2. **Graceful Degradation**: Falls back gracefully when connections fail
3. **Real-time Feedback**: Users always know the current data status
4. **Optimistic Updates**: Shows stale data while fetching fresh data
5. **Manual Override**: Users can force refresh when needed

## Future Enhancements

1. **Server-Sent Events (SSE)**: Alternative to WebSocket for one-way real-time updates
2. **Selective Updates**: Only update changed vessels to reduce bandwidth
3. **Offline Support**: Cache data for offline viewing
4. **Push Notifications**: Alert users of critical vessel status changes
5. **Real-time Collaboration**: Share vessel tracking sessions between users 