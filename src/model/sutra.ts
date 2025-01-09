// Sutra Data
export interface SutraDataModel {
     ID: string;                // Unique ID for this object
     ຊື່ພຣະສູດ: string;       // Name of the Sutra
     ພຣະສູດ: string;         // Sutra content or description
     ຮູບ: string;             // Image URL (can be empty)
     ໝວດທັມ: string;         // Category or Dharma classification
     ສຽງ: string;            // Additional field for sound (audio), if any
}

// Define the array type
export type SutraDataArray = SutraDataModel[];


// Buddha Nature Data
export interface BuddhaNatrueDataModel {
     _id: string
     user: string
     title: string
     content: string
     description: string
     thumbnail: string
     category: string
     createdAt: string
     updatedAt: string
     __v: number
}

export type BuddhaNatrueDataArray = BuddhaNatrueDataModel[]
