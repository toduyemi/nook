const myNook = [];
const nook = document.querySelector('#nook');
const newBookButton = document.querySelector('#newBookButton');
const newBookModal = document.querySelector('#newBookModal');
const addBookForm = document.querySelector('#addBookForm')
const shelveButton = document.querySelector('#shelveBook');
const closeDialogButton = document.querySelector('#closeDialog');
let NewBook;

function addBookToNook(book) {
    myNook.push(book);
}

function Book(title, author, pages, status) {
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.status = status;
}

const displayNook = () => {
    console.log(myNook);
    myNook.forEach((book) => {
        const bookCard = document.createElement('div');


        const bookTitle = document.createElement('div');
        const bookAuthor = document.createElement('div');
        const bookPages = document.createElement('div');
        const bookRead = document.createElement('div');

        bookTitle.textContent = `Title: ${book.title}`;
        bookAuthor.textContent = `Author: ${book.author}`;
        bookPages.textContent = `Pages: ${book.pages}`;
        bookRead.textContent = `Status: ${book.status}`;
        

        bookCard.appendChild(bookTitle);
        bookCard.appendChild(bookAuthor);
        bookCard.appendChild(bookPages);
        bookCard.appendChild(bookRead);

        nook.appendChild(bookCard);
    });

}


newBookButton.addEventListener('click', () => {
    newBookModal.showModal();
})

closeDialogButton.addEventListener('click', () => {
    newBookModal.close();
})

addBookForm.addEventListener('submit', (e) => {
    const bookTitle = this.bookTitle.value;
    const bookAuthor = this.bookAuthor.value;
    const bookPages = this.bookPages.value;
    const bookRead = this.bookRead.value;

    NewBook = new Book(bookTitle, bookAuthor, bookPages, bookRead);
    addBookToNook(NewBook);
    
    displayNook();
});


