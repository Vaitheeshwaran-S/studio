
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Map, AdvancedMarker } from '@vis.gl/react-google-maps';
import type { SearchResultItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, X, Building, CalendarDays } from 'lucide-react';

interface MapDisplayProps {
  results: SearchResultItem[];
  hoveredItemId: string | null;
  setHoveredItemId: (id: string | null) => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  userLocation: { lat: number; lng: number } | null;
}

// A simple (and not very unique) hashing function to create positions from location names
const geocodeLocation = (locationName: string): Promise<{ lat: number; lng: number }> => {
  return new Promise(resolve => {
    let hash = 0;
    for (let i = 0; i < locationName.length; i++) {
      hash = locationName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const baseLat = 34.0522; // Los Angeles
    const baseLng = -118.2437;
    const lat = baseLat + (hash % 1000) / 20000;
    const lng = baseLng + (hash % 2000) / 40000;
    resolve({ lat, lng });
  });
};

type MarkerData = { id: string; type: 'event' | 'business'; name: string; lat: number; lng: number };

const MarkerIcon = ({ type, isHovered }: { type: 'event' | 'business'; isHovered: boolean }) => {
  const Icon = type === 'event' ? CalendarDays : Building;
  const bgColor = isHovered ? 'hsl(var(--accent))' : 'hsl(var(--primary))';
  const color = isHovered ? 'hsl(var(--accent-foreground))' : 'hsl(var(--primary-foreground))';

  return (
    <div
      className="p-2 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg"
      style={{ backgroundColor: bgColor, color: color }}
      onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'hsl(var(--accent))')}
      onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = bgColor)}
    >
      <Icon className="w-5 h-5" />
    </div>
  );
};


export default function MapDisplay({ results, hoveredItemId, setHoveredItemId, showWelcome, setShowWelcome, userLocation }: MapDisplayProps) {
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const mapCenter = useMemo(() => {
    if (markers.length > 0) {
        const avgLat = markers.reduce((sum, m) => sum + m.lat, 0) / markers.length;
        const avgLng = markers.reduce((sum, m) => sum + m.lng, 0) / markers.length;
        return { lat: avgLat, lng: avgLng };
    }
    if (userLocation) {
      return { lat: userLocation.lat, lng: userLocation.lng };
    }
    return { lat: 34.052235, lng: -118.243683 };
  }, [userLocation, markers]);

  const mapZoom = useMemo(() => {
    return userLocation || results.length > 0 ? 12 : 10;
  }, [userLocation, results]);

  useEffect(() => {
    const processResults = async () => {
      const newMarkers = await Promise.all(
        results.map(async result => {
          const { lat, lng } = await geocodeLocation(result.location);
          return { ...result, lat, lng };
        })
      );
      setMarkers(newMarkers);
    };
    if (results.length > 0) {
      processResults();
    } else {
      setMarkers([]);
    }
  }, [results]);

  return (
    <div className="relative w-full h-full">
        <Map
            mapId={'local-pulse-map'}
            style={{ width: '100%', height: '100%' }}
            center={mapCenter}
            zoom={mapZoom}
            gestureHandling={'greedy'}
            disableDefaultUI={true}
        >
            {markers.map(marker => (
                <AdvancedMarker
                    key={marker.id}
                    position={marker}
                    title={marker.name}
                >
                    <div
                        onMouseEnter={() => setHoveredItemId(marker.id)}
                        onMouseLeave={() => setHoveredItemId(null)}
                    >
                        <MarkerIcon type={marker.type} isHovered={hoveredItemId === marker.id} />
                    </div>
                </AdvancedMarker>
            ))}
      </Map>
      {showWelcome && (
        <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10 p-4">
          <Card className="max-w-sm text-center relative shadow-2xl">
            <Button
              variant="ghost"
              size="icon"
              className="absolute top-2 right-2 h-6 w-6 z-20"
              onClick={() => setShowWelcome(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </Button>
            <CardContent className="p-6">
              <Flame className="mx-auto h-12 w-12 text-primary" />
              <h3 className="mt-4 text-lg font-medium">Welcome to LocalPulse</h3>
              <p className="mt-2 text-sm text-muted-foreground">
                Allow location access to find what's happening near you, or use the search bar to explore.
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
