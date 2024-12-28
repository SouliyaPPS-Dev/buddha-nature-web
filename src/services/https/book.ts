/* eslint-disable @typescript-eslint/no-explicit-any */
import { BookDataArray } from "@/model/book";
import axios from "axios";

export const bookApi = async () => {
     const response = await axios.get(`https://sheets.googleapis.com/v4/spreadsheets/1mKtgmZ_Is4e6P3P5lvOwIplqx7VQ3amicgienGN9zwA/values/books!1:1000000?key=AIzaSyDFjIl-SEHUsgK0sjMm7x0awpf8tTEPQjs`);

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

     return transformedData as BookDataArray;
};