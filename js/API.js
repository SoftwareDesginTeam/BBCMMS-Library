const url = "https://openlibrary.org/api/books?bibkeys=ISBN:9780980200447&jscmd=data&format=json"

console.log(`Fetching from ${url}`)

// Get the data from the api
fetch(url)
    // Turn it into JSON
    .then(resp => resp.json())
    // Print it out
    .then(data => {
        console.log(data)
    })