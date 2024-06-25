// seedBooks.js

const axios = require('axios');
const pool = require('./db'); // Import the PostgreSQL connection pool from db.js

// Google Books API endpoint for searching books
const API_URL = 'https://www.googleapis.com/books/v1/volumes';

async function seedBooks() {
  try {
    const response = await axios.get(API_URL, {
      params: {
        q: 'programming',
        maxResults: 50,
      },
    });

    const books = response.data.items.map(item => {
      const volumeInfo = item.volumeInfo;
      return {
        title: volumeInfo.title,
        author: volumeInfo.authors ? volumeInfo.authors.join(', ') : 'Unknown',
        year: volumeInfo.publishedDate ? new Date(volumeInfo.publishedDate).getFullYear() : null,
      };
    });

    // Insert fetched books into the database
    await Promise.all(books.map(book =>
      pool.query(`
        INSERT INTO "BooksTable" (title, author, year)
        VALUES ($1, $2, $3)
      `, [book.title, book.author, book.year])
    ));

    console.log('Books seeded successfully.');
  } catch (error) {
    console.error('Error seeding books:', error.message);
  } finally {
    // Close the connection pool
    await pool.end();
  }
}

seedBooks();
