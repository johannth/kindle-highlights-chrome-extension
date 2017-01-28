import { combineReducers } from 'redux';

import { REQUEST_DATA, RECEIVE_DATA_FOR_BOOK, RECEIVE_DATA } from '../actions';

const rootReducer = combineReducers({
  data: dataReducer,
  loading: loadingReducer
});
export default rootReducer;

function dataReducer(state = { books: {}, highlights: {} }, action) {
  switch (action.type) {
    case RECEIVE_DATA_FOR_BOOK: {
      const newHighlights = {};
      newHighlights[action.book.id] = action.highlights;
      const highlights = { ...state.highlights, ...newHighlights };

      const newBooks = {};
      newBooks[action.book.id] = { ...action.book };
      const books = { ...state.books, ...newBooks };

      return { ...state, highlights, books };
    }
    default:
      return state;
  }
}

function loadingReducer(state = { data: false }, action) {
  switch (action.type) {
    case REQUEST_DATA:
      return { ...state, data: true };
    case RECEIVE_DATA:
      return { ...state, data: false };
    default:
      return state;
  }
}
