const { render } = require("../app");
const Book = require("../models/Book.model");

const router = require("express").Router();

// list all books
router.get("/books", (req, res, next) => {
  Book.find()
  .then( booksFromDB => {
    res.render('books/books-list', {books: booksFromDB})
  })
  .catch( err => {
    console.log('error getting books from DB', err);
    next();
  })
});

//CREATE: display form
router.get('/books/create', (req, res, next) => {
    res.render('books/book-create');
})

//CREATE: process form
router.post('/books/create', (req, res, next) => {
    const bookDetails = {
        title: req.body.title,
        author: req.body.author,
        description: req.body.description,
        author: req.body.rating,
    }

    Book.create(bookDetails)
    .then( bookDetails => {
    res.send('your book was created')
    })
    .catch(err => {
        console.log('error creating new book in DB', err);
    })
})

// book details
router.get('/books/:bookId', (req, res, next) => {
    const id = req.params.bookId;

    Book.findById(id)
        .then(bookDetails => {
            res.render("books/book-details", bookDetails);
        })
        .catch( err => {
            console.log('error getting book details from DB', err);
            next();
        })
//    res.send(`displaying details for book with id... ${id}`)
});

module.exports = router;
