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

    // prevent reprint upon new books
    this.printed = false;
}

Book.prototype.getDataIndex = function() {
    let index = myNook.findIndex(book => book.title === this.title);
    return index;
}


function deleteBookCard(index) {
    let currentBookCard = document.querySelector(`[data-index="${index}"`);
    
    currentBookCard.remove();
}

function displayNook() {
    console.log(myNook);
    myNook.forEach((book) => {
        if (!book.printed) {
            const bookCard = document.createElement('div');
            bookCard.setAttribute('data-index', book.getDataIndex());

            const bookTitle = document.createElement('div');
            const bookAuthor = document.createElement('div');
            const bookPages = document.createElement('div');
            const bookRead = document.createElement('div');
            const deleteButton = document.createElement('button');
            deleteButton.classList.add('removeBook');
            deleteButton.setAttribute('data-index', book.getDataIndex());
            deleteButton.addEventListener('click', function () {
                let bookIndex = this.getAttribute('data-index');
                console.log(bookIndex);
                deleteBookCard(bookIndex);
            });

            bookTitle.textContent = `Title: ${book.title}`;
            bookAuthor.textContent = `Author: ${book.author}`;
            bookPages.textContent = `Pages: ${book.pages}`;
            bookRead.textContent = `Status: ${book.status}`;
            deleteButton.textContent = 'remove';


            bookCard.appendChild(bookTitle);
            bookCard.appendChild(bookAuthor);
            bookCard.appendChild(bookPages);
            bookCard.appendChild(bookRead);
            bookCard.appendChild(deleteButton);

            nook.appendChild(bookCard);

            book.printed = true;
        }
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
