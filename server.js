'use strict';

const express = require('express');
require('dotenv').config();
require('ejs');
const superagent = require('superagent');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', newSearch);
app.post('/searches', searchForBooks);

function newSearch(request, response) {
  response.render('pages/index');
}

function searchForBooks(request, response) {
  console.log(request.body.search);
  const bookSearchedFor = request.body.search[0];
  const typeOfSearch = request.body.search[1];

  let url = `https://www.googleapis.com/books/v1/volumes?q=`;
}

if (typeOfSearch === 'title') {
  url += `+intitle:${bookSearchedFor}`;
}

if (typeOfSearch === 'author') {
  url += `+inauthor:${bookSearchedFor}`;
}

superagent.get(url)
  .then(results => {
    const bookArray = results.body.items.map(book => {
      return new book(book.volumeInfo);
    })

    response.status(200).render('pages/searches/show');
  })

  .catch(error => {
    console.error('ruh roh, we messed up!');
  })

function Book(bookObj) {
  const bookImage = `https://i.imgur.com/J5LVHEL.jpg`;

}

app.listen(PORT, () => { console.log(`turned up on ${PORT}`) });
