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

const logInForm = document.forms[0];
const registerForm = document.forms[1];

function registerUser(event) {
  event.preventDefault();

  const user = {
    Name: registerForm.name.value,
    Email: registerForm.email.value,
    Password: registerForm.password.value
  };
  console.log(user);
  request("/addUser", "POST", user)
    .then(res => res.json())
    .then(result => {
      console.log(result);
      localStorage.setItem("UserID", result.UserID);
     if (result.success) sendToPage("account");
    });
  // Simulate a mouse click:
  return false;
}

function logInUser(event) {
  event.preventDefault();

  const user = {
    Email: logInForm.email.value,
    Password: logInForm.password.value
  };
  console.log(user);
  request("/logInUser", "POST", user)
    .then(res => res.json())
    .then(result => {
      console.log(result);
      if (result.success) {
        localStorage.setItem("UserID", result.UserID);
        sendToPage("account");
      }
    });
  // Simulate a mouse click:
  return false;
}

registerForm.onsubmit = registerUser;
logInForm.onsubmit = logInUser;


if (UserID != null) {
  sendToPage("account");
}
