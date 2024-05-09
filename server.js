// import packages
const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const morgan = require('morgan');
const session = require('express-session');

// create and configure Express app
const app = express();
app.set('view engine','ejs');

// connect to MongoDB Atlas with mongoose
mongoose.connect(process.env.MONGODB_URI)
mongoose.connection.on('connected', () => {
  console.log(`Connected to MongoDB Atlas at ${mongoose.connection.name}`);
});

// import controllers
const authController = require('./controllers/auth.js');

// import custom middleware
const isSignedIn = require('./middleware/is-signed-in.js');
const passUserToView = require('./middleware/pass-user-to-view.js');

// using middleware
app.use(morgan('dev'))
app.use(express.urlencoded({ extended: false }))
app.use(methodOverride('_method'))
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
}))
app.use(passUserToView);

// routes

// home Page
app.get('/', (req, res) => {
    res.render('index');
});

app.use('/auth', authController);
app.use(isSignedIn);





app.listen(process.env.PORT, ()=>{
    console.log(`The express app is ready on port ${process.env.PORT}!`);
})