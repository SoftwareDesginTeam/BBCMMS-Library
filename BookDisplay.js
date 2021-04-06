/*
<a href="./" class="ebook-clickable">
    <img src="images/ExampleBook.png" alt="Ebook Cover" />
</a>
*/
/*
class Book{
    string title
    string imageURL
    string description
}
*/
function bookDisplay(book) {
    const bookClickable = document.createElement('a')
    bookClickable.href = book.imageURL

    const bookImage = document.createElement('img')
    bookImage.src = book.imageURL
    bookImage.alt = book.title
    bookClickable.appendChild(bookImage)
    bookClickable.append(book.title)
    bookClickable.append(book.description)
    return bookClickable
}