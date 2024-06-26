import React, { useReducer, useRef, useEffect, useState, useCallback } from 'react';
import bookReducer from '../Reducers/Bookreducer';
import useLocalStorage from '../Hooks/useLocalStorage';
import '../App.css';  // Make sure this import statement is present

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
  const [showForm, setShowForm] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);

  const titleRef = useRef<HTMLInputElement>(null);
  const authorRef = useRef<HTMLInputElement>(null);
  const yearRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (storedBooks.length > 0) {
      dispatch({ type: 'SET_INITIAL_STATE', payload: storedBooks });
    }
  }, [storedBooks]);

  useEffect(() => {
    if (books.length !== storedBooks.length) {
      setStoredBooks(books);
    }
  }, [books, setStoredBooks, storedBooks.length]);

  const handleAddBook = () => {
    if (titleRef.current && authorRef.current && yearRef.current) {
      const title = titleRef.current.value.trim();
      const author = authorRef.current.value.trim();
      const year = parseInt(yearRef.current.value, 10);

      // Validate that no fields are empty
      if (!title || !author || isNaN(year)) {
        alert("All fields must be filled out correctly.");
        return;
      }

      const newBook: Book = {
        id: editingBook ? editingBook.id : Date.now().toString(),
        title,
        author,
        year,
      };

      if (editingBook) {
        dispatch({ type: 'UPDATE_BOOK', payload: newBook });
        setEditingBook(null); // Clear editing state
      } else {
        dispatch({ type: 'ADD_BOOK', payload: newBook });
      }

      // Update storedBooks in local storage
      setStoredBooks([...books, newBook]);

      titleRef.current.value = '';
      authorRef.current.value = '';
      yearRef.current.value = '';
      setShowForm(false); // Hide form after adding/updating book
    }
  };

  const handleEditBook = (book: Book) => {
    setEditingBook(book);
    setShowForm(true);
    if (titleRef.current && authorRef.current && yearRef.current) {
      titleRef.current.value = book.title;
      authorRef.current.value = book.author;
      yearRef.current.value = book.year.toString();
    }
  };

  const handleUpdateBook = () => {
    if (!editingBook) return;

    if (titleRef.current && authorRef.current && yearRef.current) {
      const title = titleRef.current.value.trim();
      const author = authorRef.current.value.trim();
      const year = parseInt(yearRef.current.value, 10);

      // Validate that no fields are empty
      if (!title || !author || isNaN(year)) {
        alert("All fields must be filled out correctly.");
        return;
      }

      const updatedBook: Book = {
        ...editingBook,
        title,
        author,
        year,
      };

      dispatch({ type: 'UPDATE_BOOK', payload: updatedBook });
      setStoredBooks(books.map(b => (b.id === updatedBook.id ? updatedBook : b)));

      setEditingBook(null); // Clear editing state
      setShowForm(false); // Hide form after adding/updating book

      titleRef.current.value = '';
      authorRef.current.value = '';
      yearRef.current.value = '';
    }
  };

  const handleDeleteBook = (id: string) => {
    dispatch({ type: 'DELETE_BOOK', payload: id });
    setStoredBooks(books.filter(book => book.id !== id));
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
    <div className="container">
      <h1>Book Repository</h1>
      <button onClick={() => {
        setShowForm(!showForm);
        if (!showForm) {
          setEditingBook(null); // Clear editing state when opening the form
        }
      }}>
        {showForm ? 'Cancel' : 'Add Book'}
      </button>
      {showForm && (
        <form>
          <input type="text" placeholder="Title" ref={titleRef} />
          <input type="text" placeholder="Author" ref={authorRef} />
          <input type="number" placeholder="Year" ref={yearRef} />
          <button type="button" onClick={editingBook ? handleUpdateBook : handleAddBook}>
            {editingBook ? 'Update Book' : 'Add Book'}
          </button>
        </form>
      )}
      <div className="search-container">
        <input
          type="text"
          placeholder="Search by title"
          value={searchTerm}
          onChange={e => setSearchTerm(e.target.value)}
        />
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
                <button className="edit-button" onClick={() => handleEditBook(book)}>Edit</button>
                <button className="delete-button" onClick={() => handleDeleteBook(book.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={currentPage === 1}>Previous</button>
        <button onClick={handleNextPage} disabled={currentPage === totalPages}>Next</button>
      </div>
    </div>
  );
};

export default BookRepository;
