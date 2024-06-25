import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { bookSchema } from "../validators"; // Assuming you have a bookSchema defined for validation
import { listBooks , getBook, createBook, updateBook, deleteBook  } from "./books.controller";

export const bookRouter = new Hono();

// GET all books - /api/books
bookRouter.get("/books", listBooks);

// GET a single book by ID - /api/books/:id
bookRouter.get("/books/:id", getBook);

// POST create a new book - /api/books
bookRouter.post("/books", zValidator('json', bookSchema, (result, c) => {
    if (!result.success) {
        return c.json(result.error, 400);
    }
}), createBook);

// PUT update a book by ID - /api/books/:id
bookRouter.put("/books/:id", updateBook);

// DELETE a book by ID - /api/books/:id
bookRouter.delete("/books/:id", deleteBook);

