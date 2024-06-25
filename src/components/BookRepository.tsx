import React, { useReducer, useRef, useEffect, useState, useCallback } from 'react';
import bookReducer from '../Reducers/Bookreducer';
import useLocalStorage from '../Hooks/useLocalStorage';

export interface Book {
  id: string;
  title: string;
  author: string;
  year: number;
}

const BookRepository: React.FC = () => {
  const [books, dispatch] = useReducer(bookReducer, []);
  const [storedBooks, setStoredBooks] = useLocalStorage<Book[]>('books', []);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  // Initialize state with storedBooks only once
  useEffect(() => {
    if (storedBooks.length > 0) {
      dispatch({ type: 'SET_INITIAL_STATE', payload: storedBooks });
    }
  }, [storedBooks]);

  // Update local storage whenever books state changes
  useEffect(() => {
    if (books.length !== storedBooks.length) {
      setStoredBooks(books);
    }
  }, [books, setStoredBooks, storedBooks.length]);

  const handleAddBook = () => {
    if (titleRef.current && authorRef.current && yearRef.current) {
      const newBook: Book = {
        id: Date.now().toString(),
        title: titleRef.current.value,
        author: authorRef.current.value,
        year: parseInt(yearRef.current.value, 10),
      };
      dispatch({ type: 'ADD_BOOK', payload: newBook });
      titleRef.current.value = '';
      authorRef.current.value = '';
      yearRef.current.value = '';
    }
  };

  const handleUpdateBook = (book: Book) => {
    dispatch({ type: 'UPDATE_BOOK', payload: book });
  };

  const handleDeleteBook = (id: string) => {
    dispatch({ type: 'DELETE_BOOK', payload: id });
  };

  const filteredBooks = books.filter(book => book.title.toLowerCase().includes(searchTerm.toLowerCase()));

  const booksPerPage = 5;
  const totalPages = Math.ceil(filteredBooks.length / booksPerPage);
  const displayedBooks = filteredBooks.slice((currentPage - 1) * booksPerPage, currentPage * booksPerPage);

  const handleNextPage = useCallback(() => {
    if (currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  }, [currentPage, totalPages]);

  const handlePreviousPage = useCallback(() => {
    if (currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  }, [currentPage]);

  return (
    <div>
      <h1>Book Repository</h1>
      <div>
        <input type="text" placeholder="Title" ref={titleRef} />
        <input type="text" placeholder="Author" ref={authorRef} />
        <input type="number" placeholder="Year" ref={yearRef} />
        <button onClick={handleAddBook}>Add Book</button>
      </div>
      <div>
        <input type="text" placeholder="Search by title" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} />
      </div>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Year</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {displayedBooks.map(book => (
            <tr key={book.id}>
              <td>{book.title}</td>
              <td>{book.author}</td>
              <td>{book.year}</td>
              <td>
                <button onClick={() => handleUpdateBook(book)}>Edit</button>
                <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default BookRepository;
