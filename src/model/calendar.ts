// Define a type or interface for a single object structure
export interface CalendarDataModel {
     poster?: string;
     title?: string;
     startDateTime?: string;
     endDateTime?: string;
     details?: string;
     social?: string;
     location1?: string;
     location2?: string;
     location3?: string;
     location4?: string;
}

// Define the array type
export type CalendarDataArray = CalendarDataModel[];
