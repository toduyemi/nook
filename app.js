const myNook = [];
const nook = document.querySelector('#nook');
const newBookButton = document.querySelector(' #newBookButton');
const newBookModal = document.querySelector('#newBookModal');
const editBookModal = document.querySelector('#editBookModal');
const newBookForm = document.querySelector('#newBookForm')
const shelveButton = document.querySelector('#shelveBook');
const newReviewButton = document.querySelector('#newBookModal #reviewButton');
const editReviewButton = document.querySelector('#editBookModal #reviewButton');
const bookReviewModal = document.querySelector('#bookReviewModal');
const closeReviewDialogButton = document.querySelector('#bookReviewModal #closeDialog')
const closeDialogButton = document.querySelector('#closeDialog');
const closeEditDialogButton = document.querySelector('#editBookForm #closeDialog');
const newBookReadRadios = document.querySelectorAll('#newBookForm [name="bookRead"]');

function Book(title, author, pages, progress) {
    "use strict";

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.progress = progress;

    // prevent reprint upon new books
    this.printed = false;

    //html elements declared as concstructor properties to bind
    this.editBookForm = document.querySelector('#editBookForm');
    this.bookReadRadios = document.querySelectorAll('#editBookForm [name="bookRead"]');
    this.deleteButton = document.createElement('button');
    this.editButton = document.createElement('button');
    this.deleteButton.textContent = 'remove';
    this.editButton.textContent = 'edit';


    //implement delete and edit buttons to be properties of Book constructor
    //this is done to intrinsically bind each element to its parent object
    this.deleteButton.classList.add('bookCardButton');
    this.deleteButton.addEventListener('click', function () {
        let bookIndex = this.getAttribute('data-index');
        deleteBookCard(bookIndex);
    });

    this.editButton.classList.add('bookCardButton');
    this.editButton.addEventListener('click', () => {
        console.log(this);
        // event Handler tracker prevents an eventhandler 
        // from being added to form every time the edit button is clicked
        editBookModal.showModal();
        this.prefillEditBookForm();

        // submit edit
        this.updateEditBook = this.updateEditBook.bind(this);
        this.editBookForm.addEventListener('submit', this.updateEditBook);

        // greys out review button on edit bookModal
        this.bookReadRadios.forEach(function (radio) {
            radio.addEventListener('change', disableReview);
        });
    });

}

//method to create bookCard html element
Book.prototype.createBookCard = function () {
    //create bookcard div as a property of Book constructor
    this.bookCard = document.createElement('div');
    this.bookCard.classList.add('bookCard');

    //these properties represent html elements bound to each book object constructed
    this.bookTitle = document.createElement('div');
    this.bookAuthor = document.createElement('div');
    this.bookPages = document.createElement('div');
    this.bookRead = document.createElement('div');

    this.bookTitle.textContent = `title: ${this.title}`;
    this.bookAuthor.textContent = `author: ${this.author}`;
    this.bookPages.textContent = `pages: ${this.pages}`;
    this.bookRead.textContent = `status: ${this.progress}`;

    this.bookCard.appendChild(this.bookTitle);
    this.bookCard.appendChild(this.bookAuthor);
    this.bookCard.appendChild(this.bookPages);
    this.bookCard.appendChild(this.bookRead);
    this.bookCard.appendChild(this.deleteButton);
    this.bookCard.appendChild(this.editButton);

    return this.bookCard;
}

//method to set an id from 
Book.prototype.setDataIndex = function () {
    this.id = myNook.indexOf(this);

    this.bookCard.setAttribute('data-index', this.id);

    //declared and attribute set down here due to dependency of bookCard dataindex css locator
    const bookCardButtons = document.querySelectorAll(`.bookCard[data-index="${this.id}"] .bookCardButton`);
    bookCardButtons.forEach((card) => card.setAttribute('data-index', this.id));

    return this.id;
}

Book.prototype.updateEditBook = function () {
    this.title = this.editBookForm.bookTitle.value;
    this.author = this.editBookForm.bookAuthor.value;
    this.pages = this.editBookForm.bookPages.value;
    this.progress = this.editBookForm.bookRead.value;

    this.bookTitle.textContent = `title: ${this.title}`;
    this.bookAuthor.textContent = `author: ${this.author}`;
    this.bookPages.textContent = `pages: ${this.pages}`;
    this.bookRead.textContent = `status: ${this.progress}`;

    // prevents event listeners from stacking => future calls will change any card already editted
    this.editBookForm.removeEventListener('submit', this.updateEditBook);
}

//method to placehold values from relevant bookCard to edit form modal
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

function disableReview() {
    // check to see if book has been read; conditions for both modals
    //have to find a way to clean this up ******
    if (document.querySelector('#editBookForm #bookRead').checked) {
        //show review button
        editReviewButton.disabled = false;
    }

    else {
        //hide review button
        editReviewButton.disabled = false;
    }


    if (document.querySelector('#newBookForm #bookRead').checked) {
        //show review button
        newReviewButton.disabled = false;
    }

    else {
        //hide review button
        newReviewButton.disabled = true;
    }
}

function displayNook() {
    console.log(myNook);
    myNook.forEach((book) => {
        if (!book.printed) {
            bookCard = book.createBookCard();
            // console.log(bookCard);
            nook.appendChild(bookCard);

            //so book doesn't display again
            book.printed = true;
        }
    });
}

//prefill 
RedRising = new Book('Red Rising', 'Pierce Brown', 600, 'in progress');
addBookToNook(RedRising);
BewareOfChicken = new Book('Beware of Chicken Vol 1', 'Casualfarmer', 500, 'read');
addBookToNook(BewareOfChicken);
displayNook();
RedRising.setDataIndex();
BewareOfChicken.setDataIndex();

newBookForm.addEventListener('submit', function () {
    let NewBook = new Book(this.bookTitle.value, this.bookAuthor.value, this.bookPages.value, this.bookRead.value);
    // console.log(NewBook);
    addBookToNook(NewBook);
    displayNook();
    NewBook.setDataIndex();
});

newBookButton.addEventListener('click', () => {
    newBookModal.showModal();
})

closeDialogButton.addEventListener('click', () => {
    newBookModal.close();
});

closeEditDialogButton.addEventListener('click', () => {
    editBookModal.close();
});

closeReviewDialogButton.addEventListener('click', () => {
    bookReviewModal.close();
});

newBookReadRadios.forEach(function (radio) {
    radio.addEventListener('change', disableReview);
});

reviewButton.addEventListener('click', () => {
    bookReviewModal.showModal();
});