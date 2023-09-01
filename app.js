const myNook = [];
const newBookButton = document.querySelector('#newBookButton');
const newBookModal = document.querySelector('#newBookModal');
const bookTitle = document.querySelector('#bookTitle');
const bookAuthor = document.querySelector('#bookAuthor');
const bookRead = document.querySelector('#bookRead');

function addBookToNook(book) {
    myNook.push(book);
}

function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;

    this.info = () => {
        statusString = status ? 'read' : 'not read';
        return `${title} by ${author}, ${pages} pages, ${statusString}`;
    }
}


newBookButton.addEventListener('click', () => {
    newBookModal.showModal();
})