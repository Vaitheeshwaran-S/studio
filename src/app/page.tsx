
"use client";

import * as React from 'react';
import dynamic from 'next/dynamic';
import Header from '@/components/local-pulse/header';
import SmartSearch from '@/components/local-pulse/smart-search';
import ResultsList from '@/components/local-pulse/results-list';
import type { SearchResultItem } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { APIProvider } from '@vis.gl/react-google-maps';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const MapDisplay = dynamic(() => import('@/components/local-pulse/map-display'), {
  ssr: false,
  loading: () => <Skeleton className="w-full h-full" />,
});

export default function Home() {
  const [results, setResults] = React.useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null);
  const [showWelcome, setShowWelcome] = React.useState(true);
  const [userLocation, setUserLocation] = React.useState<{ lat: number; lng: number } | null>(null);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  React.useEffect(() => {
    // Only run on client
    if (typeof window !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          if (results.length === 0) {
            setShowWelcome(false);
          }
        },
        (error) => {
          console.error("Error getting user location:", error);
          setShowWelcome(true); // Keep welcome if permission is denied
        }
      );
    }
  }, [results.length]);

  const handleResults = (newResults: SearchResultItem[]) => {
    // Add a unique ID to each result for keying and hover effects
    const resultsWithIds = newResults.map((r, index) => ({ ...r, id: `${r.name}-${index}` }));
    setResults(resultsWithIds);
    if (newResults.length > 0) {
      setShowWelcome(false);
    }
  };

  const renderMapContent = () => {
    if (!apiKey) {
      return (
        <div className="flex items-center justify-center w-full h-full bg-muted">
          <Card className="max-w-md m-4">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="text-destructive" />
                Map Configuration Needed
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-muted-foreground">
              <p>The Google Maps API key is missing.</p>
              <p>Please create a <code className="bg-background p-1 rounded">.env.local</code> file in your project root and add your API key:</p>
              <pre className="p-2 text-sm text-foreground bg-background rounded-md">
                NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=YOUR_API_KEY
              </pre>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
       <APIProvider apiKey={apiKey} libraries={['marker']}>
         <MapDisplay
            results={results}
            hoveredItemId={hoveredItemId}
            setHoveredItemId={setHoveredItemId}
            showWelcome={showWelcome}
            setShowWelcome={setShowWelcome}
            userLocation={userLocation}
          />
       </APIProvider>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col gap-6">
        <SmartSearch
          onResults={handleResults}
          isSearching={isSearching}
          setIsSearching={setIsSearching}
          userLocation={userLocation}
        />
        <div className="flex-grow grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 min-h-[400px] md:min-h-0 rounded-lg overflow-hidden shadow-lg relative">
            {renderMapContent()}
          </div>
          <div className="md:col-span-1 flex flex-col">
              <ResultsList results={results} isLoading={isSearching} hoveredItemId={hoveredItemId} setHoveredItemId={setHoveredItemId} />
          </div>
        </div>
      </main>
      <footer className="text-center p-4 text-muted-foreground text-sm">
        <p>Powered by Vaitheeshwaran S</p>
      </footer>
    </div>
  );
}
