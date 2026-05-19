'use server';
/**
 * @fileOverview A Genkit flow for recommending suitable master traders to followers.
 *
 * - recommendTraders - A function that handles the trader recommendation process.
 * - RecommendTradersInput - The input type for the recommendTraders function.
 * - RecommendTradersOutput - The return type for the recommendTraders function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RecommendTradersInputSchema = z.object({
  riskTolerance: z.enum(['low', 'medium', 'high', 'aggressive']).describe('The follower\'s willingness to take on investment risk.'),
  investmentGoals: z.array(z.string()).describe('A list of investment goals for the follower (e.g., "long-term growth", "short-term gains", "income generation").'),
  preferredAssetClasses: z.array(z.string()).describe('A list of preferred asset classes for the follower (e.g., "stocks", "forex", "cryptocurrency", "commodities").'),
});
export type RecommendTradersInput = z.infer<typeof RecommendTradersInputSchema>;

const RecommendTradersOutputSchema = z.object({
  traders: z.array(
    z.object({
      name: z.string().describe('The name of the recommended master trader.'),
      strategySummary: z.string().describe('A brief summary of the trader\'s main strategy and approach.'),
      riskScore: z.number().describe('A numerical score representing the trader\'s risk level, e.g., 1 (low risk) to 10 (high risk).'),
      averageAnnualReturn: z.string().describe('The trader\'s average annual return, e.g., "+15% per year" or "10-12% annually".'),
      reasonForRecommendation: z.string().describe('A concise explanation of why this trader is recommended based on the follower\'s profile.'),
    })
  ).describe('A list of master traders recommended based on the follower\'s criteria.'),
});
export type RecommendTradersOutput = z.infer<typeof RecommendTradersOutputSchema>;

export async function recommendTraders(input: RecommendTradersInput): Promise<RecommendTradersOutput> {
  return recommendTradersFlow(input);
}

const prompt = ai.definePrompt({
  name: 'traderRecommendationPrompt',
  input: {schema: RecommendTradersInputSchema},
  output: {schema: RecommendTradersOutputSchema},
  prompt: `You are an expert financial advisor specializing in copy trading, tasked with recommending suitable master traders to a new follower.
The follower has provided the following preferences:

Risk Tolerance: {{{riskTolerance}}}
Investment Goals: {{#each investmentGoals}} - {{{this}}}
{{/each}}
Preferred Asset Classes: {{#each preferredAssetClasses}} - {{{this}}}
{{/each}}

Based on these preferences, identify master traders who align with their financial strategy. For each recommendation, provide a name, a summary of their strategy, their typical risk score (1-10), their average annual return, and a clear reason for why they are a good fit.

Ensure the output is in JSON format, strictly adhering to the provided schema.`,
});

const recommendTradersFlow = ai.defineFlow(
  {
    name: 'recommendTradersFlow',
    inputSchema: RecommendTradersInputSchema,
    outputSchema: RecommendTradersOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
