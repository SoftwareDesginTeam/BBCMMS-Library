-- DROP TABLE IF EXISTS "User"
CREATE TABLE "User"
(
    UserId INT NOT NULL PRIMARY KEY, -- primary key column
    Email TINYTEXT NOT NULL,
    "Password" TINYTEXT NOT NULL
    -- specify more columns here
);

-- DROP TABLE IF EXISTS "BookLendings"
CREATE TABLE BookLendings
(
    UserID INT NOT NULL FOREIGN KEY REFERENCES "User"(UserID),
    ISBN VARCHAR(25) NOT NULL
);

-- DROP TABLE IF EXISTS "BookReservations"
CREATE TABLE BookReservations
(
    UserID INT NOT NULL FOREIGN KEY REFERENCES "User"(UserID),
    ISBN VARCHAR(25) NOT NULL,
    DateReserved DATETIME
);