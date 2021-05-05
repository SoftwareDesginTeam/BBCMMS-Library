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
  }).then(x => x.json());
}

function getURLParameter(name) {
  return decodeURI(
    (RegExp(`${name}\s*=(.+?)(&|$)`).exec(location.search) || [, null])[1]
  );
}

const searchForm = document.forms[0];
const search = getURLParameter("search").replace("+", " ");
searchForm["search"].value = search;
searchLibrary(search);

async function searchLibrary(query) {
  const books = await getBooks(query, 5);
  for (const book of books) {
    const result = bookDisplay(book);
    const checkoutButton = document.createElement("button");
    checkoutButton.textContent = "Check out";
    checkoutButton.onclick = async () => {
      await request("/checkout", "POST", { UserID,ISBNs: [book.isbn] }).then(res => {
        console.log(res);
        // if (res.success) sendToPage("account");
        alert("Added to Check out");
      });
      // console.log("Checking out", book)
    };
    const cartButton = document.createElement("button");
    cartButton.textContent = "Add to cart";
    cartButton.onclick = async () => {
      console.log(book);
      await request("/addToCart", "POST", { UserID, ISBNs: [book.isbn] }).then(
        res => {
          console.log(res);
          alert("Added to cart");
          // if (res.success) sendToPage("account");
        }
      );
      // console.log("Carting ", book)
    };
    result.appendChild(checkoutButton);
    result.appendChild(cartButton);
    bookContainer.appendChild(result);
  }
}
