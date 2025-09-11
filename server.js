// Load environment variables from .env file early
const dotenv = require('dotenv'); // import dotenv to handle environment config
dotenv.config(); // load variables into process.env
// Core dependencies
const express = require('express'); // express framework
const app = express(); // instantiate express app
const mongoose = require('mongoose'); // MongoDB ODM
const methodOverride = require('method-override'); // allows PUT/DELETE via forms
const morgan = require('morgan'); // request logger (currently optional)
const session = require('express-session'); // session middleware

// Custom middleware
const isSignedIn = require('./middleware/is-signed-in.js'); // auth gate
const passUserToView = require('./middleware/pass-user-to-view.js'); // inject user into res.locals

// Controllers (routers)
const authController = require('./controllers/auth.js'); // /auth routes
const allItemsController = require('./controllers/allitems.js'); // /items routes
const usersController = require('./controllers/users.js'); // /users community routes
// Config constants with defaults
const PORT = process.env.PORT || '3000'; // server port
const { MONGODB_URI, SESSION_SECRET } = process.env; // destructure needed env vars
// Connect to MongoDB
mongoose.connect(MONGODB_URI); // initiate connection

// Connection success log
mongoose.connection.on('connected', () => { // listen for connection event
  console.log(`Connected to MongoDB ${mongoose.connection.name}.`); // log db name
});
// Body parser for form submissions
app.use(express.urlencoded({ extended: false })); // parse application/x-www-form-urlencoded

// Method override to support PUT/DELETE from forms using ?_method=VERB or hidden input
app.use(methodOverride('_method')); // mount method-override middleware

// Optional request logging (uncomment for debugging)
// app.use(morgan('dev'));

// Session setup (stores session ID in cookie, data server-side/in memory by default)
app.use(
  session({
    secret: SESSION_SECRET, // secret for signing session ID cookie
    resave: false,          // don't save unchanged sessions
    saveUninitialized: true // create session for new visitors
  })
);

// Inject user (if any) into all rendered views
app.use(passUserToView); // attach res.locals.user

// Public auth routes (sign-in/up/out)
app.use('/auth', authController); // mount /auth router

// Protected community + items routes
app.use('/users', isSignedIn, usersController); // community pages
app.use('/items', isSignedIn, allItemsController); // pantry item CRUD

// Home page (conditionally shows different content if signed in)
app.get('/', (req, res) => { // root route handler
  res.render('index.ejs', { // render home template
    user: req.session.user // pass session user explicitly (also in res.locals)
  });
});

// Start the HTTP server
app.listen(PORT, () => { // begin listening on configured port
  console.log(`The express app is ready on port ${PORT}!`); // log startup message
});
