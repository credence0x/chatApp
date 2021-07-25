const passport = require("passport"),
    User = require("../models/user");

getUserParams = body => {
    return {
        name: {
            first: body.first,
            last: body.last
        },
        email: body.email,
        password: body.password
    };
};


module.exports = {
    home: (req, res) => {
        res.render("index")
    },

    redirectView: (req, res, next) => {
        let redirectPath = res.locals.redirect;
        if (redirectPath) res.redirect(redirectPath);
        else next();
    },

    chatHome: (req, res, next) => {

        res.render("chatHome")

    },

    validate: (req, res, next) => {
        req.sanitizeBody("email")
            .normalizeEmail({
                all_lowercase: true
            })
            .trim();
        req.check("email", "Email is invalid").isEmail();
        req.check("password", "Password cannot be empty").notEmpty();
        req.getValidationResult()
            .then((error) => {
                if (!error.isEmpty()) {
                    let messages = error.array().map(e => e.msg);
                    req.skip = true;
                    req.flash("error", messages.join(" and "));
                    res.locals.redirect = "/users/new";
                    next();
                } else {
                    next();
                }
            });
    },

    signUp: (req, res, next) => {
        let newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                req.flash("success", "Your registration was successful. Please login to continue");
                res.locals.redirect = "/login"
                next()
            } else {
                if (error.name == "UserExistsError") {
                    // em = ErrorMessage
                    let em = "A user with the given email address already exists"
                    req.flash("error", em)
                    let first = req.body.first,
                        last = req.body.last,
                        email = req.body.email;
                    queryParams = `?first=${first}&last=${last}&email=${email}`
                    res.locals.redirect = "/sign-up" + queryParams
                    next()
                };
                next(error)
            }
        })

    },

    signUpPage: (req, res) => {
        let repopulate = req.query || false
        console.log(req.body)
        res.render("signUp", { repopulate: repopulate })
    },

    login: (req, res) => {
        res.render("login")
    },


    authenticate: (req, res, next) => {
        passport.authenticate('local', (err, user, info) => {
            if (err) { next(err) }
            else if (!user) {
                req.flash("error", info.message)
                res.locals.redirect = "/login"
                next()
            } else {
                req.logIn(user, (err) => {
                    if (err) { next(err); }
                    req.flash("success", "Logged in successfully!")
                    if (!req.session.returnTo) {
                        res.locals.redirect = "/chat"
                    } else {
                        res.locals.redirect = req.session.returnTo //connect-ensure-login variable
                    }
                    next()
                });
            }
        })(req, res, next);

    },


    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    },
};