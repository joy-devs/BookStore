import { Book } from "../components/BookRepository";


export type Action =
  | { type: 'SET_INITIAL_STATE'; payload: Book[] }
  | { type: 'ADD_BOOK'; payload: Book }
  | { type: 'UPDATE_BOOK'; payload: Book }
  | { type: 'DELETE_BOOK'; payload: string };

const bookReducer = (state: Book[], action: Action): Book[] => {
  switch (action.type) {
    case 'SET_INITIAL_STATE':
      return action.payload;
    case 'ADD_BOOK':
      return [...state, action.payload];
    case 'UPDATE_BOOK':
      return state.map(book => (book.id === action.payload.id ? action.payload : book));
    case 'DELETE_BOOK':
      return state.filter(book => book.id !== action.payload);
    default:
      return state;
  }
};

export default bookReducer;
