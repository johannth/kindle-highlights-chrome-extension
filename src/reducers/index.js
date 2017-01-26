import { combineReducers } from 'redux';

import {
  REQUEST_DATA,
  RECEIVE_BOOKS,
  REQUEST_DATA_FOR_BOOK,
  RECEIVE_DATA_FOR_BOOK,
  RECEIVE_DATA
} from '../actions';

function dataReducer(state = { books: {}, highlights: {} }, action) {
  switch (action.type) {
    case RECEIVE_BOOKS:
      const books = action.books.reduce(
        (accumulator, nextBook) => {
          accumulator[nextBook.id] = nextBook;
          return accumulator;
        },
        {}
      );
      return { ...state, books };

    case RECEIVE_DATA_FOR_BOOK:
      const newHighlights = {};
      newHighlights[action.bookId] = action.highlights;
      const highlights = { ...state.highlights, ...newHighlights };
      return { ...state, highlights };
    default:
      return state;
  }
}

function loadingReducer(state = { data: false, books: {} }, action) {
  switch (action.type) {
    case REQUEST_DATA:
      return { ...state, data: true };
    case REQUEST_DATA_FOR_BOOK: {
      const newBookLoadingStatus = {};
      newBookLoadingStatus[action.bookId] = true;
      const books = { ...state.books, ...newBookLoadingStatus };
      return { ...state, books };
    }
    case RECEIVE_DATA_FOR_BOOK: {
      const newBookLoadingStatus = {};
      newBookLoadingStatus[action.bookId] = false;
      const books = { ...state.books, ...newBookLoadingStatus };
      return { ...state, books };
    }
    case RECEIVE_DATA:
      return { ...state, data: false };
    default:
      return state;
  }
}

const rootReducer = combineReducers({
  data: dataReducer,
  loading: loadingReducer
});
export default rootReducer;
