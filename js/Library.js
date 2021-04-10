// The information stored for each eBook in the catalog
class eBook {
    //Constructs ebook
    constructor(title, authors, genre) {
        this.title = title;
        this.author = author;
        this.genre = genre;
    }
    edit(newTitle, newAuthor, newGenre) {
        this.title = newTitle;
        this.author = newAuthor;
        this.genre = newGenre;
        //<script>window.alert(Ebook has been edited);</script> //To be added when consructed in HTML part
    }
}


class Person {
    //Constructs Person
    constructor(firstName, lastName, email, membershipID, password, isLibrarian) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.membershipID = membershipID;
        this.password = password;

        if (isLibrarian) {
            Person.Librarians.add(this.membershipID)
        }
    }
    edit(newFirstName, newLastName, newEmail, newMebershipID) {
        this.firstName = newFirstName;
        this.lastName = newLastName;
        this.email = newEmail;
        this.membershipID = newMebershipID;
        //<script>window.alert(Your Information has been updated);</script> //To be added when consructed in HTML part
    }
    resetPassword(newPassword) {
        this.password = newPassword;
    }
}

// Set of the people who have librarian permissions
Person.Librarians = new Set()



class Account {
    //Constructs Account
    constructor(memberID, checkedOutEbooks, reservations, active, deleted) {
        this.memberID = memberID;
        this.checkedOutEbooks = checkedOutEbooks;
        this.reservations = reservations;
        this.active = active;
        this.deleted = deleted;
    }
}

function validate(){
    var username = document.getElementById("email").value;
    var password = document.getElementById("psw").value;
    if(username == Person.email && password == Person.password){
        alert("Login Succesful");
        return false;
    }else{
        alert("Login Failed")
    }
}

class BookReservation {
    constructor(creationDate, ReservationStatus, bookItemBarcode, memberId) {
        this.creationDate = creationDate;
        this.ReservationStatus = ReservationStatus;
        this.bookItemBarcode = bookItemBarcode;
        this.memberId = memberId;
    }
    removeReservation(b) {
        //This will be for both checkingout the book and simply removing the hold
        //find book and change status
        this.ReservationStatus = ReservationStatus;
        this.bookItemBarcode = bookItemBarcode;
        this.memberId = memberId;
        //update member reservations and catalog hold list
    }
}

// A collection of books the program will have access to
class Catalog {
    constructor() {
        // Set of eBooks
        this.books = new Set()
    }

    // Query the title, author, genre of all eBooks
    search(query) {
        // Create case-insesitive regular expression
        const queryRegex = new RegExp(query, "i")
        const matches = new Set()

        for (const eBook of this.books) {
            // Query all properties
            if (
                queryRegex.test(eBook.title) ||
                queryRegex.test(eBook.author) ||
                queryRegex.test(eBook.genre)
            ) {
                matches.add(eBook)
            }
        }
        return matches
    }

    // Add an eBook to the Catalog
    addEbook(eBook) {
        this.books.add(eBook)
    }

    // Remove an eBook from the Catalog
    removeEbook(eBook) {
        this.books.delete(eBook)
    }
}