// client-side js
// run by the browser each time your view template referencing it is loaded

console.log("hello world :o");

const users = [];

// define variables that reference elements on our page
const signUpForm = document.forms[0];
const logInForm = document.forms[1];

const signUpNameInput = signUpForm.elements["name"];
const signUpEmailInput = signUpForm.elements["email"];
const signUpPasswordInput = signUpForm.elements["password"];

const logInEmailInput = logInForm.elements["email"];
const logInPasswordInput = logInForm.elements["password"];

const userList = document.getElementById("users");
const clearButton = document.querySelector("#clear-users");

// request the users from our app's sqlite database
fetch("/getUsers", {})
  .then(res => res.json())
  .then(response => {
    response.forEach(user => {
      displayUser(user);
    });
  });


function request(url, method = "GET", body = {}) {
  const bodyString = body instanceof String ? body : JSON.stringify(body);
  return fetch(url, {
    method,
    mode: "cors", // no-cors, *cors, same-origin
    cache: "no-cache", // *default, no-cache, reload, force-cache, only-if-cached
    credentials: "same-origin", // include, *same-origin, omit
    headers: {
      "Content-Type": "application/json"
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: "follow", // manual, *follow, error
    referrerPolicy: "no-referrer", // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: bodyString
  });
}
// a helper function that creates a list item for a given user
const displayUser = user => {
  const newListItem = document.createElement("li");
  const deleteButton = document.createElement("button");
  userList.appendChild(newListItem);

  if (user instanceof String) {
    newListItem.innerText = user;
    deleteButton.innerText = `Delete ${user}`;
  } else {
    newListItem.innerText = JSON.stringify(user);
    deleteButton.innerText = `Delete ${user.Name}`;
  }
  newListItem.appendChild(deleteButton);
  deleteButton.onclick = async () => {
    try {
      const deleted = await request("/deleteUser", "POST", {
        UserID: user.UserID
      });
      for (let i = 0; i < users.length; i++) {
        if (users[i] == user) {
          users.splice(i, 1);
          userList.removeChild(userList.children[i]);
          break;
        }
      }
    } catch (e) {
      console.log(e);
    }
  };
};

// listen for the form to be submitted and add a new user when it is
signUpForm.onsubmit = async event => {
  // stop our form submission from refreshing the page
  event.preventDefault();

  const user = {
    Name: signUpNameInput.value,
    Email: signUpEmailInput.value,
    Password: signUpPasswordInput.value
  };
  console.log(user);
  const userResponse = await request("/addUser", "POST", user).then(res =>
    res.json()
  );
  user.UserID = userResponse.UserID;
  console.log(userResponse);
  // get user value and add it to the list
  users.push(user);
  displayUser(user);

  // reset form
  signUpNameInput.value = "";
  signUpEmailInput.value = "";
  signUpPasswordInput.value = "";
  signUpNameInput.focus();
};

logInForm.onsubmit = async e =>{
  e.preventDefault()
  
  const user = {
    Email: logInEmailInput.value,
    Password: logInPasswordInput.value
  }
  const logIn = await request("/logInUser", "POST", user).then(res =>
    res.json()
  );
}

clearButton.addEventListener("click", event => {
  fetch("/deleteUsers", {})
    .then(res => res.json())
    .then(response => {
      console.log("cleared users");
    });
  userList.innerHTML = "";
});
