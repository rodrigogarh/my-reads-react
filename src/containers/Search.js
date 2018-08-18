import * as React from "react";
import * as BooksAPI from "../BooksAPI";
import { Link } from "react-router-dom";
import { Debounce } from "react-throttle";

import Book from "../components/Book";
import "../App.css";

class Search extends React.Component {
  state = { resultBooks: undefined };

  seachBook = e => {
    const query = e.target.value;
    if (!query.length > 1) return;
    BooksAPI.search(query, 10).then(books => {
      let resultBooks = undefined;

      if (books && !books.error) {
        resultBooks = this.prepareBooks(books);
      }
      this.setState({ resultBooks });
    });
  };

  prepareBooks = books => {
    let preparedBooks = {};
    books.forEach(book => {
      const shelfBook = this.props.shelfBooks[book.id];
      if (shelfBook) {
        book.shelf = shelfBook.shelf;
      }
      preparedBooks[book.id] = book;
    });
    return preparedBooks;
  };

  handleChangeShelf = (bookID, newShelf) => {
    BooksAPI.update(bookID, newShelf).then(r => {
      if (newShelf !== "none" && !r[newShelf].includes(bookID)) return;

      let resultBooks = { ...this.state.resultBooks };
      const book = resultBooks[bookID];
      book.shelf = newShelf;
      this.props.addBook(book);
      this.setState({ resultBooks });
    });
  };

  render() {
    const books = this.state.resultBooks;
    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">
            Close
          </Link>
          <div className="search-books-input-wrapper">
            <Debounce time="100" handler="onChange">
              <input
                autoFocus
                type="text"
                placeholder="Search by title or author"
                onChange={e => this.seachBook(e)}
              />
            </Debounce>
          </div>
        </div>
        <div className="search-books-results">
          <ol className="books-grid">
            {books &&
              Object.values(books).map((book, index) => (
                <Book
                  key={index}
                  onChangeShlef={this.handleChangeShelf}
                  {...book}
                />
              ))}
          </ol>
        </div>
      </div>
    );
  }
}

export default Search;
