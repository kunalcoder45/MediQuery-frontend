// // File: src/ai/flows/symptom-analysis.ts

// 'use server';

// import {ai} from '@/ai/genkit';
// import {z} from 'genkit';

// const SymptomAnalysisInputSchema = z.object({
//   symptoms: z.string().describe('A description of the symptoms the user is experiencing.'),
// });
// export type SymptomAnalysisInput = z.infer<typeof SymptomAnalysisInputSchema>;

// // CORRECTED: Updated the schema to match the prompt's output
// const SymptomAnalysisOutputSchema = z.object({
//   medicineSuggestions: z.array(
//     z.object({
//       medicineName: z.string().describe('The name of the suggested medicine.'),
//       dosage: z.string().describe('The recommended dosage for the medicine.'),
//       commonUse: z.string().describe('The common uses for the medicine.'),
//       precautions: z.string().describe('Precautions to be taken.'),
//       sideEffects: z.string().describe('Possible side effects.'),
//       price: z.string().describe('Estimated price of the medicine.'),
//       availability: z.string().describe('Availability of the medicine.'),
//       type: z.string().describe('The type of medicine.'),
//       prescription: z.string().describe('Whether a prescription is required.'),
//     })
//   ).describe('A list of over-the-counter medicine suggestions with detailed information.'),
// });
// export type SymptomAnalysisOutput = z.infer<typeof SymptomAnalysisOutputSchema>;

// export async function analyzeSymptomsAndSuggestMedicines(input: SymptomAnalysisInput): Promise<SymptomAnalysisOutput> {
//   return symptomAnalysisFlow(input);
// }

// const prompt = ai.definePrompt({
//   name: 'symptomAnalysisPrompt',
//   input: {schema: SymptomAnalysisInputSchema},
//   output: {schema: SymptomAnalysisOutputSchema},
//   prompt: `You are a helpful AI assistant that analyzes a user's described symptoms and suggests appropriate over-the-counter medicines with dosages and common uses.

//   Analyze the user's symptoms and provide a JSON array of medicine suggestions.
//   For each medicine, include the following properties:
//   - medicineName: string
//   - dosage: string
//   - commonUse: string
//   - precautions: string
//   - sideEffects: string
//   - price: string
//   - availability: string
//   - type: string
//   - prescription: string
//   {{symptoms}}

//   Provide a list of medicine suggestions. For each medicine, include the medicine name, dosage, and common use.  Format your output as a JSON array of medicine suggestions.  Each suggestion should have the keys 'medicineName', 'dosage', and 'commonUse'.`,
// });

// const symptomAnalysisFlow = ai.defineFlow(
//   {
//     name: 'symptomAnalysisFlow',
//     inputSchema: SymptomAnalysisInputSchema,
//     outputSchema: SymptomAnalysisOutputSchema,
//   },
//   async input => {
//     const {output} = await prompt(input);
//     return output!;
//   }
// );




///





'use server';

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SymptomAnalysisInputSchema = z.object({
  symptoms: z.string().describe("User symptom description with additional details."),
});
export type SymptomAnalysisInput = z.infer<typeof SymptomAnalysisInputSchema>;

const SymptomAnalysisOutputSchema = z.object({
  medicineSuggestions: z.array(
    z.object({
      medicineName: z.string().describe('The name of the suggested medicine available in Indian market.'),
      dosage: z.string().describe('The recommended dosage for Indian adults.'),
      commonUse: z.string().describe('The common uses and symptoms this medicine treats.'),
      precautions: z.string().describe('Important precautions and warnings.'),
      sideEffects: z.string().describe('Common side effects to watch for.'),
      price: z.string().describe('Approximate price range in Indian Rupees.'),
      availability: z.string().describe('Availability information - prescription required or OTC.'),
      type: z.string().describe('Type of medicine - tablet, syrup, capsule, cream, etc.'),
      prescription: z.string().describe('Whether prescription is required or over-the-counter (OTC).')
    })
  ).describe('A list of medicine suggestions with complete details for Indian market.'),
  generalAdvice: z.string().describe('General health advice and home remedies.'),
  redFlags: z.string().describe('Warning signs when to see doctor immediately.'),
  disclaimer: z.string().describe('Medical disclaimer about consulting healthcare professionals.')
});
export type SymptomAnalysisOutput = z.infer<typeof SymptomAnalysisOutputSchema>;

export async function analyzeSymptomsAndSuggestMedicines(input: SymptomAnalysisInput): Promise<SymptomAnalysisOutput> {
  return symptomAnalysisFlow(input);
}

const prompt = ai.definePrompt({
  name: 'symptomAnalysisPrompt',
  input: { schema: SymptomAnalysisInputSchema },
  output: { schema: SymptomAnalysisOutputSchema },
  prompt: `You are an experienced Indian medical AI assistant with deep knowledge of medicines available in the Indian pharmaceutical market. 

IMPORTANT INSTRUCTIONS:
- You are NOT a replacement for a doctor - always emphasize consulting healthcare professionals
- Recommend only medicines commonly available in Indian pharmacies  
- Include both branded and generic Indian medicines
- Consider Indian climate, lifestyle, and common health conditions
- Provide proper dosages for Indian adults
- Include price ranges in Indian Rupees (₹)
- Specify if prescription is required or available over-the-counter
- Focus on affordable, accessible treatments

ANALYZE THESE SYMPTOMS, INCLUDING ADDITIONAL DETAILS: {{symptoms}}

Provide comprehensive medicine recommendations considering:
1. Common Indian brands (like Cipla, Sun Pharma, Dr. Reddy's products)
2. Ayurvedic and allopathic options where appropriate  
3. Seasonal factors (monsoon diseases, summer heat-related issues, winter cold/flu)
4. Indian dietary habits and lifestyle factors
5. Cost-effective solutions for middle-class families

For each medicine suggestion, provide:
- Medicine name (with popular Indian brand names)
- Exact dosage for adults
- Common uses and symptoms it treats
- Important precautions specific to Indian context
- Side effects to watch for
- Approximate price in ₹ (Indian Rupees)
- Availability (prescription required or OTC)
- Medicine type (tablet/syrup/capsule/gel etc.)

Also include:
- General advice with home remedies popular in India
- Red flag symptoms requiring immediate medical attention
- Professional medical disclaimer

Format your response as valid JSON with all the specified fields. Focus on practical, affordable solutions available across India.`
});

const symptomAnalysisFlow = ai.defineFlow(
  {
    name: 'symptomAnalysisFlow',
    inputSchema: SymptomAnalysisInputSchema,
    outputSchema: SymptomAnalysisOutputSchema,
  },
  async (input: SymptomAnalysisInput): Promise<SymptomAnalysisOutput> => {
    const { output } = await prompt(input);
    return output!;
  }
);