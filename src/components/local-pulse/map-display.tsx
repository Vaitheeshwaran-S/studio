
"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import L from 'leaflet';
import 'leaflet.markercluster';
import type { SearchResultItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Flame, X } from 'lucide-react';

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

const createIcon = (type: 'event' | 'business', isHovered: boolean) => {
    const iconHtml = `
      <div 
        class="p-2 rounded-full flex items-center justify-center transition-all duration-200 shadow-lg" 
        style="background-color: hsl(var(--${isHovered ? 'accent' : 'primary'})); color: hsl(var(--${isHovered ? 'accent-foreground' : 'primary-foreground'}));">
        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          ${type === 'event' ? '<rect width="18" height="18" x="3" y="4" rx="2" ry="2"/><line x1="16" x2="16" y1="2" y2="6"/><line x1="8" x2="8" y1="2" y2="6"/><line x1="3" x2="21" y1="10" y2="10"/>' : '<rect width="16" height="20" x="4" y="2" rx="2"/><path d="M9 22v-4h6v4"/><path d="M8 6h.01"/><path d="M16 6h.01"/><path d="M12 6h.01"/><path d="M12 10h.01"/><path d="M12 14h.01"/><path d="M16 10h.01"/><path d="M16 14h.01"/><path d="M8 10h.01"/><path d="M8 14h.01"/>'}
        </svg>
      </div>
    `;
    return L.divIcon({
        html: iconHtml,
        className: 'bg-transparent border-none',
        iconSize: [36, 36],
        iconAnchor: [18, 18],
    });
};

export default function MapDisplay({ results, hoveredItemId, setHoveredItemId, showWelcome, setShowWelcome, userLocation }: MapDisplayProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markerClusterGroupRef = useRef<L.MarkerClusterGroup | null>(null);
  const [markers, setMarkers] = useState<MarkerData[]>([]);

  const initialCenter = useMemo((): L.LatLngTuple => {
    if (userLocation) {
      return [userLocation.lat, userLocation.lng];
    }
    return [34.052235, -118.243683]; // Default to Los Angeles
  }, [userLocation]);

  const initialZoom = useMemo(() => {
    return userLocation ? 12 : 10;
  }, [userLocation]);

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

  useEffect(() => {
    if (mapRef.current && !mapInstanceRef.current) {
      mapInstanceRef.current = L.map(mapRef.current, {
        center: initialCenter,
        zoom: initialZoom,
        scrollWheelZoom: true,
      });

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(mapInstanceRef.current);

      markerClusterGroupRef.current = L.markerClusterGroup();
      mapInstanceRef.current.addLayer(markerClusterGroupRef.current);
    }
  }, [initialCenter, initialZoom]);
  
  useEffect(() => {
    const map = mapInstanceRef.current;
    const clusterGroup = markerClusterGroupRef.current;
    if (!map || !clusterGroup) return;

    clusterGroup.clearLayers();
    
    const allMarkers: L.Marker[] = [];

    markers.forEach(marker => {
        const leafletMarker = L.marker([marker.lat, marker.lng], { 
            icon: createIcon(marker.type, hoveredItemId === marker.id) 
        });
        leafletMarker.bindPopup(`<b>${marker.name}</b>`);
        leafletMarker.on('mouseover', () => setHoveredItemId(marker.id));
        leafletMarker.on('mouseout', () => setHoveredItemId(null));

        clusterGroup.addLayer(leafletMarker);
        allMarkers.push(leafletMarker);
    });

    if (allMarkers.length > 0 && results.length > 0) {
        const group = new L.FeatureGroup(allMarkers);
        map.fitBounds(group.getBounds().pad(0.5), { animate: true });
    } else if (results.length === 0) {
        map.setView(initialCenter, initialZoom, {animate: true});
    }

  }, [markers, hoveredItemId, setHoveredItemId, initialCenter, initialZoom, results.length]);


  return (
    <div className="relative w-full h-full">
        <div ref={mapRef} className="w-full h-full z-0" />
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
