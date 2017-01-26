import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';
import base64 from 'base-64';

import css from './index.css';
import { fetchData } from '../actions';

const sortByKey = key => (a, b) => {
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

const AppPage = ({ books, highlights, loading, onReloadData }) => (
  <div id="content">
    <div id="menu">
      <ReloadDataButton isLoading={loading.data} onClick={onReloadData} />
    </div>
    <BookList
      books={books}
      highlights={highlights}
      booksLoading={loading.books}
    />
  </div>
);

const ReloadDataButton = ({ isLoading, onClick }) => (
  <div
    id="reload-data-button"
    onClick={e => {
        if (!isLoading) {
          e.preventDefault();
          onClick();
        }
      }}
  >{isLoading ? 'Loading...' : 'Reload'}</div>
);
ReloadDataButton.propTypes = {
  isLoading: PropTypes.bool,
  onClick: PropTypes.func.isRequired
};

const BookList = ({ books, highlights, booksLoading }) => (
  <ul id="booklist">
    {books.map(book => (
        <li key={book.id}>
          <Book
            id={book.id}
            name={book.name}
            highlights={highlights[book.id] || []}
            isLoading={booksLoading[book.id]}
          />
        </li>
      ))}
  </ul>
);
BookList.propTypes = {
  books: PropTypes.arrayOf(
    PropTypes.shape({ id: PropTypes.string, name: PropTypes.string })
  ).isRequired
};

const encodeHighlightsAsJSONDataUrl = (bookId, bookName, highlights) => {
  const base64encodeData = base64.encode(
    JSON.stringify({
      book: { id: bookId, name: bookName },
      highlights: highlights
    })
  );
  return `data:application/json;base64,${base64encodeData}`;
};

const Book = ({ id, name, highlights, isLoading }) => (
  <div className={classnames('book', isLoading ? 'loading' : '')}>
    <h4 className="book-title">{name}</h4>
    <a
      download={`${id}-${name}.json`}
      href={encodeHighlightsAsJSONDataUrl(id, highlights)}
      target="_blank"
    >
      Download {highlights.length} highlights as JSON
    </a>
  </div>
);
Book.propTypes = {
  id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired
};

const mapStateToProps = state => {
  return {
    books: Object.values(state.data.books).sort(sortByKey('name')),
    loading: state.loading,
    highlights: state.data.highlights
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onReloadData: () => {
      dispatch(fetchData());
    }
  };
};

const App = connect(mapStateToProps, mapDispatchToProps)(AppPage);
export default App;
