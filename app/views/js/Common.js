const currentPage = window.location.href.split("/").pop()

function onPage(page) {
    return currentPage.startsWith(`${page}.html`)
}
function sendToPage(page) {
    if(!onPage(page))
      window.location.href = `${window.location.origin}/${page}.html`;
}
function sendToLogin(){
  sendToPage('')
}

let UserID = localStorage.getItem("UserID");
if (UserID == null) {
    sendToPage('login')
}

function setUserID(id){
  UserID = id
  localStorage.setItem("UserID",id)
}

function logout() {
    localStorage.removeItem("UserID");
    sendToPage('login')
}