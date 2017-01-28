import cheerio from 'cheerio';

export const REQUEST_DATA = 'REQUEST_DATA';
function requestData() {
  return { type: REQUEST_DATA };
}

export const RECEIVE_DATA_FOR_BOOK = 'RECEIVE_DATA_FOR_BOOK';
function receiveDataForBook(book, highlights) {
  return { type: RECEIVE_DATA_FOR_BOOK, book, highlights };
}

export const RECEIVE_DATA = 'RECEIVE_DATA';
function receiveData() {
  return { type: RECEIVE_DATA };
}

// This is a rather weird way to fetch all of your highlights.
// This was reverse engineered from browsing https://kindle.amazon.com/your_highlights/
// It is a odd way of pagination where each page is a single book
// and you get the next page by adding the id of the previous book with the used_asin parameter.
// This is slow and linear but gives you all the important data.
//
// There is no public API but a much faster way to get all of the highlights
// is by:
//    1. Get all books by crawling https://kindle.amazon.com/your_reading/0/${bookPage}/0
//    2. For each book use a JSON API at https://kindle.amazon.com/kcw/highlights?asin=${bookId}&cursor=${cursor}&count=200
// The reason why we don't use this approach is that it doesn't returns usable start positions or links into the original Kindle books
export function fetchData() {
  return dispatch => {
    dispatch(requestData());

    const fetchNextPage = (usedAsins, offset) => {
      const usedAsinsAsQuery = usedAsins
        .map(x => `used_asins[]=${x}`)
        .join(`&`);
      fetch(
        `https://kindle.amazon.com/your_highlights/next_book?${usedAsinsAsQuery}&current_offset=${offset}&upcoming_asins[]=`,
        { credentials: 'include' }
      ).then(response => {
        return response.text().then(text => {
          const $ = cheerio.load(text);
          const titleElement = $('.title a');

          if (titleElement.length == 0) {
            dispatch(receiveData());
            return;
          }

          const url = titleElement.attr('href');
          const urlParts = url.split('/');
          const id = urlParts[urlParts.length - 1];
          const title = titleElement.text();
          const authors = $('.author').text() || '';

          const highlightCount = parseInt($(`.highlightCount${id}`).text(), 10);

          usedAsins.push(id);

          const book = {
            id: id,
            title: title,
            authors: authors.split(',').map(x => x.trim().replace('by ', '')),
            url: `https://kindle.amazon.com${url}`
          };

          const bookHighlights = $('.highlightRow').map((i, element) => {
            const highlight = $('.highlight', element).text();
            const highlightLink = $('a.readMore', element).attr('href');

            return { highlight: highlight, url: highlightLink };
          }).toArray();

          if (highlightCount != bookHighlights.length) {
            console.log(
              `Error: Mismatch in highlights for book ${id} - ${highlightCount} != ${bookHighlights.length}`
            );
          }

          dispatch(receiveDataForBook(book, bookHighlights));

          fetchNextPage(usedAsins, offset + bookHighlights.length);
        });
      });
    };

    fetchNextPage([], 0);
  };
}
