
// src/ai/flows/smart-search.ts
'use server';
/**
 * @fileOverview A smart search AI agent for events and businesses.
 *
 * - smartSearch - A function that handles the smart search process.
 * - SmartSearchInput - The input type for the smartSearch function.
 * - SmartSearchOutput - The return type for the smartSearch function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SmartSearchInputSchema = z.object({
  keywords: z.string().describe('Keywords to search for events and businesses.'),
  userLocation: z.string().optional().describe('The user\'s current location as "latitude,longitude".'),
});
export type SmartSearchInput = z.infer<typeof SmartSearchInputSchema>;

const SmartSearchOutputSchema = z.object({
  results: z.array(
    z.object({
      type: z.enum(['event', 'business']).describe('The type of result.'),
      name: z.string().describe('The name of the event or business.'),
      description: z.string().describe('A short description of the event or business.'),
      location: z.string().describe('The location of the event or business (e.g., "Downtown Los Angeles", "Santa Monica Pier").'),
    })
  ).describe('A list of search results.'),
});
export type SmartSearchOutput = z.infer<typeof SmartSearchOutputSchema>;

export async function smartSearch(input: SmartSearchInput): Promise<SmartSearchOutput> {
  return smartSearchFlow(input);
}

const prompt = ai.definePrompt({
  name: 'smartSearchPrompt',
  input: {schema: SmartSearchInputSchema},
  output: {schema: SmartSearchOutputSchema},
  prompt: `You are a search assistant helping users find local events and businesses.

  Based on the user's keywords and location, find relevant events and businesses.
  Return a list of results, including the type (event or business), name, description, and a general location name (not a full address).
  Prioritize results that are near the user's location if provided.

  Keywords: {{{keywords}}}
  {{#if userLocation}}User's Location (lat,lon): {{{userLocation}}}{{/if}}
  `,
});

const smartSearchFlow = ai.defineFlow(
  {
    name: 'smartSearchFlow',
    inputSchema: SmartSearchInputSchema,
    outputSchema: SmartSearchOutputSchema,
  },
  async input => {
    // In a real app, you would have a tool here to query a database or external API.
    const { output } = await prompt(input);
    return output!;
  }
);
