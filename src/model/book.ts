// Define a type or interface for a single object structure
export interface BookDataModel {
     ID: string;
     ຊື່: string;
     ໝວດຟາຍ: string;
     ໝວດທັມ: string;
     link: string;
     imageURL: string;
}

// Define the array type
export type BookDataArray = BookDataModel[];
