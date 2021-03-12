class eBook {
  constructor(title, authors, genre) {//Constructs ebook
    this.title = title;
    this.author = author;
    this.genre = genre;
  }
  edit(x,y,z){
    this.title = x;
    this.author = y;
    this.genre = z;
    //<script>window.alert(Ebook has been edited);</script> //To be added when consructed in HTML part
  }
}
class Person{
  constructor(firstName, lastName, email, membershipID, password){//Constructs Person
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.membershipID = memebershipID;
    this.password = password;
  }
  edit(a,b,c,d,e){
    this.firstName = a;
    this.lastName = b;
    this.email = c;
    this.membershipID = d;
    this.password = e;
    //<script>window.alert(Your Information has been updated);</script> //To be added when consructed in HTML part
  }
}
  class Account{
    constructor(memberID, checkedOutEbooks, reservations, active, deleted){//Constructs Account
      this.memberID = memberID;
      this.checkedOutEbooks = checkedOutEbooks;
      this.reservations =reservations;
      this.active = active;
      this.deleted = deleted;
    }
  }

class BookReservation {
  constructor(creationDate,ReservationStatus, bookItemBarcode, memberId){
    this.creationDate = creationDate;
    this.ReservationStatus = ReseevationStatus;
    this.bookItemBarcode = bookItemBarcode;
    this.memberId = memberId;
  }
}
