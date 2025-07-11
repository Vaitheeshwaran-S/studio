
import type { SearchResultItem } from './types';

// Omit id, lat, lng because they will be added dynamically in the component
type RawData = Omit<SearchResultItem, 'id' | 'lat' | 'lng'> & { city: string; coordinates: { lat: number; lng: number } };

export const initialData: RawData[] = [
  // Delhi
  {
    type: 'mall',
    name: 'Select Citywalk',
    description: 'A popular shopping mall with a variety of international and domestic brands.',
    location: 'Saket, New Delhi',
    city: 'Delhi',
    coordinates: { lat: 28.5285, lng: 77.2194 }
  },
  {
    type: 'shop',
    name: 'Khan Market',
    description: 'An upscale market with designer boutiques, bookstores, and restaurants.',
    location: 'Khan Market, New Delhi',
    city: 'Delhi',
    coordinates: { lat: 28.6003, lng: 77.2272 }
  },
  {
    type: 'event',
    name: 'Qutub Festival',
    description: 'An annual cultural festival featuring classical music and dance performances.',
    location: 'Qutub Minar Complex, New Delhi',
    city: 'Delhi',
    coordinates: { lat: 28.5245, lng: 77.1855 }
  },

  // Mumbai
  {
    type: 'mall',
    name: 'High Street Phoenix',
    description: 'One of the largest malls in India, offering a luxury shopping experience.',
    location: 'Lower Parel, Mumbai',
    city: 'Mumbai',
    coordinates: { lat: 18.9947, lng: 72.8258 }
  },
  {
    type: 'shop',
    name: 'Colaba Causeway',
    description: 'A bustling street market famous for fashion, accessories, and antiques.',
    location: 'Colaba, Mumbai',
    city: 'Mumbai',
    coordinates: { lat: 18.922, lng: 72.831 }
  },
  {
    type: 'event',
    name: 'Kala Ghoda Arts Festival',
    description: 'A vibrant annual arts festival showcasing visual arts, music, dance, and theater.',
    location: 'Kala Ghoda, Mumbai',
    city: 'Mumbai',
    coordinates: { lat: 18.9322, lng: 72.8322 }
  },

  // Bangalore
  {
    type: 'mall',
    name: 'Phoenix Marketcity',
    description: 'A large mall with a wide range of stores, a cinema, and a food court.',
    location: 'Whitefield, Bangalore',
    city: 'Bangalore',
    coordinates: { lat: 12.9961, lng: 77.6961 }
  },
  {
    type: 'shop',
    name: 'Commercial Street',
    description: 'A busy shopping street known for clothing, footwear, and accessories at great prices.',
    location: 'Tasker Town, Bangalore',
    city: 'Bangalore',
    coordinates: { lat: 12.9819, lng: 77.6079 }
  },
  {
    type: 'business',
    name: 'Mavalli Tiffin Rooms (MTR)',
    description: 'A legendary restaurant serving authentic South Indian cuisine since 1924.',
    location: 'Lalbagh Road, Bangalore',
    city: 'Bangalore',
    coordinates: { lat: 12.9558, lng: 77.5833 }
  },
   // Chennai
  {
    type: 'mall',
    name: 'Express Avenue',
    description: 'A premium shopping mall located in the heart of Chennai.',
    location: 'Royapettah, Chennai',
    city: 'Chennai',
    coordinates: { lat: 13.0583, lng: 80.2635 }
  },
  {
    type: 'shop',
    name: 'T. Nagar',
    description: 'A major shopping district known for its silk sarees and gold jewelry shops.',
    location: 'Thyagaraya Nagar, Chennai',
    city: 'Chennai',
    coordinates: { lat: 13.0400, lng: 80.2334 }
  },
   {
    type: 'business',
    name: 'Murugan Idli Shop',
    description: 'Famous for its soft idlis and a wide variety of chutneys.',
    location: 'T. Nagar, Chennai',
    city: 'Chennai',
    coordinates: { lat: 13.0378, lng: 80.2323 }
  }
];
