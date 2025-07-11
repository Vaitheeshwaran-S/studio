
"use client";

import * as React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building, CalendarDays, MapPin, ArrowDownUp, Filter, ShoppingBag, ShoppingCart } from 'lucide-react';
import type { SearchResultItem } from '@/lib/types';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '../ui/skeleton';

type ResultsListProps = {
  results: SearchResultItem[];
  isLoading: boolean;
  hoveredItemId: string | null;
  setHoveredItemId: (id: string | null) => void;
};

const TypeIcon = ({ type }: { type: SearchResultItem['type'] }) => {
  switch (type) {
    case 'event':
      return <CalendarDays className="w-5 h-5 text-accent" />;
    case 'business':
      return <Building className="w-5 h-5 text-accent" />;
    case 'shop':
      return <ShoppingBag className="w-5 h-5 text-accent" />;
    case 'mall':
      return <ShoppingCart className="w-5 h-5 text-accent" />;
    default:
      return <Building className="w-5 h-5 text-accent" />;
  }
};


export default function ResultsList({ results, isLoading, hoveredItemId, setHoveredItemId }: ResultsListProps) {
  const [sortOrder, setSortOrder] = React.useState('name-asc');
  const [filterType, setFilterType] = React.useState('all');

  const filteredAndSortedResults = React.useMemo(() => {
    return results
      .filter(item => filterType === 'all' || item.type === filterType)
      .sort((a, b) => {
        if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
        if (sortOrder === 'name-desc') return b.name.localeCompare(a.name);
        return 0;
      });
  }, [results, sortOrder, filterType]);
  
  const renderSkeleton = () => (
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-3/4" />
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <Card className="flex flex-col h-full shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-headline">Community Listings</CardTitle>
        <div className="flex flex-col sm:flex-row gap-2 pt-2">
          <div className="flex-1">
            <Select value={sortOrder} onValueChange={setSortOrder}>
              <SelectTrigger className="w-full">
                <ArrowDownUp className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="name-asc">Name (A-Z)</SelectItem>
                <SelectItem value="name-desc">Name (Z-A)</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex-1">
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full">
                 <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Filter by type..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="event">Events</SelectItem>
                <SelectItem value="business">Businesses</SelectItem>
                <SelectItem value="shop">Shops</SelectItem>
                <SelectItem value="mall">Malls</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <Separator />
      <ScrollArea className="flex-grow">
        <div className="p-4">
          {isLoading ? (
             renderSkeleton()
          ) : filteredAndSortedResults.length > 0 ? (
            <div className="space-y-4">
              {filteredAndSortedResults.map((item) => (
                <Card
                  key={item.id}
                  className={`transition-all duration-200 ${hoveredItemId === item.id ? 'border-primary shadow-primary/20 shadow-lg' : ''}`}
                  onMouseEnter={() => setHoveredItemId(item.id)}
                  onMouseLeave={() => setHoveredItemId(null)}
                >
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <TypeIcon type={item.type} />
                      {item.name}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground mb-2">{item.description}</p>
                    <div className="flex items-center text-sm text-foreground">
                      <MapPin className="w-4 h-4 mr-2" />
                      <span>{item.location}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="text-center text-muted-foreground py-16">
              <p>No results for this filter.</p>
              <p className="text-sm">Try selecting a different city or type.</p>
            </div>
          )}
        </div>
      </ScrollArea>
    </Card>
  );
}
