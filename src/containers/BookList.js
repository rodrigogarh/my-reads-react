import * as React from "react";
import { Link } from "react-router-dom";
import BookShelf from "../components/BookShelf";
import * as BooksAPI from "../BooksAPI";

const shelfTitle = {
  currentlyReading: "Currently Reading",
  wantToRead: "Want to Read",
  read: "Read"
};

class BookList extends React.Component {
  booksByShelf() {
    const books = Object.values(this.props.books);
    let booksByShelf = {};
    Object.keys(shelfTitle).forEach(
      shelf =>
        (booksByShelf[shelf] = books.filter(book => book.shelf === shelf))
    );
    return booksByShelf;
  }

  renderBookList() {
    if (!this.props.books) return <span>Loading...</span>;
    const booksByShelf = this.booksByShelf();
    return (
      <div>
        {Object.keys(booksByShelf).map(shelf => (
          <BookShelf
            key={shelfTitle[shelf]}
            onChangeShlef={this.props.changeShelf}
            title={shelfTitle[shelf]}
            books={booksByShelf[shelf]}
          />
        ))}
      </div>
    );
  }

  render() {
    return (
      <div className="list-books">
        <div className="list-books-title">
          <h1>MyReads</h1>
        </div>
        <div className="list-books-content">{this.renderBookList()}</div>
        <div className="open-search">
          <Link to="/search">Add a book</Link>
        </div>
      </div>
    );
  }
}
export default BookList;
