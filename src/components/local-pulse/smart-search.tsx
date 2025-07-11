
"use client";

import * as React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Search } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { handleSmartSearch } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';
import type { SearchResultItem } from '@/lib/types';
import type { SmartSearchInput } from '@/ai/flows/smart-search';

const searchSchema = z.object({
  keywords: z.string().min(3, { message: 'Please enter at least 3 characters.' }),
});

type SmartSearchProps = {
  onResults: (results: SearchResultItem[]) => void;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  userLocation: { lat: number; lng: number } | null;
};

export default function SmartSearch({ onResults, isSearching, setIsSearching, userLocation }: SmartSearchProps) {
  const { toast } = useToast();
  const form = useForm<z.infer<typeof searchSchema>>({
    resolver: zodResolver(searchSchema),
    defaultValues: {
      keywords: '',
    },
  });

  async function onSubmit(values: z.infer<typeof searchSchema>) {
    setIsSearching(true);
    const searchInput: SmartSearchInput = { 
        keywords: values.keywords,
        userLocation: userLocation ? `${userLocation.lat},${userLocation.lng}` : undefined,
    };
    const result = await handleSmartSearch(searchInput);
    setIsSearching(false);

    if (result.success && result.data) {
      onResults(result.data);
    } else {
      toast({
        variant: 'destructive',
        title: 'Search Failed',
        description: result.error,
      });
    }
  }

  return (
    <div className="bg-card p-4 rounded-lg shadow-md border">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row items-start gap-4">
          <FormField
            control={form.control}
            name="keywords"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input 
                    placeholder="Search for 'live music', 'coffee shops', 'weekend markets'..." 
                    {...field} 
                    className="text-base"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" disabled={isSearching} className="w-full sm:w-auto">
            {isSearching ? (
              <>
                <div className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin mr-2" />
                Searching...
              </>
            ) : (
              <>
                <Search className="mr-2" />
                Search
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
