"use client";

import React, { useState, useEffect } from 'react';
import { Map, AdvancedMarker, Pin } from '@vis.gl/react-google-maps';
import { Card, CardContent } from '@/components/ui/card';
import { Flame, Building, CalendarDays } from 'lucide-react';
import type { SearchResultItem } from '@/lib/types';

interface MapDisplayProps {
  results: SearchResultItem[];
  hoveredItemId: string | null;
  setHoveredItemId: (id: string | null) => void;
}

// Simple geocoding simulation - in a real app, use the Geocoding API
const geocodeLocation = (locationName: string): Promise<{ lat: number; lng: number }> => {
  return new Promise(resolve => {
    // This is a pseudo-random deterministic hash to get coordinates
    let hash = 0;
    for (let i = 0; i < locationName.length; i++) {
      hash = locationName.charCodeAt(i) + ((hash << 5) - hash);
    }
    const lat = 34.0522 + (hash % 1000) / 20000; // Base: Los Angeles
    const lng = -118.2437 + (hash % 2000) / 40000;
    resolve({ lat, lng });
  });
};

const MarkerIcon = ({ type, isHovered }: { type: 'event' | 'business', isHovered: boolean }) => {
  const Icon = type === 'event' ? CalendarDays : Building;
  return (
    <div className={`transition-all duration-200 ${isHovered ? 'scale-125' : 'scale-100'}`}>
       <Pin background={isHovered ? 'hsl(var(--accent))' : 'hsl(var(--primary))'}
            borderColor={'hsl(var(--primary-foreground))'}
            glyphColor={'hsl(var(--primary-foreground))'}
        >
        <Icon className="w-6 h-6" />
      </Pin>
    </div>
  );
};


export default function MapDisplay({ results, hoveredItemId, setHoveredItemId }: MapDisplayProps) {
  const [markers, setMarkers] = useState<({ id: string; type: 'event' | 'business', name: string } & { lat: number; lng: number })[]>([]);

  useEffect(() => {
    const processResults = async () => {
      const newMarkers = await Promise.all(
        results.map(async result => {
          const coords = await geocodeLocation(result.location);
          return { ...result, ...coords };
        })
      );
      setMarkers(newMarkers);
    };
    processResults();
  }, [results]);

  const mapCenter = markers.length > 0 ? markers[0] : { lat: 34.052235, lng: -118.243683 };

  return (
    <Map
      defaultCenter={mapCenter}
      center={mapCenter}
      defaultZoom={11}
      mapId="localpulse_map"
      className="w-full h-full"
      gestureHandling={'greedy'}
      disableDefaultUI={true}
    >
      {markers.map((marker) => (
        <AdvancedMarker
          key={marker.id}
          position={marker}
          content={
            <div
              onMouseEnter={() => setHoveredItemId(marker.id)}
              onMouseLeave={() => setHoveredItemId(null)}
            >
              <MarkerIcon type={marker.type} isHovered={hoveredItemId === marker.id} />
            </div>
          }
        />
      ))}
       {results.length === 0 && (
         <div className="absolute inset-0 flex items-center justify-center bg-background/80">
            <Card className="max-w-sm text-center">
                <CardContent className="p-6">
                    <Flame className="mx-auto h-12 w-12 text-primary" />
                    <h3 className="mt-4 text-lg font-medium">Welcome to LocalPulse</h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                        Use the search bar to find exciting events and businesses in your community. The map will come alive with your results!
                    </p>
                </CardContent>
            </Card>
        </div>
      )}
    </Map>
  );
}