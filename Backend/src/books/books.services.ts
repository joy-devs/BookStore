import { eq } from "drizzle-orm";
import db from "../drizzle/db";
import { TIBook, TSBook, BooksTable } from "../drizzle/schema";

// Service to fetch books
export const booksService = async (limit?: number): Promise<TSBook[] | null> => {
    if (limit) {
        return await db.query.BooksTable.findMany({
            limit: limit
        });
    }
    return await db.query.BooksTable.findMany();
}

// Service to fetch a single book by ID
export const getBookService = async (id: number): Promise<TSBook | undefined> => {
    return await db.query.BooksTable.findFirst({
        where: eq(BooksTable.id, id)
    });
}

// Service to create a new book
export const createBookService = async (book: TIBook) => {
    await db.insert(BooksTable).values(book);
    return "Book created successfully";
}

// Service to update a book by ID
export const updateBookService = async (id: number, book: TIBook) => {
    await db.update(BooksTable).set(book).where(eq(BooksTable.id, id));
    return "Book updated successfully";
}

// Service to delete a book by ID
export const deleteBookService = async (id: number) => {
    await db.delete(BooksTable).where(eq(BooksTable.id, id));
    return "Book deleted successfully";
}
