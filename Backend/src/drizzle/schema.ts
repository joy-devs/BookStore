import { pgTable, serial, text, integer, varchar, primaryKey } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";

// Books table schema
export const BooksTable = pgTable("books", {
    id: serial("id").primaryKey(),
    title: varchar("title", { length: 255 }),
    authorId: integer("author_id").notNull().references(() => AuthorsTable.id, { onDelete: "cascade" }),
    publicationYear: integer("publication_year"),
    // Add more fields as needed
});

// Authors table schema
export const AuthorsTable = pgTable("authors", {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 100 }),
    biography: text("biography"),
    // Add more fields as needed
});

// Relationships
export const booksRelations = relations(BooksTable, ({ one }) => ({
    author: one(AuthorsTable, {
        fields: [BooksTable.authorId],
        references: [AuthorsTable.id],
    }),
}));

// Types
export type TIBook = typeof BooksTable.$inferInsert;
export type TSBook = typeof BooksTable.$inferSelect;
export type TIAuthor = typeof AuthorsTable.$inferInsert;
export type TSAuthor = typeof AuthorsTable.$inferSelect;
