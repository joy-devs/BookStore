// bookSchema.ts
import { z } from "zod";

export const bookSchema = z.object({
  title: z.string().min(1).max(255),
  authorId: z.number().int(),
  publicationYear: z.number().int().min(1000).max(9999),
});