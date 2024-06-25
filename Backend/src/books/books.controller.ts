import { Context } from "hono"// Assuming you have implemented these services
import { booksService, getBookService, createBookService, updateBookService, deleteBookService  } from "./books.services";

export const listBooks = async (c: Context) => {
    try {
        // Limit the number of books to be returned
        const limit = Number(c.req.query('limit'));

        const data = await booksService(limit);
        if (data == null || data.length == 0) {
            return c.text("Books not found", 404);
        }
        return c.json(data, 200);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

export const getBook = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const book = await getBookService(id);
    if (book == undefined) {
        return c.text("Book not found", 404);
    }
    return c.json(book, 200);
}

export const createBook = async (c: Context) => {
    try {
        const book = await c.req.json();
        const createdBook = await createBookService(book);

        if (!createdBook) return c.text("Book not created", 404);
        return c.json({ msg: "Book created successfully" }, 201);

    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

export const updateBook = async (c: Context) => {
    const id = parseInt(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    const book = await c.req.json();
    try {
        // Search for the book
        const searchedBook = await getBookService(id);
        if (searchedBook == undefined) return c.text("Book not found", 404);

        // Update the book data
        const res = await updateBookService(id, book);

        // Return a success message
        if (!res) return c.text("Book not updated", 404);

        return c.json({ msg: "Book updated successfully" }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}

export const deleteBook = async (c: Context) => {
    const id = Number(c.req.param("id"));
    if (isNaN(id)) return c.text("Invalid ID", 400);

    try {
        // Search for the book
        const book = await getBookService(id);
        if (book == undefined) return c.text("Book not found", 404);

        // Delete the book
        const res = await deleteBookService(id);
        if (!res) return c.text("Book not deleted", 404);

        return c.json({ msg: "Book deleted successfully" }, 201);
    } catch (error: any) {
        return c.json({ error: error?.message }, 400);
    }
}
