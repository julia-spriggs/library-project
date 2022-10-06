//app.use([path,] callback [, callback...])

const isLoggedIn = (req, res, next) => {
    if(req.session.currentUser){
        next();
    } else {
        res.redirect("/login")
    }
}

module.exports = isLoggedIn;