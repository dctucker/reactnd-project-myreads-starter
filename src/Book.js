import React, {Component} from 'react'
import PropTypes from 'prop-types'

class Book extends Component {
  static propTypes = {
    data: PropTypes.object.isRequired
  }

  render() {
    const data = this.props.data
    return (
      <div className="book">
        <div className="book-top">
          <div className="book-cover" style={
            {
              width: 128,
              height: 193,
              backgroundImage: `url(${data.imageLinks && data.imageLinks.smallThumbnail})`
            }
          }></div>
          {this.props.children}
        </div>
        <div className="book-title">{data.title}</div>
        <div className="book-authors">
          {data.authors && (
            <span>
              {data.authors.join(', ')}
            </span>
          )}
        </div>
      </div>
    )
  }
}

export default Book
