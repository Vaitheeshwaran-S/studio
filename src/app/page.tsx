"use client";

import * as React from 'react';
import { APIProvider } from '@vis.gl/react-google-maps';
import Header from '@/components/local-pulse/header';
import SmartSearch from '@/components/local-pulse/smart-search';
import MapDisplay from '@/components/local-pulse/map-display';
import ResultsList from '@/components/local-pulse/results-list';
import type { SearchResultItem } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Flame } from 'lucide-react';

export default function Home() {
  const [results, setResults] = React.useState<SearchResultItem[]>([]);
  const [isSearching, setIsSearching] = React.useState(false);
  const [hoveredItemId, setHoveredItemId] = React.useState<string | null>(null);
  const [showWelcome, setShowWelcome] = React.useState(true);

  const handleResults = (newResults: SearchResultItem[]) => {
    // Add a unique ID to each result for keying and hover effects
    const resultsWithIds = newResults.map((r, index) => ({ ...r, id: `${r.name}-${index}` }));
    setResults(resultsWithIds);
    if (newResults.length > 0) {
      setShowWelcome(false);
    }
  };

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''}>
      <div className="flex flex-col min-h-screen bg-background">
        <Header />
        <main className="flex-1 container mx-auto p-4 md:p-6 flex flex-col gap-6">
          <SmartSearch
            onResults={handleResults}
            isSearching={isSearching}
            setIsSearching={setIsSearching}
          />
          <div className="flex-grow grid md:grid-cols-3 gap-6">
            <div className="md:col-span-2 min-h-[400px] md:min-h-0 rounded-lg overflow-hidden shadow-lg">
              <MapDisplay 
                results={results} 
                hoveredItemId={hoveredItemId} 
                setHoveredItemId={setHoveredItemId}
                showWelcome={showWelcome}
                setShowWelcome={setShowWelcome}
              />
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
    </APIProvider>
  );
}
