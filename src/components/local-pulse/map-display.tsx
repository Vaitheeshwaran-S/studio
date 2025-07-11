
"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, useMap, Popup } from 'react-leaflet';
import type { SearchResultItem } from '@/lib/types';
import L from 'leaflet';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, X } from 'lucide-react';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import 'leaflet.markercluster/dist/MarkerCluster.css';
import 'leaflet.markercluster/dist/MarkerCluster.Default.css';


const createIcon = (type: 'event' | 'business') => {
    const iconHtml = `<div class="p-1 rounded-full flex items-center justify-center" style="background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground));">
      ${type === 'event' ? 
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-calendar-days w-5 h-5"><rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/><path d="M8 14h.01"/><path d="M12 14h.01"/><path d="M16 14h.01"/><path d="M8 18h.01"/><path d="M12 18h.01"/><path d="M16 18h.01"/></svg>' : 
        '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-building w-5 h-5"><rect width="16" height="20" x="4" y="2" rx="2" ry="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/></svg>'
      }
    </div>`;
  
    return L.divIcon({
      html: iconHtml,
      className: 'bg-transparent border-0',
      iconSize: [32, 32],
      iconAnchor: [16, 32],
      popupAnchor: [0, -32]
    });
};

const eventIcon = createIcon('event');
const businessIcon = createIcon('business');

interface MapDisplayProps {
  results: SearchResultItem[];
  hoveredItemId: string | null;
  setHoveredItemId: (id: string | null) => void;
  showWelcome: boolean;
  setShowWelcome: (show: boolean) => void;
  userLocation: { lat: number; lng: number } | null;
}

const geocodeLocation = (locationName: string): Promise<{ lat: number; lng: number }> => {
  return new Promise(resolve => {
    // Simple pseudo-random geocoding for demonstration
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

const MapUpdater = ({ center, zoom }: { center: [number, number], zoom: number }) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.setView(center, zoom);
    }
  }, [center, zoom, map]);
  return null;
};

const MapMarkers = ({ results, setHoveredItemId }: { results: SearchResultItem[], setHoveredItemId: (id: string | null) => void }) => {
    const [markers, setMarkers] = useState<MarkerData[]>([]);

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

    if(markers.length === 0) return null;

    return (
        <MarkerClusterGroup chunkedLoading>
            {markers.map((marker) => (
                <Marker
                    key={marker.id}
                    position={[marker.lat, marker.lng]}
                    icon={marker.type === 'event' ? eventIcon : businessIcon}
                    eventHandlers={{
                        mouseover: () => setHoveredItemId(marker.id),
                        mouseout: () => setHoveredItemId(null),
                    }}
                >
                    <Popup>
                        <div className="font-bold">{marker.name}</div>
                        <div>{marker.type === 'event' ? 'Event' : 'Business'}</div>
                    </Popup>
                </Marker>
            ))}
        </MarkerClusterGroup>
    );
};

export default function MapDisplay({ results, hoveredItemId, setHoveredItemId, showWelcome, setShowWelcome, userLocation }: MapDisplayProps) {
  const mapCenter: [number, number] = useMemo(() => {
    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }
    return [34.052235, -118.243683]; // Default center (Los Angeles)
  }, [userLocation]);

  const mapZoom = useMemo(() => {
    return userLocation || results.length > 0 ? 13 : 11;
  }, [userLocation, results]);

  return (
    <div className="relative w-full h-full">
        <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            className="w-full h-full z-0"
            scrollWheelZoom={true}
            style={{ height: '100%', width: '100%' }}
        >
            <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapUpdater center={mapCenter} zoom={mapZoom} />
            <MapMarkers results={results} setHoveredItemId={setHoveredItemId} />
        </MapContainer>
        {showWelcome && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80 z-10">
            <Card className="max-w-sm text-center relative">
                <Button 
                    variant="ghost" 
                    size="icon" 
                    className="absolute top-2 right-2 h-6 w-6"
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
