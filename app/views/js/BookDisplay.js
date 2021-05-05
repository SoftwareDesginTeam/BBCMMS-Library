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
  const element = document.createElement(tagName);
  for (const property in properties) {
    element[property] = properties[property];
  }
  return element;
}

// Gets the HTML to display the image of a book
function bookImage(book) {
  const image = getElement("img", { src: book.imageURL, alt: book.title });
  image.width = window.innerWidth / 20;
  return image;
}

// Gets the HTML to display the title of a book
function bookTitle(book) {
  return getElement("h3", { textContent: book.title });
}

// Gets the HTML to display the author of a book
function bookAuthor(book) {
  return getElement("h4", { textContent: book.author });
}

// Gets the HTML to display the description of a book
function bookDescription(book) {
  return getElement("p", { textContent: book.description });
}

// Gets an HTML element displaying the information for a book
function bookDisplay(book) {
  const bookClickable = getElement("div", { href: book.imageURL });
  if (book.imageURL) bookClickable.appendChild(bookImage(book));
  bookClickable.append(bookTitle(book));
  bookClickable.append(bookAuthor(book));
  bookClickable.append(bookDescription(book));
  return bookClickable;
}
async function getISBN(work) {
  const newestEdition = work.edition_key[work.edition_count - 1];
  const editionData = await fetch(
    `https://openlibrary.org/books/${newestEdition}.json`
  ).then(d => d.json());
  console.log(editionData, editionData.isbn_13);
  return (editionData.isbn_13 || editionData.isbn_10 || editionData.isbn)?.[0];
}
async function processBook(work) {
  const bookData = await fetch(`https://openlibrary.org${work.key}.json`).then(
    d => d.json()
  );

  const authorData = await fetch(
    `https://openlibrary.org${bookData.authors[0].author.key}.json`
  ).then(d => d.json());
  console.log(work, bookData);
  const book = {
    title: bookData.title,
    author: authorData.name,
    description:
      bookData.description == undefined ||
      (typeof bookData.description === "string" ||
        bookData.description instanceof String)
        ? bookData.description
        : bookData.description.value
  };
  if (bookData.covers && bookData.covers.length)
    book.imageURL = `https://covers.openlibrary.org/b/id/${
      bookData.covers[0]
    }-L.jpg`;
  return book;
}
// Get any and all book info
async function getBooks(title, limit = 1) {
  limit = Math.min(limit, 100);
  const bookResponse = await fetch(
    `https://openlibrary.org/search.json?limit=${limit}&title=${title
      .split(" ")
      .join("+")}`
  ).then(d => d.json());
  console.log(bookResponse);
  return Promise.all(
    bookResponse.docs.map(async doc => {
      const book = await processBook(doc);
      book.isbn = await getISBN(doc);
      console.log(book)
      return book
    })
  );
}
async function getBookByISBN(isbn) {
  const editionResponse = await fetch(
    `https://openlibrary.org/isbn/${isbn}.json`
  ).then(d => d.json());
  const bookResponse = await fetch(
    `https://openlibrary.org${editionResponse.works[0].key}.json`
  ).then(d => d.json());
  return processBook(bookResponse);
}

const bookContainer = document.getElementById("books");

async function addBooks() {
  const harryPotter = (await getBooks(
    "Harry Potter and the Deathly Hallows",
    1
  ))[0];
  const percyJackson = (await getBooks(
    "Percy Jackson and the Last Olympian",
    1
  ))[0];
  const ROTK = (await getBooks("The Return of the King", 1))[0];

  bookContainer.appendChild(bookDisplay(harryPotter));
  bookContainer.appendChild(bookDisplay(percyJackson));
  bookContainer.appendChild(bookDisplay(ROTK));
}
// addBooks()

/**
 * User
 * ID | EMAIL | PASSWORD
 *
 * Book [Through API]
 * ISBN | Title | Author
 *
 * BooksLent
 * UserID [User] | ISBN
 */
