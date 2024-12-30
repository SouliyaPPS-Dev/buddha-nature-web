/* eslint-disable @typescript-eslint/no-explicit-any */
import { VideoDataArray } from "@/model/video";
import axios from "axios";

export const videoApi = async () => {
     const response = await axios.get(`${process.env.VIDEO_API_URL}`);

     // Transformation function
     const transformData = (data: any) => {
          const [headers, ...rows] = data.values; // Extract headers and rows
          return rows.map((row: string[]) => {
               // Map each row to an object using headers
               const rowObject: { [key: string]: any } = {};
               headers.forEach((header: string, index: number) => {
                    rowObject[header] = row[index] || ""; // Use empty string if value is missing
               });
               return rowObject;
          });
     };

     // Transform the data into a friendly format
     const transformedData = transformData(response.data);

     return transformedData as VideoDataArray;
};