
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
  },

  // Coimbatore
  {
    type: 'mall',
    name: 'Brookefields Mall',
    description: 'A premier shopping mall with a multiplex and a food court.',
    location: 'RS Puram, Coimbatore',
    city: 'Coimbatore',
    coordinates: { lat: 11.0116, lng: 76.9554 }
  },
  {
    type: 'mall',
    name: 'Fun Republic Mall',
    description: 'A popular destination for shopping, dining, and entertainment.',
    location: 'Peelamedu, Coimbatore',
    city: 'Coimbatore',
    coordinates: { lat: 11.0305, lng: 77.0055 }
  },
  {
    type: 'shop',
    name: 'Cross-Cut Road',
    description: 'A bustling commercial street known for textile and jewelry shops.',
    location: 'Gandhipuram, Coimbatore',
    city: 'Coimbatore',
    coordinates: { lat: 11.0181, lng: 76.9656 }
  },
  {
    type: 'business',
    name: 'Annapoorna Gowrishankar',
    description: 'A famous chain of vegetarian restaurants known for its South Indian delicacies.',
    location: 'RS Puram, Coimbatore',
    city: 'Coimbatore',
    coordinates: { lat: 11.0055, lng: 76.9558 }
  },

  // Kolkata
  {
    type: 'mall',
    name: 'South City Mall',
    description: 'One of the most popular malls in Eastern India.',
    location: 'Jadavpur, Kolkata',
    city: 'Kolkata',
    coordinates: { lat: 22.4979, lng: 88.3657 }
  },
  {
    type: 'shop',
    name: 'New Market',
    description: 'A historic and vast market with everything from clothing to food.',
    location: 'Lindsay Street, Kolkata',
    city: 'Kolkata',
    coordinates: { lat: 22.5600, lng: 88.3563 }
  },

  // Hyderabad
  {
    type: 'mall',
    name: 'Inorbit Mall',
    description: 'A large mall in the Hitech City area with international brands.',
    location: 'Madhapur, Hyderabad',
    city: 'Hyderabad',
    coordinates: { lat: 17.4265, lng: 78.3986 }
  },
  {
    type: 'business',
    name: 'Paradise Biryani',
    description: 'World-famous for its Hyderabadi Dum Biryani.',
    location: 'Secunderabad, Hyderabad',
    city: 'Hyderabad',
    coordinates: { lat: 17.4423, lng: 78.4984 }
  },

  // Pune
  {
    type: 'mall',
    name: 'Phoenix Marketcity',
    description: 'A massive mall with a huge variety of stores, restaurants, and entertainment.',
    location: 'Viman Nagar, Pune',
    city: 'Pune',
    coordinates: { lat: 18.5621, lng: 73.9167 }
  },
  {
    type: 'shop',
    name: 'FC Road',
    description: 'Fergusson College Road, a popular street for shopping and street food.',
    location: 'Deccan Gymkhana, Pune',
    city: 'Pune',
    coordinates: { lat: 18.5218, lng: 73.8407 }
  },

  // Ahmedabad
  {
    type: 'mall',
    name: 'AlphaOne Mall',
    description: 'Now known as Ahmedabad One, a large shopping complex.',
    location: 'Vastrapur, Ahmedabad',
    city: 'Ahmedabad',
    coordinates: { lat: 23.0333, lng: 72.5278 }
  },
  {
    type: 'event',
    name: 'Uttarayan',
    description: 'The famous international kite festival held in January.',
    location: 'Sabarmati Riverfront, Ahmedabad',
    city: 'Ahmedabad',
    coordinates: { lat: 23.0258, lng: 72.5873 }
  },
  
  // Jaipur
  {
      type: 'mall',
      name: 'World Trade Park',
      description: 'An iconic mall with a unique architectural design.',
      location: 'Malviya Nagar, Jaipur',
      city: 'Jaipur',
      coordinates: { lat: 26.8546, lng: 75.8055 }
  },
  {
      type: 'shop',
      name: 'Johari Bazaar',
      description: 'A famous market in the old city for gems, jewelry, and sarees.',
      location: 'Pink City, Jaipur',
      city: 'Jaipur',
      coordinates: { lat: 26.9189, lng: 75.8286 }
  },

  // Lucknow
  {
      type: 'mall',
      name: 'Phoenix Palassio',
      description: 'A large and luxurious mall with a grand design.',
      location: 'Gomti Nagar, Lucknow',
      city: 'Lucknow',
      coordinates: { lat: 26.8407, lng: 81.0039 }
  },
  {
      type: 'business',
      name: 'Tunday Kababi',
      description: 'A legendary eatery famous for its Galouti kebabs.',
      location: 'Aminabad, Lucknow',
      city: 'Lucknow',
      coordinates: { lat: 26.8433, lng: 80.9229 }
  },

  // Chandigarh
  {
      type: 'mall',
      name: 'Elante Mall',
      description: 'One of the largest malls in Northern India.',
      location: 'Industrial Area Phase I, Chandigarh',
      city: 'Chandigarh',
      coordinates: { lat: 30.7075, lng: 76.7911 }
  },
  {
      type: 'shop',
      name: 'Sector 17 Market',
      description: 'A popular open-air shopping plaza and the heart of the city.',
      location: 'Sector 17, Chandigarh',
      city: 'Chandigarh',
      coordinates: { lat: 30.7415, lng: 76.7797 }
  }
];
