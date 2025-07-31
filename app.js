var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var booksRouter = require('./routes/books');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Redirect root '/' to '/books'
app.get('/', function(req, res) {
  res.redirect('/books');
});

// Use the books router
app.use('/books', booksRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404, 'Page Not Found'));
});

// global error handler
app.use(function(err, req, res, next) {
  // If status is not set, set to 500
  err.status = err.status || 500;
  // If message is not set, set a user-friendly message
  err.message = err.message || 'Something went wrong on the server';

  // Log error status and message to console
  console.error(`Error status: ${err.status} - Message: ${err.message}`);

  res.status(err.status);

  if (err.status === 404) {
    res.render('page-not-found', { error: err });
  } else {
    res.render('error', { err });
  }
});

module.exports = app;
