import { pgTable, serial, varchar, integer } from 'drizzle-orm/pg-core';

// Define the BooksTable schema
export const BooksTable = pgTable('books', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }),
  author: varchar('author', { length: 100 }),
  year: integer('year'),  // Nullable if year is optional in the database
});

// Types
export type TIBook = typeof BooksTable.$inferInsert;
export type TSBook = typeof BooksTable.$inferSelect;
