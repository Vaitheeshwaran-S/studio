
export type SearchResultItem = {
  id: string;
  type: 'event' | 'business' | 'mall' | 'shop';
  name: string;
  description: string;
  location: string;
  city: string;
  lat: number;
  lng: number;
};
