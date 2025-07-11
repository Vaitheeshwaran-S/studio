'use server';

import { smartSearch as smartSearchFlow, type SmartSearchInput } from '@/ai/flows/smart-search';

export async function handleSmartSearch(input: SmartSearchInput) {
  try {
    const result = await smartSearchFlow(input);
    return { success: true, data: result.results };
  } catch (error) {
    console.error('Error in smart search flow:', error);
    return { success: false, error: 'An error occurred during the search. Please try again.' };
  }
}
