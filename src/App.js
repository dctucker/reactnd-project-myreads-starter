import React from 'react'
import { Route, Link } from 'react-router-dom'
import BookList from './BookList'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  state = {
    books: [],
    shelfs: {
      currentlyReading: [],
      wantToRead: [],
      read: []
    }
  }

  defaultShelfs = () => {
    return {
      currentlyReading: [],
      wantToRead: [],
      read: []
    }
  }

  shelfs = [
    ["currentlyReading", "Currently Reading"],
    ["wantToRead", "Want to Read"],
    ["read", "Read"]
  ]

  loadBooks = () => {
    BooksAPI.getAll().then((books) => {
      this.setState({ books: books })
      var shelfs = this.defaultShelfs()
      books.map((book) => {
        return shelfs[book.shelf].push(book.id)
      })
      this.setState({ shelfs: shelfs })
    })
  }

  componentDidMount() {
    this.loadBooks()
  }

  onMoveBook = (book, shelf) => {
    BooksAPI.update(book, shelf).then((shelfs) => {
      this.loadBooks()
    })
  }

  onSearch = (event) => {
    BooksAPI.search(event.target.value).then((books) => {
      if( Array.isArray(books) ){
        this.setState({ books: books })
      }
    })
  }

  render() {
    return (
      <div className="app">
        <Route path='/search' render={() => (
          <div className="search-books">
            <div className="search-books-bar">
              <Link to="/" className="close-search">Close</Link>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text" onChange={this.onSearch} placeholder="Search by title or author"/>

              </div>
            </div>
            <div className="search-books-results">
              <BookList
                books={this.state.books}
              />
            </div>
          </div>
        )}/>
        <Route exact path='/' render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div>
                {this.shelfs.map(([shelf, title]) => (
                  <div className="bookshelf" key={shelf}>
                    <h2 className="bookshelf-title">{title}</h2>
                    <div className="bookshelf-books">
                      <BookList
                        books={this.state.books.filter((book) => book.shelf === shelf )}
                        onMoveBook={this.onMoveBook}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}/>
      </div>
    )
  }
}

export default BooksApp
