CREATE TABLE "UserTable"
(
    UserId INT NOT NULL PRIMARY KEY, -- primary key column
    Email VARCHAR NOT NULL,
    "Password" VARCHAR NOT NULL
    -- specify more columns here
);

-- DROP TABLE IF EXISTS "BookLendings"
CREATE TABLE BookLendings
(
    UserID INT NOT NULL,
    ISBN VARCHAR(25) NOT NULL,
	FOREIGN KEY (UserID) REFERENCES "UserTable"(UserID)
);

-- DROP TABLE IF EXISTS "BookReservations"
CREATE TABLE BookReservations
(
    UserID INT NOT NULL,
    ISBN VARCHAR(25) NOT NULL,
    DateReserved DATE,
	FOREIGN KEY (UserID) REFERENCES "UserTable"(UserID)
);

-- As a reference, if needed
Select * from "UserTable"
INSERT INTO "UserTable" (UserId, Email, "Password")
VALUES (15356, 'hatsoff@gmail.com', 'doggy');
