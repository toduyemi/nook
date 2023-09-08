const myNook = [];
const nook = document.querySelector('#nook');
const newBookButton = document.querySelector(' #newBookButton');
const newBookModal = document.querySelector('#newBookModal');
const addBookForm = document.querySelector('#addBookForm')
const shelveButton = document.querySelector('#shelveBook');
const closeDialogButton = document.querySelector('#closeDialog');
const closeEditDialogButton = document.querySelector('#editBookForm #closeDialog');
let NewBook;


function Book(title, author, pages, progress) {

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.progress = progress;

    // prevent reprint upon new books
    this.printed = false;

    //made editBookModal element a property of card so it would have access to element properties
    //does this really need to be a property of constructor?
    this.editBookModal = document.querySelector('#editBookModal');
    this.editBookForm = document.querySelector('#editBookForm');


    // this.editBookForm.prototype.prefillEditBookForm = function () {
    //     this
    // }

}

Book.prototype.createBookCard = function () {
    //create bookcard div as a property of Book constructor
    this.bookCard = document.createElement('div');
    this.bookCard.classList.add('bookCard');


    //also create delete and edit buttons to be properties of Book constructor
    //this is done to intrinsically bind each element to its parent object
    bookTitle = document.createElement('div');
    bookAuthor = document.createElement('div');
    bookPages = document.createElement('div');
    bookRead = document.createElement('div');
    this.deleteButton = document.createElement('button');
    this.editButton = document.createElement('button');

    this.deleteButton.classList.add('bookCardButton');
    this.deleteButton.addEventListener('click', function () {
        let bookIndex = this.getAttribute('data-index');
        deleteBookCard(bookIndex);
    });

    this.editButton.classList.add('bookCardButton');
    this.editButton.addEventListener('click', () => {
        this.editBookModal.showModal();
        closeEditDialogButton.addEventListener('click', () => {
            this.editBookModal.close();
        });
        this.prefillEditBookForm();

    });

    bookTitle.textContent = `Title: ${this.title}`;
    bookAuthor.textContent = `Author: ${this.author}`;
    bookPages.textContent = `Pages: ${this.pages}`;
    bookRead.textContent = `Status: ${this.progress}`;
    this.deleteButton.textContent = 'remove';
    this.editButton.textContent = 'edit';

    this.bookCard.appendChild(bookTitle);
    this.bookCard.appendChild(bookAuthor);
    this.bookCard.appendChild(bookPages);
    this.bookCard.appendChild(bookRead);
    this.bookCard.appendChild(this.deleteButton);
    this.bookCard.appendChild(this.editButton);

    return this.bookCard;
}

Book.prototype.setDataIndex = function () {
    const bookCard = this.bookCard;
    let index = myNook.indexOf(this);

    this.id = index;

    bookCard.setAttribute('data-index', index);

    //declared and attribute set down here due to dependency of bookCard dataindex css locator
    const bookCardButtons = document.querySelectorAll(`.bookCard[data-index="${index}"] .bookCardButton`);
    bookCardButtons.forEach((card) => card.setAttribute('data-index', index));


    return index;
}

Book.prototype.editBook = function () {

}

Book.prototype.prefillEditBookForm = function () {
    this.editBookForm.bookTitle.value = this.title;
    this.editBookForm.bookAuthor.value = this.author;
    this.editBookForm.bookPages.value = this.pages;
    document.querySelector(`#editBookForm [value="${this.progress}"]`).checked = true;


}


function resetAllIds() {
    myNook.forEach(book => book.setDataIndex());
}

function addBookToNook(book) {
    myNook.push(book);
}

function deleteBookCard(index) {
    let currentBookCard = document.querySelector(`[data-index="${index}"`);
    currentBookCard.remove();

    //delete and update ids of all array elements
    myNook.splice(index, 1);
    resetAllIds();
}

function displayNook() {
    console.log(myNook);
    myNook.forEach((book) => {
        if (!book.printed) {
            bookCard = book.createBookCard();
            console.log(bookCard);
            nook.appendChild(bookCard);

            //so book doesn't display again
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

addBookForm.addEventListener('submit', function (e) {
    console.log(this)
    NewBook = new Book(this.bookTitle.value, this.bookAuthor.value, this.bookPages.value, this.bookRead.value);
    console.log(NewBook);
    addBookToNook(NewBook);
    displayNook();
    NewBook.setDataIndex();
});


