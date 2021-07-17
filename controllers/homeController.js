const passport = require("passport"),
    User = require("../models/user")
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
        let loggedIn = res.locals.loggedIn;
        if (loggedIn) {
            res.render("chatHome")
        }
        else{
            res.locals.redirect = "/login"
            req.flash("error", "You need to log in to be able to chat");
            next()
        }
        
    },
    signUp: (req, res, next) => {
        let newUser = new User(getUserParams(req.body));
        User.register(newUser, req.body.password, (error, user) => {
            if (user) {
                req.flash("success", "Registration was successful. Please login to continue");
                res.locals.redirect = "/login"
                next()
            } else {
                if(error.name=="UserExistsError"){
                    req.flash("error", "A user with the given email address already exists");
                    res.locals.redirect = "/sign-up"
                    next()
                }
                next(error)
            }
        })
        
    },
    signUpPage: (req, res) => {
        res.render("signUp")
    },
    login: (req, res) => {
        res.render("login")
    },
    validate: (req, res, next) => {
        req.sanitizeBody("email").normalizeEmail({
            all_lowercase: true
        })
            .trim();
        req.check("email", "Email is invalid").isEmail();
        req.check("password", "Password cannot be empty").notEmpty();
        req.getValidationResult().then((error) => {
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

    authenticate: passport.authenticate("local", {
        failureRedirect: "/login",
        failureFlash: "Failed to login.",
        successRedirect: "/chat",
        successFlash: "Logged in!"
    }),

    logout: (req, res, next) => {
        req.logout();
        req.flash("success", "You have been logged out!");
        res.locals.redirect = "/";
        next();
    },
};