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

// Get any and all book info
async function getBook(title) {
    const bookResponse = await fetch(`http://openlibrary.org/search.json?title=${title.split(' ').join('+')}`).then(d => d.json())
    const bookKey = bookResponse.docs[0].key

    const bookData = await fetch(`https://openlibrary.org${bookKey}.json`).then(d => d.json())

    const authorData = await fetch(`https://openlibrary.org${bookData.authors[0].author.key}.json`).then(d => d.json())
    console.log(bookData)
    const book = {
        title: bookData.title,
        author: authorData.name,
        description: bookData.description == undefined || (typeof bookData.description === 'string' || bookData.description instanceof String) ? bookData.description : bookData.description.value,
        imageURL: `http://covers.openlibrary.org/b/id/${bookData.covers[0]}-L.jpg`
    }
    return book
}

const TFIOS = {
    title: "The Fault in Our Stars",
    author: "John Green",
    imageURL: "../img/ExampleBook.png",
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

async function addBooks() {
    const harryPotter = await getBook("Harry Potter and the Deathly Hallows")
    const percyJackson = await getBook("Percy Jackson and the Last Olympian")
    const ROTK = await getBook("The Return of the King")

    bookContainer.appendChild(bookDisplay(harryPotter))
    bookContainer.appendChild(bookDisplay(percyJackson))
    bookContainer.appendChild(bookDisplay(ROTK))
}
addBooks()