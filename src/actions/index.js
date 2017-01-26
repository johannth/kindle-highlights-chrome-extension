import cheerio from 'cheerio';

export const REQUEST_DATA = 'REQUEST_DATA';
function requestData() {
  return { type: REQUEST_DATA };
}

export const RECEIVE_BOOKS = 'RECEIVE_BOOKS';
function receiveBooks(books) {
  return { type: RECEIVE_BOOKS, books };
}

export const REQUEST_DATA_FOR_BOOK = 'REQUEST_DATA_FOR_BOOK';
function requestDataForBook(bookId) {
  return { type: REQUEST_DATA_FOR_BOOK, bookId };
}

export const RECEIVE_DATA_FOR_BOOK = 'RECEIVE_DATA_FOR_BOOK';
function receiveDataForBook(bookId, highlights) {
  return { type: RECEIVE_DATA_FOR_BOOK, bookId, highlights };
}

export const RECEIVE_DATA = 'RECEIVE_DATA';
function receiveData() {
  return { type: RECEIVE_DATA };
}

export function fetchData() {
  return dispatch => {
    dispatch(requestData());

    return fetchBooks().then(books => {
      dispatch(receiveBooks(books));

      Promise.all(
        books.map((book, i) => {
          dispatch(requestDataForBook(book.id));
          return fetchAllHighlights(book.id).then(highlights => {
            dispatch(receiveDataForBook(book.id, highlights));
          });
        })
      ).then(_ => {
        dispatch(receiveData());
      });
    });
  };
}

function fetchBooks() {
  return new Promise((resolve, reject) => {
    var bookPage = 0;
    var books = [];

    let downloadNextPage = () => {
      fetchPageOfBooks(bookPage).then(response => {
        books = [].concat(books, response.items);

        if (response.hasMore) {
          bookPage += 25;

          downloadNextPage();
        } else {
          resolve(books);
        }
      });
    };

    downloadNextPage();
  });
}

function fetchPageOfBooks(bookPage) {
  return fetch(`https://kindle.amazon.com/your_reading/0/${bookPage}/0`, {
    credentials: 'include'
  }).then(response => {
    return response.text().then(text => {
      let $ = cheerio.load(text);
      let books = $('.titleAndAuthor a').map((i, element) => {
        let urlParts = $(element).attr('href').split('/');
        return { id: urlParts[urlParts.length - 1], name: $(element).text() };
      }).toArray();
      return { items: books, hasMore: books.length > 0 };
    });
  });
}

function fetchAllHighlights(bookId) {
  return new Promise((resolve, reject) => {
    var cursor = 0;
    var highlights = [];

    let downloadNextPage = () => {
      fetchPageOfHighlights(bookId, cursor).then(response => {
        highlights = [].concat(highlights, response.items);

        if (response.hasMore) {
          cursor++;

          // There is something wrong here.
          downloadNextPage();
        } else {
          resolve(highlights);
        }
      });
    };

    downloadNextPage();
  });
}

function fetchPageOfHighlights(bookId, cursor) {
  return fetch(
    `https://kindle.amazon.com/kcw/highlights?asin=${bookId}&cursor=${cursor}&count=50`,
    { credentials: 'include' }
  ).then(response => {
    return response.json();
  });
}
