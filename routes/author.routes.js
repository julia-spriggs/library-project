const Author = require("../models/Author.model");

const router = require("express").Router();


//READ: List all authors
router.get("/authors", (req, res, next) => {
  Author.find()
    .then(authors => {
      res.render("authors/authors-list", { authors });
    })
    .catch(err => {
      console.log('Error getting authors from DB...', err);
      next(err);
    })
});



//CREATE: display form
router.get("/authors/create", (req, res, next) => {
  res.render("authors/author-create");
});



//CREATE: process form
router.post("/authors/create", (req, res, next) => {
  
  const authorDetails = {
    name: req.body.name,
    age: req.body.age,
    country: req.body.country,
  }

  Author.create(authorDetails)
    .then(() => {
      res.redirect("/authors");
    })
    .catch(err => {
      console.log("error creating new author in DB", err);
      next(err);
    })

})

module.exports = router;
