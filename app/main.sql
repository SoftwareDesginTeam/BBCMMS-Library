-- DROP TABLE IF EXISTS "UserTable";
CREATE TABLE IF NOT EXISTS "UserTable"
(
    UserID INTEGER PRIMARY KEY,-- primary key column
    Name VARCHAR NOT NULL,
    Email VARCHAR NOT NULL,
    "Password" VARCHAR NOT NULL
    -- specify more columns here
);

-- DROP TABLE IF EXISTS "CheckedOut"
CREATE TABLE IF NOT EXISTS "CheckedOut"
(
    UserID INT NOT NULL,
    ISBN VARCHAR(25) NOT NULL,
    PRIMARY KEY(UserID, ISBN),
	  FOREIGN KEY (UserID) REFERENCES "UserTable"(UserID)
);

-- DROP TABLE IF EXISTS "BookReservations"
CREATE TABLE IF NOT EXISTS "BookReservations"
(
    UserID INT NOT NULL,
    ISBN VARCHAR(25) NOT NULL,
    DateReserved DATE,
	  FOREIGN KEY (UserID) REFERENCES "UserTable"(UserID)
);
-- DROP TABLE IF EXISTS "Cart"
CREATE TABLE IF NOT EXISTS "Cart"
(
    UserID INT NOT NULL,
    ISBN VARCHAR(25) NOT NULL,
    PRIMARY KEY(UserID, ISBN),
    FOREIGN KEY (UserID) REFERENCES "UserTable"(UserID)
);