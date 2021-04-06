/*
<a href="./" class="ebook-clickable">
    <img src="images/ExampleBook.png" alt="Ebook Cover" />
</a>
*/
/*
class Book{
    string title
    string author
    string imageURL
    string description
}
*/

// Creates an HTML element with a specified tag name, and specified properties
function getElement(tagName, properties) {
    const element = document.createElement(tagName)
    for (const property in properties) {
        element[property] = properties[property]
    }
    return element
}

// Gets the HTML to display the image of a book
function bookImage(book) {
    const image = getElement('img', { src: book.imageURL, alt: book.title })
    image.width = window.innerWidth / 20
    return image
}

// Gets the HTML to display the title of a book
function bookTitle(book) {
    return getElement('h3', { textContent: book.title })
}

// Gets the HTML to display the author of a book
function bookAuthor(book) {
    return getElement('h4', { textContent: book.author })
}

// Gets the HTML to display the description of a book
function bookDescription(book) {
    return getElement('p', { textContent: book.description })
}

// Gets an HTML element displaying the information for a book
function bookDisplay(book) {
    const bookClickable = getElement('div', { href: book.imageURL })

    bookClickable.appendChild(bookImage(book))
    bookClickable.append(bookTitle(book))
    bookClickable.append(bookAuthor(book))
    bookClickable.append(bookDescription(book))
    return bookClickable
}

const TFIOS = {
    title: "The Fault in Our Stars",
    author: "John Green",
    imageURL: "images/ExampleBook.png",
    description: "A book about astronomy, I'm sure"
}
const HPSS = {
    title: "Harry Potter and the Sorcerer's Stone",
    author: "J. K. Rowling",
    imageURL: "https://images-na.ssl-images-amazon.com/images/I/81iqZ2HHD-L.jpg",
    description: "A book about geology, I'm sure"
}

const bookContainer = document.getElementById('books')
bookContainer.appendChild(bookDisplay(TFIOS))
bookContainer.appendChild(bookDisplay(HPSS))