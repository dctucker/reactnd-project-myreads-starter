import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Book from './Book'

class BookList extends Component {
  static propTypes = {
    books: PropTypes.array.isRequired,
    onMoveBook: PropTypes.func
  }
  render() {
    return (
      <ol className="books-grid">
        {this.props.books.map((book) => (
        <li key={book.id}>
          <Book data={book}>
            <div className="book-shelf-changer">
              <select value={book.shelf} onChange={(event) => this.props.onMoveBook(book, event.target.value) }>
                <option value="" disabled>Move to...</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
          </Book>
        </li>
        ))}
      </ol>
    )
  }
}

export default BookList
