// bookSchema.ts
import { z } from "zod";

// Define Zod validator schema for Book
export const bookSchema = z.object({
  id: z.number(),     // Assuming 'id' is a number
  title: z.string().max(255),  // Max length of 255 characters for title
  author: z.string().max(100), // Max length of 100 characters for author
  year: z.number().nullable(), // Nullable number for year
});