function request(url, method = "GET", body = {}) {
    const bodyString = body instanceof String ? body : JSON.stringify(body);
    const data = {
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
    };
    if (data.method.toLowerCase() == "get") {
        data.body = undefined;
    }
    return fetch(url, data).then(x => x.json());
}

async function addISBNs(elementID, isbns, process=()=>{}) {
    const element = document.getElementById(elementID)
    for (const bookISBN of isbns) {
        const bookItem = await getBookByISBN(bookISBN)
        const bookElement = bookDisplay(bookItem)
        await process(bookISBN,bookItem,bookElement)
        element.appendChild(bookElement)
    }
}
async function main() {
    // console.log("posting")
    // const post = await request(`/addLendings`, "POST", { UserID, ISBNs: ["32"] });
    // console.log("response",post)
    if (UserID == null) {
        sendToPage('login')
    }

    const lendings = await request(`/checkedOut/${UserID}`, "GET")
    console.log("lendings", lendings)
    const cart = await request(`/getCart/${UserID}`, "GET")
    console.log(lendings, cart);

    await addISBNs("cart", cart.ISBNs,  (isbn,book,element)=>{
      const removeFromCart = document.createElement("button")
      removeFromCart.textContent = "Remove from cart"
      removeFromCart.onclick = async()=>{
        console.log(await request("/removeFromCart","POST",{UserID,ISBNs:[isbn]}))
        element.parentElement.removeChild(element); 
      }
      element.appendChild(removeFromCart)
    })
    await addISBNs("checkedOut", lendings.ISBNs, (isbn,book,element)=>{
      const checkIn = document.createElement("button")
      checkIn.textContent = "Return"
      checkIn.onclick = async ()=>{
        console.log(await request("/return","POST",{UserID,ISBNs:[isbn]}))
        element.parentElement.removeChild(element); 
      }
      element.appendChild(checkIn)      
    })
}

async function checkoutCart() {
    const res = await request(`/checkoutCart/${UserID}`)
    console.log(res)
    location.reload();
}

async function clearCart() {
    const res = await request(`/clearCart/${UserID}`)
    console.log(res)
    location.reload();
}

async function returnBooks(books) {
    const res = await request(`/returnBooks`,"POST",{UserID,ISBNs:books})
    console.log(res)
    location.reload();
}

async function returnAll() {
    const res = await request(`/returnAll`,"POST",{UserID})
    console.log(res)
    location.reload();
}
main().catch(console.log);