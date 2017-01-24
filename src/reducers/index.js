import { RECEIVE_BOOKS, RECEIVE_DATA_FOR_BOOK } from '../actions';

function rootReducer(state, action) {
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
      const highlights = { ...(state.highlights || {}), ...newHighlights };
      return { ...state, highlights };
    default:
      return state;
  }
}

export default rootReducer;
