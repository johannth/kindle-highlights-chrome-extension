import base64 from 'base-64';
import utf8 from 'utf8';

export const sortByKey = key => (a, b) => {
  const x = a[key];
  const y = b[key];
  if (x < y) {
    return -1;
  } else if (x > y) {
    return 1;
  } else {
    return 0;
  }
};

export const sendMessageMiddleware = ({ whitelist, blacklist }) =>
  store => next => action => {
    const inWhiteList = whitelist && whitelist.includes(action.type);
    const inBlackList = blacklist && !blacklist.includes(action.type);
    if (inWhiteList || inBlackList) {
      console.log('Sending action', action);
      chrome.runtime.sendMessage({ action });
    }
    return next(action);
  };

export const registerStoreWithChromeMessages = store => {
  chrome.runtime.onMessage.addListener(function(message, sender, sendResponse) {
    if (message.action) {
      store.dispatch(message.action);
    }
  });
};

export const createDownloadAllFilesFromAllBooks = (books, highlights) => {
  return {
    json: {
      name: 'kindle-highlights.json',
      mediaType: 'application/json',
      content: JSON.stringify(createJSONPayloadForAllBooks(books, highlights))
    },
    markdown: {
      name: 'kindle-highlights.md',
      mediaType: 'text/markdown',
      content: createMarkdownFromAllBooks(books, highlights)
    }
  };
};

const createJSONPayloadForAllBooks = (books, highlights) => {
  return {
    books: books.reduce(
      (accumulator, book) => {
        if (highlights[book.id].length > 0) {
          accumulator[book.id] = createJSONPayloadFromBook(
            book,
            highlights[book.id]
          );
        }
        return accumulator;
      },
      {}
    )
  };
};

const createMarkdownFromAllBooks = (books, highlights) => {
  const booksAsMarkdown = books.map(book =>
    createMarkdownFromBook(book, highlights[book.id]));

  return booksAsMarkdown.join(`\n\n`);
};

export const createDownloadFilesFromBook = (book, highlights) => {
  if (highlights.length == 0) {
    return {};
  } else {
    return {
      json: {
        name: `kindle-highlights-${book.id}-${book.title}.json`,
        mediaType: 'application/json',
        content: JSON.stringify(createJSONPayloadFromBook(book, highlights))
      },
      markdown: {
        name: `kindle-highlights-${book.id}-${book.title}.md`,
        mediaType: 'text/markdown',
        content: createMarkdownFromBook(book, highlights)
      }
    };
  }
};

const createJSONPayloadFromBook = (book, highlights) => {
  return {
    book: { id: book.id, title: book.title, authors: book.authors },
    highlights: highlights
  };
};

const createMarkdownFromBook = (book, highlights) => {
  const header = [`## ${book.title}`, ''];
  const renderedHighlights = highlights.map(
    createMarkdownFromHighlight(book.Id)
  );
  return header.concat(renderedHighlights).join('\n');
};

const createMarkdownFromHighlight = bookId => highlight => {
  return [`> ${highlight.highlight}`, '', `[Link](${highlight.url})`].join(
    '\n'
  );
};

export const createDataUrl = (mediaType, content) => {
  const base64encodedContent = base64.encode(utf8.encode(content));
  return `data:${mediaType};base64,${base64encodedContent}`;
};
