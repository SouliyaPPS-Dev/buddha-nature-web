import BuddhaNatureJsonData from "@/assets/buddha-nature.json";
import { BuddhaNatrueDataArray, BuddhaNatrueDataModel, SutraDataArray } from "@/model/sutra";
import axios from "axios";

// Fetch data from the Google Sheet
export const sutraApi = async () => {
     const response = await axios.get(`${process.env.SUTRA_API_URL}`);

     // Transformation function
     const transformData = (data: any) => {
          const [headers, ...rows] = data.values; // Extract headers and rows
          return rows
               .map((row: string[]) => {
                    // Map each row to an object using headers
                    const rowObject: { [key: string]: any } = {};
                    headers.forEach((header: string, index: number) => {
                         rowObject[header] = row[index] || ""; // Use empty string if value is missing
                    });
                    // Add missing key for "ສຽງ" if needed
                    if (!("ສຽງ" in rowObject)) {
                         rowObject["ສຽງ"] = ""; // Default empty value
                    }
                    return rowObject;
               })
               .filter((rowObject: { [s: string]: unknown; } | ArrayLike<unknown>) => Object.values(rowObject).some((value) => value !== ""));
     };

     // Transform the data into a friendly format
     const transformedData = transformData(response.data);

     return transformedData as SutraDataArray;
};

// Fetch data from the JSON file
export const buddhaNatureApi = async (): Promise<BuddhaNatrueDataArray> => {
     try {
          // Cast the JSON data explicitly as BuddhaNatrueDataModel[]
          const response = BuddhaNatureJsonData as BuddhaNatrueDataModel[];

          const transformData = (data: BuddhaNatrueDataModel[]) => {
               return data
                    .map((item) => {
                         let categoryName = ""; // Default value for ໝວດທັມ

                         // Check the category ID and assign the appropriate name
                         switch (item.category) {
                              case "627515988b61fc33c0d0ea97":
                                   categoryName = "ທໍາໃນເບື້ອງຕົ້ນ";
                                   break;
                              case "627515918b61fc33c0d0ea94":
                                   categoryName = "ທໍາໃນທ່າມກາງ";
                                   break;
                              case "627515888b61fc33c0d0ea91":
                                   categoryName = "ທໍາໃນທີສຸດ";
                                   break;
                              default:
                                   categoryName = item.category; // Default to the original category ID if no match
                                   break;
                         }

                         return {
                              ID: item._id,
                              ຊື່ພຣະສູດ: item.title,
                              ພຣະສູດ: item.content,
                              ຮູບ: item.thumbnail || "",
                              ໝວດທັມ: categoryName, // Use the translated category name
                              ສຽງ: "",
                         };
                    })
                    .filter((item) =>
                         Object.values(item).some((value) => value !== "")
                    );
          };

          const transformedData = transformData(response);
          return transformedData as any;
     } catch (error: any) {
          console.error("Error in Buddha Nature API:", error.message);
          throw error;
     }
};

// Merge Data from Both APIs
export const fetchSutraMergeData = async () => {
     // Fetch data from both APIs
     const [buddhaNatureData, sutraData] = await Promise.all([
          buddhaNatureApi(),
          sutraApi(),
     ]);

     // Merge the data with sutraData first and buddhaNatureData second
     return [...sutraData, ...buddhaNatureData] as SutraDataArray;
};