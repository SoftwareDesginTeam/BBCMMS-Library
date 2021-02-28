class eBook {
  constructor(title, authors, genre) {
    this.title = title;
    this.author = author;
    this.genre = genre;
  }
}
class Person{
  constructor(firstName, lastName, email, membershipID, password){
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.membershipID = memebershipID;
    this.password = password;
  }
}
  class Account{
    constructor(memberID, checkedOutEbooks, reservations, active, deleted){
      this.memberID = memberID;
      this.checkedOutEbooks = checkedOutEbooks;
      this.reservations =reservations;
      this.active = active;
      this.deleted = deleted;
    }
  }
