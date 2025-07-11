
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/local-pulse/header';
import ResultsList from '@/components/local-pulse/results-list';
import { Skeleton } from '@/components/ui/skeleton';
import { initialData } from '@/lib/data';
import type { SearchResultItem } from '@/lib/types';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';

const MapDisplay = dynamic(() => import('@/components/local-pulse/map-display'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

const allLocations = ["All", ...Array.from(new Set(initialData.map(item => item.city)))];

export default function Home() {
  const [results, setResults] = React.useState<SearchResultItem[]>([]);
  const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null);
  const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocation, setSelectedLocation] = React.useState<string>("All");

  React.useEffect(() => {
    // Add a unique ID to each result for keying and hover effects
    const resultsWithIds = initialData.map((r, index) => ({
      ...r,
      id: `${r.name}-${index}`,
      lat: r.coordinates.lat,
      lng: r.coordinates.lng,
    }));
    
    const filteredResults = selectedLocation === "All"
      ? resultsWithIds
      : resultsWithIds.filter(item => item.city === selectedLocation);
      
    setResults(filteredResults);

  }, [selectedLocation]);

  React.useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col gap-6">
        <Card>
          <CardContent className="p-4">
             <div className="w-full sm:w-1/3">
                <label className="text-sm font-medium mb-2 block">Filter by City</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a city" />
                  </SelectTrigger>
                  <SelectContent>
                    {allLocations.map(location => (
                      <SelectItem key={location} value={location}>
                        {location}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
          </CardContent>
        </Card>
        
        <div className="flex-grow grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 min-h-[400px] md:min-h-0 rounded-lg overflow-hidden shadow-lg relative">
             <MapDisplay
                results={results}
                hoveredItemId={hoveredItemId}
                setHoveredItemId={setHoveredItemId}
                userLocation={userLocation}
              />
          </div>
          <div className="md:col-span-1 flex flex-col">
              <ResultsList results={results} isLoading={false} hoveredItemId={hoveredItemId} setHoveredItemId={setHoveredItemId} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Powered by Vaitheeshwaran S</p>
      </footer>
    </div>
  );
}
