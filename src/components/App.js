import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import classnames from 'classnames';

import css from './index.css';
import { fetchData } from '../actions';

import {
  sortByKey,
  createDataUrl,
  createDownloadFilesFromBook,
  createDownloadAllFilesFromAllBooks
} from '../utils.js';

const AppPage = ({ books, highlights, files, loading, onReloadData }) => (
  <div id="content">
    <div id="menu">
      <ReloadDataButton isLoading={loading.data} onClick={onReloadData} />
      {files && (
            <div className="download-links">
              <DownloadLink file={files.json}>
                Download JSON
              </DownloadLink>
              <DownloadLink file={files.markdown}>
                Download Markdown
              </DownloadLink>
            </div>
          )}
    </div>
    <BookList books={books} highlights={highlights} />
  </div>
);

const ReloadDataButton = ({ isLoading, onClick }) => (
  <div
    className="menu-button"
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

const BookList = ({ books, highlights }) => (
  <ul id="booklist">
    {books.map((book, i) => (
        <li key={book.id}>
          <Book
            book={book}
            highlights={highlights[book.id] || []}
            files={createDownloadFilesFromBook(book, highlights[book.id])}
            className={i % 2 == 0 ? 'row-even' : 'row-odd'}
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

const DownloadLink = ({ file, className, children }) => (
  <a
    className={classnames('download-link', className)}
    download={file.name}
    href="#"
    onClick={e => {
        // createDataUrl encodes using utf8 and then base64 which is expensive
        e.currentTarget.href = createDataUrl(file.mediaType, file.content);
      }}
    target="_blank"
  >
    {children}
  </a>
);
DownloadLink.propTypes = {
  file: PropTypes.shape({
    name: PropTypes.string.isRequired,
    mediaType: PropTypes.string.isRequired,
    content: PropTypes.string.isRequired
  }).isRequired,
  className: PropTypes.string
};

const Book = ({ book, highlights, files, className }) => (
  <div className={classnames('book', className)}>
    <h4 className="book-title"><a href={book.url}>{book.title}</a></h4>
    <p className="book-authors">{book.authors.join(', ')}</p>
    {files && (
          <div>
            <DownloadLink file={files.json}>
              Download JSON
            </DownloadLink>
            <DownloadLink file={files.markdown}>
              Download Markdown
            </DownloadLink>
          </div>
        )}
  </div>
);
Book.propTypes = { book: PropTypes.object.isRequired };

const mapStateToProps = state => {
  const sortedBooks = Object.values(state.data.books).sort(sortByKey('title'));
  return {
    books: sortedBooks,
    loading: state.loading,
    highlights: state.data.highlights,
    files: createDownloadAllFilesFromAllBooks(
      sortedBooks,
      state.data.highlights
    )
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
