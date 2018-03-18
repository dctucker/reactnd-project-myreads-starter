import React from 'react'
import { Route, Link } from 'react-router-dom'
import { DebounceInput } from 'react-debounce-input'
import BookList from './BookList'
import * as BooksAPI from './BooksAPI'
import './App.css'

class BooksApp extends React.Component {
  state = {
    books: [],
    results: [],
    query: "" // search terms: https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md
  }

  shelfs = [
    ["currentlyReading", "Currently Reading"],
    ["wantToRead", "Want to Read"],
    ["read", "Read"]
  ]

  componentDidMount() {
    this.loadBooks()
  }

  loadBooks = () => {
    BooksAPI.getAll().then((books) => {
      this.setState({ books: books })
    })
  }

  onMoveBook = (book, shelf) => {
    book.shelf = shelf
    this.state.results.filter((result) => result.id === book.id).map((result) => {
      return result.shelf = shelf
    })
	  BooksAPI.update(book, shelf).then((_) => {
      // discard the response and just do another API call to get the books
      this.loadBooks()
    })
  }

  // called when user stops typing to load search results
  onSearch = (event) => {
    const noresults = document.getElementById('search-books-noresults');
    const value = event.target.value
    this.setState({ query: value })
    noresults.style.display = "none"
    BooksAPI.search(value).then((results) => {
      if( Array.isArray(results) ){
        this.setState({
          results: results.map((result) => {
            this.state.books.filter((book) => book.id === result.id).map((book) => {
              return result.shelf = book.shelf
            })
            return result
          })
        })
      } else {
        // handle empty/error state
        this.setState({
          results: []
        })
        // hide empty result set message if search box is empty
        if( this.state.query.length > 0 ){
          noresults.style.display = "block"
        }
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
                <DebounceInput
                  onChange={this.onSearch}
                  minLength={2}
                  debounceTimeout={200}
                  placeholder="Search by title or author"
                  value={this.state.query}
                />
              </div>
            </div>
            <div className="search-books-results">
              <BookList
                books={this.state.results}
                onMoveBook={this.onMoveBook}
              />
            </div>
            <div id="search-books-noresults" style={{display: "none"}}>No books found</div>
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
