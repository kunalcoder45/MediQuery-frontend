// // import type { SymptomAnalysisOutput } from "@/ai/flows/symptom-analysis";

// // // export interface Message {
// // //   id: string;
// // //   sender: "user" | "bot" | "system";
// // //   text?: string;
// // //   suggestions?: SymptomAnalysisOutput['medicineSuggestions'];
// // //   pharmacies?: Pharmacy[];
// // //   isLoading?: boolean;
// // //   timestamp: Date;
// // // }

// // // export type MedicineSuggestion = NonNullable<SymptomAnalysisOutput['medicineSuggestions']>[0];

// // export interface Pharmacy {
// //   id: string;
// //   name: string;
// //   address: string;
// //   hours?: string; // e.g., "9:00 AM - 7:00 PM"
// //   phone?: string;
// //   lat?: number;
// //   lng?: number;
// // }


// // export interface Message {
// //   id: string;
// //   sender: "user" | "bot" | "system";
// //   text?: string;
// //   timestamp: Date;
// //   isLoading?: boolean;
// //   suggestions?: MedicineSuggestion[];
// // }

// // export interface MedicineSuggestion {
// //   medicineName: string;
// //   dosage: string;
// //   commonUse: string;
// //   precautions?: string;
// //   sideEffects?: string;
// //   price?: string;
// //   availability?: string;
// //   type?: "tablet" | "syrup" | "capsule" | "injection" | "cream";
// //   prescription?: "required" | "otc";
// // }




// import type { SymptomAnalysisOutput } from "@/ai/flows/symptom-analysis";

// // ✅ Pharmacy interface
// export interface Pharmacy {
//   id: string;
//   name: string;
//   address: string;
//   hours?: string; // e.g., "9:00 AM - 7:00 PM"
//   phone?: string;
//   lat?: number;
//   lng?: number;
// }

// // ✅ Medicine Suggestion interface
// export interface MedicineSuggestion {
//   medicineName: string;
//   dosage: string;
//   commonUse: string;
//   precautions?: string;
//   sideEffects?: string;
//   price?: string;
//   availability?: string;
//   type?: "tablet" | "syrup" | "capsule" | "injection" | "cream";
//   prescription?: "required" | "otc";
// }

// // ✅ Message interface
// export interface Message {
//   id: string;
//   sender: "user" | "bot" | "system";
//   text?: string;
//   timestamp: Date;
//   isLoading?: boolean;
//   suggestions?: MedicineSuggestion[];
//   pharmacies?: Pharmacy[];  // 👈 Ye bhi add kar diya
// }













// types.ts - Fixed type definitions
import type { SymptomAnalysisOutput } from "@/ai/flows/symptom-analysis";

// Pharmacy interface
export interface Pharmacy {
  id: string;
  name: string;
  address: string;
  hours?: string; // e.g., "9:00 AM - 7:00 PM"
  phone?: string;
  lat?: number;
  lng?: number;
}
// File: src/lib/types.ts

export interface MedicineSuggestion {
  medicineName: string;
  dosage: string;
  commonUse: string;
  precautions?: string;
  sideEffects?: string;
  price?: string;
  availability?: string;
  type?: string;
  prescription?: string;
}
// Message interface
export interface Message {
  id: string;
  sender: "user" | "bot" | "system";
  text?: string;
  timestamp: Date;
  isLoading?: boolean;
  suggestions?: MedicineSuggestion[];
  pharmacies?: Pharmacy[];
}


// in types.ts
export interface PartialMedicineSuggestion {
  medicineName: string;
  dosage: string;
  commonUse: string;
}