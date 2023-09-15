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
const closeReviewDialogButton = document.querySelector('#bookReviewModal #closeDialog');
const bookReviewForm = document.querySelector('#reviewForm');
const bookReviewTextArea = document.querySelector('#reviewTextArea');
const closeDialogButton = document.querySelector('#closeDialog');
const closeEditDialogButton = document.querySelector('#editBookForm #closeDialog');
const newBookReadRadios = document.querySelectorAll('#newBookForm [name="bookRead"]');
const closeFullBookDialogButton = document.querySelector('#fullBookCardModal #closeDialog');


let tempBookReview;

function Book(title, author, pages, progress) {
    "use strict";

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.progress = progress;
    this.review;

    // prevent reprint upon new books
    this.printed = false;

    this.reviewed = false;

    //html elements declared as constructor properties to bind
    this.editBookForm = document.querySelector('#editBookForm');
    this.bookReadRadios = document.querySelectorAll('#editBookForm [name="bookRead"]');
    this.deleteButton = document.createElement('button');
    this.editButton = document.createElement('button');
    this.deleteButton.textContent = 'remove';
    this.editButton.textContent = 'edit';
    this.deleteButton.classList.add('bookCardButton');
    this.editButton.classList.add('bookCardButton');

    //implement delete and edit buttons to be properties of Book constructor
    //this is done to intrinsically bind each element to its parent object

    this.deleteButton.addEventListener('click', function () {
        let bookIndex = this.getAttribute('data-index');
        deleteBookCard(bookIndex);
    });


    this.editButton.addEventListener('click', () => {
        // from being added to form every time the edit button is clicked
        editBookModal.showModal();

        this.prefillEditBookForm();
        disableReview();

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

    if (this.reviewed) {
        this.addUserReviewButtonToCard();
    }

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
    if (tempBookReview) {
        this.review = tempBookReview;
        this.reviewed = true;
        tempBookReview = null;
    }

    this.title = this.editBookForm.bookTitle.value;
    this.author = this.editBookForm.bookAuthor.value;
    this.pages = this.editBookForm.bookPages.value;
    this.progress = this.editBookForm.bookRead.value;

    this.bookTitle.textContent = `title: ${this.title}`;
    this.bookAuthor.textContent = `author: ${this.author}`;
    this.bookPages.textContent = `pages: ${this.pages}`;
    this.bookRead.textContent = `status: ${this.progress}`;

    if (this.reviewed) {
        this.addUserReviewButtonToCard();
    }

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

Book.prototype.addUserReviewButtonToCard = function () {
    if (!this.fullBookCardButton) {
        this.fullBookCardButton = document.createElement('button');
        this.fullBookCardButton.textContent = "...";
        this.fullBookCardButton.classList.add('bookCardButton');
        this.fullBookCardButton.setAttribute('id', 'fullBookCardButton');
        this.bookCard.insertBefore(this.fullBookCardButton, this.deleteButton);
    }

    this.fullBookCardButton.addEventListener('click', () => {
        document.querySelectorAll('#fullBookCardModal div').forEach(div => div.remove());

        this.fullBookCardModal = document.querySelector('#fullBookCardModal');
        this.fullBookCardModal.showModal();

        this.bookTitle = document.createElement('div');
        this.bookAuthor = document.createElement('div');
        this.bookPages = document.createElement('div');
        this.bookRead = document.createElement('div');
        this.bookReview = document.createElement('div');

        this.bookTitle.textContent = `title: ${this.title}`;
        this.bookAuthor.textContent = `author: ${this.author}`;
        this.bookPages.textContent = `pages: ${this.pages}`;
        this.bookRead.textContent = `status: ${this.progress}`;
        this.bookReview.textContent = `thoughts: ${this.review}`;

        this.fullBookCardModal.appendChild(this.bookTitle);
        this.fullBookCardModal.appendChild(this.bookAuthor);
        this.fullBookCardModal.appendChild(this.bookPages);
        this.fullBookCardModal.appendChild(this.bookRead);
        this.fullBookCardModal.appendChild(this.bookReview);
    });
}


function logReview() {
    return bookReviewTextArea.value;
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
        editReviewButton.disabled = true;
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

    //add review to book if there is a review then reset temp book review to prevent memory leak of reviews
    if (tempBookReview) {
        NewBook.review = tempBookReview;
        NewBook.reviewed = true;
        tempBookReview = null;
    }

    // console.log(NewBook);
    addBookToNook(NewBook);
    displayNook();
    NewBook.setDataIndex();
    newBookForm.reset();
});

newBookButton.addEventListener('click', () => newBookModal.showModal());

closeDialogButton.addEventListener('click', () => newBookModal.close());

closeEditDialogButton.addEventListener('click', () => {
    this.editBookForm.removeEventListener('submit', this.updateEditBook);
    editBookModal.close();
});

closeReviewDialogButton.addEventListener('click', () => bookReviewModal.close());

closeFullBookDialogButton.addEventListener('click', () => fullBookCardModal.close());

newBookReadRadios.forEach((radio) => radio.addEventListener('change', disableReview));

newReviewButton.addEventListener('click', () => bookReviewModal.showModal());

editReviewButton.addEventListener('click', () => {
    bookReviewModal.showModal();
});

bookReviewForm.addEventListener('submit', () => {
    tempBookReview = logReview();
    bookReviewForm.reset();
});

