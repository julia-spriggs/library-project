const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");
const User = require("../models/User.model");

const router = require("express").Router();

const saltRounds = 10;

//SIGNUP: display form
router.get("/signup", (req, res, next) => {
    res.render("auth/signup");
});


//SIGNUP: process form
router.post("/signup", (req, res, next) => {

    const {email, password} = req.body;

    const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
    if (!regex.test(password)) {
      res.status(400).render('auth/signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
    }

    bcryptjs
        .genSalt(saltRounds)
        .then(salt => {
            return bcryptjs.hash(password, salt)
        })
        .then((hash) => {
            const userDetails = {
                email,
                passwordHash: hash
            }
            
            return User.create(userDetails);
        })
        .then(userFromDB => {
            res.redirect("/");
        })
        .catch(e => {
            if (e instanceof mongoose.Error.ValidationError) {
                res.status(400).render('auth/signup', { errorMessage: e.message });
            } else if (e.code === 11000) {
                res.status(400).render('auth/signup', { errorMessage: "Email already in use" });
            } else {
                next(e);
            }
        });
});


//LOGIN: display form
router.get('/login', (req, res) => res.render('auth/login'));


//LOGIN: process form
router.post("/login", (req, res, next) => {
    const {email, password} = req.body;

    if (!email || !password) {
        res.render('auth/login', { errorMessage: 'Please enter both, email and password to login.' });
        return;
    }

    User.findOne({email: email})
        .then( userFromDB => {
            if(!userFromDB){
                //user does not exist
                res.render('auth/login', { errorMessage: 'Email is not registered. Try with other email.' });
                return;
            } else if (bcryptjs.compareSync(password, userFromDB.passwordHash)) {
                //login sucessful
                req.session.currentUser = userFromDB;
                res.redirect("/user-profile");
            } else {
                //login failed
                res.render('auth/login', { errorMessage: 'Incorrect credentials.' });
            }
        })
        .catch(error => {
            console.log("Error trying to login", error)
            next(error);
        });
});


//USER-PROFILE
router.get('/user-profile', (req, res) => {
    res.render('users/user-profile');
});


//LOGOUT
router.post('/logout', (req, res, next) => {
    req.session.destroy(err => {
        if (err) {
            next(err);
        } else {
            res.redirect('/');
        }
    });
});

module.exports = router;