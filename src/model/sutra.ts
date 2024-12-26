// Define a type or interface for a single object structure
export interface SutraDataModel {
     ID: string;                // Unique ID for this object
     ຊື່ພຣະສູດ: string;       // Name of the Sutra
     ຮູບ: string;             // Image URL (can be empty)
     ພຣະສູດ: string;         // Sutra content or description
     ໝວດທັມ: string;         // Category or Dharma classification
     ສຽງ: string;            // Additional field for sound (audio), if any
}

// Define the array type
export type SutraDataArray = SutraDataModel[];
