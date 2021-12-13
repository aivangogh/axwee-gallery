const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const bodyParser = require('body-parser');
const path = require('path');
const passport = require('passport');
const flash = require('connect-flash');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const morgan = require('morgan');

const app = express();

// for .env variable
require('dotenv').config();

// Passport Config
require('./src/config/passport')(passport);

// Connection for database
require('./src/config/database');

// EJS
app.use(express.static(path.join(__dirname, 'public')));
app.use(expressLayouts);
app.set('views', path.join(__dirname, './src/views'));
app.set('view engine', 'ejs');

// Express body parser
app.use(express.urlencoded({ extended: true }));

// Sessions
const sessionStore = new MongoStore({
  mongoUrl: process.env.MONGODB_URL,
  collection: 'sessions',
});

app.use(
  session({
    secret: process.env.SESSION_KEY,
    resave: false,
    saveUninitialized: true,
    store: sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);

// Global middlewares
app.use(morgan('dev')); // log every request to the console
app.use(express.json());

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

// Connect flash
app.use(flash());

// Global variables
app.use(function (req, res, next) {
  res.locals.session = req.session;
  res.locals.files = req.files;
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  next();
});

// Routes
app.use('/', require('./src/routes/index'));
app.use('/api', require('./src/routes/api'));
app.use('/auth', require('./src/routes/auth'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, console.log(`Server running on ${PORT}`));
