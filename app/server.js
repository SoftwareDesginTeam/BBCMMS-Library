// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const fs = require("fs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// we've started you off with Express,
// but feel free to use whatever libs or frameworks you'd like through `package.json`.

// http://expressjs.com/en/starter/static-files.html
app.use(express.static("views"));

// init sqlite db
const dbFile = "./.data/sqlite.db";
const exists = fs.existsSync(dbFile);
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

// if ./.data/sqlite.db does not exist, create it, otherwise print records to console
if (!exists) {
  db.serialize(() => {
    fs.readFile("./main.sql", "utf8", (err, data) => {
      if (err) {
        console.error(err);
        return;
      }
      for (const query of data.split(";")) {
        console.log(query);
        db.run(query);
      }
      console.log("New table User Table created!");
    });
  });
}
db.all(`SELECT * FROM sqlite_master WHERE type='table'`, (e, d) => {
  console.log(e, d.map(x => x.name));
  for (const table of d.map(x => x.name)) {
    db.all(`SELECT * FROM ${table}`, (e, d) => {
      console.log(d);
    });
  }
});

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", (request, response) => {
  response.sendFile(`${__dirname}/views/login.html`);
});

// send to the account page
app.get("/account/:UserID", (request, response) => {
  response.sendFile(`${__dirname}/views/account.html`);
});

// endpoint to get all the users in the database
app.get("/getUsers", (request, response) => {
  db.all("SELECT * from UserTable", (err, rows) => {
    response.send(rows);
  });
});

// endpoint to add a user to the database
app.post("/addUser", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    console.log("body", request.body);
    const name = cleanseString(request.body.Name);
    const email = cleanseString(request.body.Email);
    const password = cleanseString(request.body.Password);
    console.log(name, email, password);
      //   db.get(
      // `INSERT INTO UserTable (Name,Email,Password) VALUES ("${name}","${email}","${password}")`,)
    db.run(
      `INSERT INTO UserTable (Name,Email,Password) VALUES ("${name}","${email}","${password}")`,
      function(error, row) {
        console.log(error, row);
        if (error) {
          console.log(error);
          response.send({ error, success: false, message: "error!" });
        } else {
          response.send({
            success: true,
            message: "success",
            UserID: this.lastID
          });
        }
      }
    );
  }
});

function isUniqueError(e) {
  return e.errno == 19;
}
function checkout(UserID, ISBNs) {
  let error;
  for (const isbn of ISBNs) {
    db.run(
      `INSERT INTO CheckedOut (UserID, ISBN) VALUES (${UserID},${isbn})`,
      (e, d) => {
        if (e && !isUniqueError(e)) {
          error = e;
        }
      }
    );
    if (error) break;
  }
  return error;
}
app.post("/checkout", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const UserID = request.body.UserID;
    const ISBNs = request.body.ISBNs;

    if (UserID == undefined) {
      response.send({
        success: false,
        message: "error!",
        error: { message: "No UserID" }
      });
      return;
    }

    if (ISBNs == undefined) {
      response.send({
        success: false,
        message: "error!",
        error: { message: "No ISBNs" }
      });
      return;
    }

    const error = checkout(UserID, ISBNs);

    if (error) {
      console.log(error);
      response.send({ error, success: false, message: "error!" });
    } else {
      response.send({
        success: true,
        message: "success",
        UserID
      });
    }
  }
});

app.post("/addToCart", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const UserID = request.body.UserID;
    const ISBNs = request.body.ISBNs;
    console.log(request.body);
    if (UserID == undefined) {
      response.send({
        success: false,
        message: "error!",
        error: { message: "No UserID" }
      });
      return;
    }
    if (ISBNs == undefined) {
      response.send({
        success: false,
        message: "error!",
        error: { message: "No ISBNs" }
      });
      return;
    }

    let errorFound = null;
    for (const isbn of ISBNs) {
      db.run(
        `INSERT INTO Cart (UserID, ISBN) VALUES (${UserID},${isbn})`,
        (e, d) => {
          if (e && !errorFound && !isUniqueError(e)) {
            errorFound = e;
            console.log("ERR", e, UserID, isbn);
          }
        }
      );
      if (errorFound) break;
    }
    if (errorFound)
      response.send({
        success: false,
        message: "error!",
        error: errorFound,
        UserID
      });
    else
      response.send({
        success: true,
        message: "success",
        UserID,
        ISBNs
      });
  }
});

// endpoint to add a user to the database
app.get("/checkedOut/:UserID", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const UserID = new Number(request.params.UserID);
    console.log(`[LENDINGS]ID: ${UserID}`);
    db.all(
      `SElECT * FROM CheckedOut WHERE UserID = ${UserID}`,
      [UserID],
      function(error, rows) {
        console.log(rows, error);
        if (error) {
          console.log(error);
          response.send({ error, success: false, message: "error!" });
        } else {
          console.log("Done?");
          response.send({
            success: true,
            message: "success",
            UserID,
            ISBNs: rows.map(x => +x.ISBN)
          });
        }
      }
    );
  }
});

function getCart(UserID) {
  console.log(`[Cart]ID: ${UserID}`);
  return new Promise((res, rej) => {
    db.all(`SElECT * FROM Cart WHERE UserID = ${UserID}`, [UserID], function(
      error,
      rows
    ) {
      console.log(rows);
      if (error) {
        console.log(error);
        rej(error);
      } else {
        res(rows.map(x => +x.ISBN));
      }
    });
  });
}

// endpoint to add a user to the database
app.get("/getCart/:UserID", async (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const UserID = new Number(request.params.UserID);
    getCart(UserID)
      .catch(error =>
        response.send({ error, success: false, message: "error!" })
      )
      .then(cart =>
        response.send({
          success: true,
          message: "success",
          UserID,
          ISBNs: cart
        })
      );
  }
});

function clearCart(UserID) {
  console.log(`[Cart]ID: ${UserID}`);
  db.run(`DELETE FROM Cart WHERE UserID = ${UserID}`, [UserID]);
}

app.post("/returnAll", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const UserID = new Number(request.body.UserID);
    let error;
    db.run(`DELETE FROM CheckedOut WHERE UserID = ${UserID}`, (e, d) => {
      if (e) {
        error = e;
      }
    });
    if (error) {
      response.send({
        success: false,
        message: "error!",
        error,
        UserID
      });
    } else
      response.send({
        success: true,
        message: "Success!",
        UserID
      });
  }
});

app.post("/returnAll", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const UserID = new Number(request.body.UserID);
    let error;
    db.run(`DELETE FROM CheckedOut WHERE UserID = ${UserID}`, (e, d) => {
      if (e) {
        error = e;
      }
    });
    if (error) {
      response.send({
        success: false,
        message: "error!",
        error,
        UserID
      });
    } else
      response.send({
        success: true,
        message: "Success!",
        UserID
      });
  }
});
app.post("/return", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const UserID = new Number(request.body.UserID);
    const ISBNs = request.body.ISBNs;

    let error;
    db.run(
      `DELETE FROM CheckedOut WHERE UserID = ${UserID} AND ISBN IN (${ISBNs})`,
      (e, d) => {
        if (e) {
          error = e;
        }
      }
    );
    console.log(error);
    if (error) {
      response.send({
        success: false,
        message: "error!",
        error,
        UserID
      });
    } else
      response.send({
        success: true,
        message: "Success!",
        UserID
      });
  }
});

// endpoint to add a user to the database
app.post("/removeFromCart", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const UserID = new Number(request.body.UserID);
    const ISBNs = request.body.ISBNs;
    if (UserID == undefined) {
      response.send({
        success: false,
        message: "error!",
        error: { message: "No UserID" }
      });
      return;
    }
    if (ISBNs == undefined) {
      response.send({
        success: false,
        message: "error!",
        error: { message: "No ISBNs" }
      });
      return;
    }

    let error;
    db.run(
      `DELETE FROM Cart WHERE UserID = ${UserID} AND ISBN IN (${ISBNs})`,
      (e, d) => {
        if (e) {
          error = e;
        }
      }
    );
    if (error) {
      response.send({
        success: false,
        message: "error!",
        error,
        UserID
      });
    } else
      response.send({
        success: true,
        message: "Success!",
        UserID
      });
  }
});
// endpoint to add a user to the database
app.get("/checkoutCart/:UserID", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    const UserID = new Number(request.params.UserID);
    if (UserID == undefined) {
      response.send({
        success: false,
        message: "error!",
        error: { message: "No UserID" }
      });
      return;
    }
    getCart(UserID)
      .then(toCheckOut => {
        clearCart(UserID);
        checkout(UserID, toCheckOut);
        response.send({
          success: true,
          message: "Success!",
          UserID
        });
      })
      .catch(error => {
        response.send({
          error,
          success: false,
          message: "Error!",
          UserID
        });
      });
  }
});

// endpoint to add a user to the database
app.post("/logInUser", (request, response) => {
  if (!process.env.DISALLOW_WRITE) {
    console.log(request.body);
    const email = cleanseString(request.body.Email);
    const password = cleanseString(request.body.Password);
    db.get(
      `SELECT UserID, \`Password\` FROM UserTable WHERE Email = ?`,
      [email],
      function(error, row) {
        console.log(row, this);
        if (error) {
          console.log(error);
          response.send({ success: false, message: "Database error" });
        } else if (row == null) {
          response.send({ success: false, message: "User not found" });
        } else if (row.Password != password) {
          response.send({ success: false, message: "Incorrect Password" });
        } else {
          response.send({
            success: true,
            message: "Success!",
            UserID: row.UserID
          });
        }
      }
    );
  }
});

// endpoint to clear users from the database
app.delete("/deleteUsers", (request, response) => {
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  if (!process.env.DISALLOW_WRITE) {
    db.each(
      "SELECT * from UserTable",
      (err, row) => {
        console.log("row", row);
        db.run(`DELETE FROM UserTable WHERE UserID=?`, row.UserID, error => {
          if (row) {
            console.log(`deleted row ${row.UserID}`);
          }
        });
      },
      err => {
        if (err) {
          response.send({ message: "error!" });
        } else {
          response.send({ message: "success" });
        }
      }
    );
  }
});

// endpoint to clear users from the database
app.post("/deleteUser", (request, response) => {
  // DISALLOW_WRITE is an ENV variable that gets reset for new projects so you can write to the database
  const row = request.body;
  console.log("Delete", row);
  if (!process.env.DISALLOW_WRITE) {
    db.run(`DELETE FROM UserTable WHERE UserID=?`, row.UserID, error => {
      if (row) {
        console.log(`deleted row ${row.UserID}`);
      }
      if (error) {
        response.send({ message: "error!" });
      } else {
        response.send({ message: "success" });
      }
    });
  }
});

// helper function that prevents html/css/script malice
const cleanseString = function(string) {
  return string.replace(/</g, "&lt;").replace(/>/g, "&gt;");
};

// listen for requests :)
var listener = app.listen(process.env.PORT, () => {
  console.log(`Your app is listening on port ${listener.address().port}`);
});
