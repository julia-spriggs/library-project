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

//UPDATE: display form
router.get('/books/:bookId/edit', (req, res, next) => {
    Book.findById(req.params.bookId)
    .then((bookDetails) => {
        res.render('books/book-edit', bookDetails);
    })
    .catch( err => {
        console.log('error getting book details from DB...', err);
        next();
    })
})

//UPDATE: process form
router.post("/books/:bookId/edit", (req, res, next) => {
    const bookId = req.params.bookId;
  
    const newDetails = {
      title: req.body.title,
      author: req.body.author,
      description: req.body.description,
      rating: req.body.rating,
    }
  
    Book.findByIdAndUpdate(bookId, newDetails)
      .then(() => {
        res.redirect(`/books/${bookId}`);
      })
      .catch(err => {
        console.log("Error updating book...", err);
      });
  });

//DELETE
router.post("/books/:bookId/delete", (req, res, next) => {
    Book.findByIdAndDelete(req.params.bookId)
      .then(() => {
        res.redirect("/books");
      })
      .catch(err => {
        console.log("Error deleting book...", err);
        next();
      });
  
  });

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
