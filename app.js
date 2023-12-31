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
const closeEditDialogButton = document.querySelector('#editBookModal #closeDialog');
const newBookReadRadios = document.querySelectorAll('#newBookForm [name="bookRead"]');
const closeFullBookDialogButton = document.querySelector('#fullBookCardModal #closeDialog');


let tempBookReview;

function Book(title, author, pages, progress) {
    "use strict";

    this.title = title;
    this.author = author;
    this.pages = pages;
    this.progress = progress;
    this.review = null;
    this.id = null;

    // prevent reprint upon new books
    this.printed = false;

    // checks to see if instance has a review for it
    this.reviewed = false;

    this.init();
}

Book.prototype.init = function () {
    this.cacheDOM();
    this.createHTML();
    this.createDOM();
    this.bindHTML();
}

Book.prototype.cacheDOM = function () {
    //html elements declared as constructor properties to bind
    this.editBookForm = document.querySelector('#editBookForm');
    this.bookReadRadios = document.querySelectorAll('#editBookForm [name="bookRead"]');
}

Book.prototype.createHTML = function () {
    this.bookCardWrapper = document.createElement('div');
    this.bookCard = document.createElement('div');

    this.bookTitle = document.createElement('div');
    this.bookAuthor = document.createElement('div');
    this.bookPages = document.createElement('div');
    this.bookRead = document.createElement('div');

    this.cardHeaderContainer = document.createElement('div');
    this.cardDetailsContainer = document.createElement('div');
    this.bookCardButtonContainer = document.createElement('div');

    this.deleteButton = document.createElement('button');
    this.editButton = document.createElement('button');

    this.bookCard.classList.add('bookCard');
    this.bookCardWrapper.classList.add('bookCardWrapper');
    this.cardHeaderContainer.classList.add('cardHeaderContainer');
    this.cardDetailsContainer.classList.add('cardDetailsContainer');
    this.bookTitle.classList.add('bookCardTitle');
    this.bookAuthor.classList.add('bookCardAuthor');
    this.bookPages.classList.add('bookCardPages');
    this.bookRead.classList.add('bookCardRead');
    this.deleteButton.classList.add('bookCardButton');
    this.editButton.classList.add('bookCardButton');
    this.bookCardButtonContainer.classList.add('bookCardButtonContainer');

    this.bookReview = document.createElement('div');

}

Book.prototype.createDOM = function () {

    this.bookCardButtonContainer.appendChild(this.deleteButton);
    this.bookCardButtonContainer.appendChild(this.editButton);

    this.cardHeaderContainer.appendChild(this.bookTitle);
    this.cardHeaderContainer.appendChild(this.bookAuthor);

    this.cardDetailsContainer.appendChild(this.bookRead);
    this.cardDetailsContainer.appendChild(this.bookPages);

    this.bookCard.appendChild(this.cardHeaderContainer);
    this.bookCard.appendChild(this.cardDetailsContainer);
    this.bookCard.appendChild(this.bookCardButtonContainer);


    this.bookCardWrapper.appendChild(this.bookCard);
}

Book.prototype.bindHTML = function () {
    //implement delete and edit buttons to be properties of Book constructor
    //this is done to intrinsically bind each element to its parent object

    this.deleteButton.addEventListener('click', () => deleteBookCard(this.id).bind(this));


    this.editButton.addEventListener('click', () => {
        // from being added to form every time the edit button is clicked
        editBookModal.showModal();

        this.prefillEditBookForm();
        disableReview();

        this.editBookForm.addEventListener('submit', this.updateEditBook.bind(this));

        // greys out review button on edit bookModal
        this.bookReadRadios.forEach(function (radio) {
            radio.addEventListener('change', disableReview);
        });
    });

}

//method to create bookCard html element
Book.prototype.createBookCard = function () {

    this.bookTitle.textContent = `${this.title}`;
    this.bookAuthor.textContent = `by ${this.author}`;
    this.bookPages.textContent = `${this.pages} pgs`;
    this.bookRead.textContent = `status: ${this.progress}`;

    this.deleteButton.textContent = 'remove';
    this.editButton.textContent = 'edit';

    if (this.reviewed) {
        this.addFullBookCardButtonToCard();
    }

    return this.bookCardWrapper;
}

//method to set an id from 
Book.prototype.setDataIndex = function () {
    this.id = myNook.indexOf(this);

    this.bookCardWrapper.setAttribute('data-index', this.id)
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

    this.createBookCard();

    if (this.reviewed) {
        this.addFullBookCardButtonToCard();
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

Book.prototype.addFullBookCardButtonToCard = function () {
    if (!this.fullBookCardButton) {
        this.fullBookCardButton = document.createElement('button');
        this.fullBookCardButton.textContent = "...";
        this.fullBookCardButton.classList.add('bookCardButton');
        this.fullBookCardButton.setAttribute('id', 'fullBookCardButton');
        this.bookCardButtonContainer.insertBefore(this.fullBookCardButton, this.deleteButton);

    }

    this.fullBookCardButton.addEventListener('click', () => {
        document.querySelectorAll('#fullBookCardModal div').forEach(div => div.remove());

        this.fullBookCardModal = document.querySelector('#fullBookCardModal');
        this.fullBookCardModal.showModal();

        this.bookTitle = document.createElement('div');
        this.bookAuthor = document.createElement('div');
        this.bookPages = document.createElement('div');
        txhis.bookRead = document.createElement('div');

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
const RedRising = new Book('Red Rising', 'Pierce Brown', 600, 'in progress');
addBookToNook(RedRising);
const BewareOfChicken = new Book('Beware of Chicken Vol 1', 'Casualfarmer', 500, 'read');
addBookToNook(BewareOfChicken);
const HeWhoFightsWithMonsters = new Book('He Who Fights With Monsters Vol 1', 'Shirtaloon', 650, 'read');
addBookToNook(HeWhoFightsWithMonsters);
displayNook();
RedRising.setDataIndex();
BewareOfChicken.setDataIndex();
HeWhoFightsWithMonsters.setDataIndex();

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

