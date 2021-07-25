const express = require('express'),
  app = express(),
  router = require("./routes/indexRoutes"),
  path = require('path'),
  User = require("./models/user"),
  favicon = require('serve-favicon'),
  layouts = require('express-ejs-layouts'),
  methodOverride = require("method-override"),
  expressSession = require("express-session"),
  logger = require('morgan'),
  cookieParser = require('cookie-parser'),
  mongoose = require("mongoose"),
  connectFlash = require("connect-flash"),
  expressValidator = require("express-validator"),
  passport = require("passport"),
  bodyParser = require('body-parser');

// var index = require('./routes/index');
// var users = require('./routes/users');

mongoose.Promise = global.Promise
mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/ChatApp",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false
  });
const db = mongoose.connection;
db.once("open", () => {
  console.log("Successfully connected to MongoDB using Mongoose!");
});

// view engine setup
app.set('view engine', 'ejs');
app.use(layouts);
app.use(methodOverride("_method", {
  methods: ["POST", "GET"]
}));
app.use(cookieParser(process.env.COOKIE_SCRT || "bu6WQB5Ibsygaulina78opap928[93212^&*(!"));
const sessionMiddleware = expressSession({
  secret: process.env.SESSION_SCRT || "YYKkaxm9-sbsIbsygaulina78opap928[9",
  cookie: {
    maxAge: 4000000
  },
  resave: false,
  saveUninitialized: false
})
app.use(sessionMiddleware);
app.use(connectFlash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(expressValidator())
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use((req, res, next) => {
  res.locals.flashMessages = req.flash() || {};
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.public = false;
  // console.log(req.session)
  next();
});

app.set("port", process.env.PORT || 3000);
const port = app.get('port')

app.use("/", router) //this thing is location sensitive
// app.use(logger(":method :url :status * :response-time ms"))

// const server = app.listen(port, () => {
//   console.log(`The ChatApp server has started and is listening on port number: ${port}`);
// });
let server;

const boot = () => {
  server = app.listen(port, () => {
    console.info(`The ChatApp server has started and is listening on port number: ${port}`)
  })
}
const shutdown = () => {
  server.close()
  console.info("Test server closed")
}
if (require.main === module) {
  boot() // "node app.js" command
} else {
  console.info('Running app as a module')
  exports.boot = boot
  exports.shutdown = shutdown
  exports.port = port
}

exports.sessionMiddleware = sessionMiddleware
io = require("socket.io")(server);
require("./controllers/socketController")(io)

